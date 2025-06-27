// UserForm.tsx
import React, { useEffect, useState } from "react";
import { useFormik, type FormikErrors } from "formik";
import * as Yup from "yup";
import { message, notification, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import CustomInput from "../CoustomInputFiled";
import CustomSelect from "./CustomSelect";
import { getDecryptedCookie } from "../../Uitils/Cookeis";
import { PriceTagData } from "../../Services/Data";
import {
  createUser,
  updateUser,
  getUserById,
  getLinesDropDown,
} from "../../Services/ApiService";

interface Slot {
  slot_id: number;
  quantity: number;
  method: number;
  start_date: string;
}

interface FormValues {
  name: string;
  user_name: string;
  email: string;
  phone: string;
  alternative_number: string;
  password: string;
  user_type: string | number;
  customer_type: number;
  price_tag_id: number;
  line_id: number;
  pay_type: number;
  slot_data: Slot[];
  isEdit: boolean;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  user_name: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email"),
  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number")
    .required("Phone is required"),
  alternative_number: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number")
    .notRequired(),
  password: Yup.string().when("isEdit", {
    is: false,
    then: (schema) => schema.required("Password is required"),
  }),
  user_type: Yup.number().required().typeError("Select user type"),
  customer_type: Yup.number().required().typeError("Select customer type"),
  price_tag_id: Yup.number().required().typeError("Select price tag"),
  pay_type: Yup.number().required().typeError("Select pay type"),
  line_id: Yup.number().required("Line is required"),
  slot_data: Yup.array().when(["user_type", "customer_type"], {
    is: (user_type: number, customer_type: number) =>
      user_type === 5 && customer_type === 1,
    then: () =>
      Yup.array()
        .of(
          Yup.object().shape({
            slot_id: Yup.number(),
            quantity: Yup.number().nullable(),
            method: Yup.number().nullable(),
            start_date: Yup.string().nullable(),
          })
        )
        .test(
          "at-least-one-slot",
          "At least one slot (morning or evening) must be filled",
          (slots = []) => slots.some((slot) => !!slot.quantity && !!slot.method)
        ),
    otherwise: () => Yup.mixed().notRequired(),
  }),
});

const UserForm: React.FC = () => {
  const navigate = useNavigate();
  const { user_id } = useParams();
  const isEdit = !!user_id;

  const [priceOptions, setPriceOptions] = useState([]);
  const [lineOptions, setLineOptions] = useState([]);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const slotOptions = [
    { label: "Morning (09:15 - 13:00)", value: 1 },
    { label: "Evening (14:30 - 19:14)", value: 2 },
  ];

  const token = getDecryptedCookie("user_token")?.token;

  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      user_name: "",
      email: "",
      phone: "",
      alternative_number: "",
      password: "",
      user_type: "",
      customer_type: 2,
      price_tag_id: 0,
      line_id: 0,
      pay_type: 0,
      slot_data: [{ slot_id: 0, quantity: 0, method: 0, start_date: "" }],
      isEdit,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const payload: any = {
        token,
        name: values.name,
        user_name: values.user_name,
        email: values.email,
        phone: values.phone,
        alternative_number: values.alternative_number,
        user_type: Number(values.user_type),
        customer_type: Number(values.customer_type),
        line_id: Number(values.line_id),
        price_tag_id: Number(values.price_tag_id),
        pay_type: Number(values.pay_type),
      };

      if (!isEdit && values.password) {
        payload.password = values.password;
      }

      const isRegularCustomer = Number(values.customer_type) === 1;
      if (isRegularCustomer && Array.isArray(values.slot_data)) {
        const cleanedSlotData = values.slot_data.filter(
          (slot) =>
            slot.slot_id && slot.quantity && slot.method && slot.start_date
        );
        if (cleanedSlotData.length > 0) {
          payload.slot_data = cleanedSlotData.map((slot) => ({
            slot_id: Number(slot.slot_id),
            quantity: Number(slot.quantity),
            method: Number(slot.method),
            start_date: slot.start_date,
          }));
        }
      }

      if (isEdit) {
        payload.user_id = user_id;
      }

      setIsSubmitting(true);
      try {
        const res = isEdit
          ? await updateUser(payload)
          : await createUser(payload);
        if (res.data?.status === 1) {
          message.success(isEdit ? "User updated!" : "User added!");
          navigate("/admin-dashboard/users");
        } else {
          message.error(res.data?.msg || "Operation failed");
        }
      } catch (err) {
        console.error(err);
        notification.error({ message: "Unexpected error occurred." });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    handleBlur,
    setFieldValue,
    setValues,
  } = formik;

  useEffect(() => {
    (async () => {
      try {
        const prices = await PriceTagData();
        setPriceOptions(
          prices?.data?.map((item: any) => ({
            label: item.price_tag_name,
            value: item.price_tag_value,
          })) || []
        );
      } catch {
        message.error("Failed to load price tag dropdowns");
      } finally {
        setIsLoadingDropdowns(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!values.user_type) return;
    const user = getDecryptedCookie("user_token");
    if (!user?.token) return;

    const formData = new FormData();
    formData.append("token", user.token);
    formData.append("type", user.user_type === 4 ? "2" : "1");

    (async () => {
      try {
        const res = await getLinesDropDown(formData);
        if (res.data.status === 1) {
          setLineOptions(
            res.data.data.map((line: any) => ({
              label: line.line_name,
              value: line.id,
            }))
          );
        } else {
          message.error(res.data.msg || "Failed to fetch line data.");
        }
      } catch (error) {
        console.error("Line dropdown error:", error);
        message.error("Error loading line data.");
      }
    })();
  }, [values.user_type]);

  useEffect(() => {
    if (!user_id || !token) return;
    (async () => {
      try {
        const formData = new FormData();
        formData.append("token", token);
        formData.append("user_id", user_id.toString());
        const res = await getUserById(formData);
        if (res.data.status === 1) {
          const userData = res.data.data;
          setValues({
            name: userData.name,
            user_name: userData.user_name,
            email: userData.email,
            phone: userData.phone,
            alternative_number: userData.alternative_number || "",
            password: "",
            user_type: String(userData.user_type),
            customer_type: Number(userData.customer_type),
            price_tag_id: Number(userData.price_tag_id),
            line_id: Number(userData.line_id),
            pay_type: Number(userData.pay_type),
            slot_data: userData.slot_data || [],
            isEdit: true,
          });
        } else {
          message.error(res.data.msg || "Failed to fetch user data");
        }
      } catch (err) {
        console.error("Error loading user:", err);
        message.error("Something went wrong loading user data");
      }
    })();
  }, [user_id, token]);

  const isAdmin = values.user_type?.toString() === "2";
  const isRegularCustomer = values.customer_type?.toString() === "1";

  const getSlotError = (key: keyof Slot) => {
    const slotErr = errors.slot_data?.[0];
    return typeof slotErr === "object"
      ? (slotErr as FormikErrors<Slot>)[key]
      : undefined;
  };

  const getSlotTouched = (key: keyof Slot) => {
    const slotTouch = touched.slot_data?.[0];
    return typeof slotTouch === "object" ? slotTouch[key] : undefined;
  };

  return (
    <Box sx={{ maxWidth: 700, margin: "auto", padding: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">
          {isEdit ? "Edit User" : "Add User"}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate("/admin-dashboard/users")}
          sx={{ px: 3 }}
        >
          Back
        </Button>
      </Box>

      {isLoadingDropdowns ? (
        <Box textAlign="center" mt={5}>
          <Spin size="large" />
        </Box>
      ) : (
        <form onSubmit={handleSubmit} autoComplete="off">
          <CustomInput
            label="Name"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.name}
            touched={touched.name}
          />
          <CustomInput
            label="Username"
            name="user_name"
            value={values.user_name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.user_name}
            touched={touched.user_name}
          />
          <CustomInput
            label="Email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            touched={touched.email}
          />
          <CustomInput
            label="Phone"
            name="phone"
            value={values.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.phone}
            touched={touched.phone}
          />
          <CustomInput
            label="Alternative Number"
            name="alternative_number"
            value={values.alternative_number}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.alternative_number}
            touched={touched.alternative_number}
          />

          {!isEdit && (
            <CustomInput
              label="Password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
              touched={touched.password}
            />
          )}

          <CustomSelect
            label="User Type"
            name="user_type"
            value={values.user_type}
            options={[
              { label: "Admin", value: 2 },
              { label: "Vendor/logger", value: 1 },
              { label: "Distributor", value: 4 },
              { label: "Customer", value: 5 },
            ]}
            onChange={(val) => setFieldValue("user_type", val)}
            onBlur={handleBlur}
            error={errors.user_type}
            touched={touched.user_type}
          />

          {!isAdmin && (
            <>
              <CustomSelect
                label="Customer Type"
                name="customer_type"
                value={values.customer_type}
                options={[
                  { label: "Regular", value: 1 },
                  { label: "Occasional", value: 2 },
                ]}
                onChange={(val) => setFieldValue("customer_type", val)}
                onBlur={handleBlur}
                error={errors.customer_type}
                touched={touched.customer_type}
              />

              {isRegularCustomer && (
                <>
                  <CustomSelect
                    label="Slot"
                    name="slot_data[0].slot_id"
                    value={values.slot_data?.[0]?.slot_id}
                    options={slotOptions}
                    onChange={(val) =>
                      setFieldValue("slot_data[0].slot_id", val)
                    }
                    onBlur={handleBlur}
                    error={getSlotError("slot_id")}
                    touched={getSlotTouched("slot_id")}
                  />
                  <CustomInput
                    label="Quantity"
                    name="slot_data[0].quantity"
                    type="number"
                    value={values.slot_data?.[0]?.quantity}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={getSlotError("quantity")}
                    touched={getSlotTouched("quantity")}
                  />
                  <CustomSelect
                    label="Method"
                    name="slot_data[0].method"
                    value={values.slot_data?.[0]?.method}
                    options={[
                      { label: "Direct", value: 1 },
                      { label: "Distributor", value: 2 },
                    ]}
                    onChange={(val) =>
                      setFieldValue("slot_data[0].method", val)
                    }
                    onBlur={handleBlur}
                    error={getSlotError("method")}
                    touched={getSlotTouched("method")}
                  />
                  <CustomInput
                    label="Start Date"
                    name="slot_data[0].start_date"
                    type="date"
                    value={values.slot_data?.[0]?.start_date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={getSlotError("start_date")}
                    touched={getSlotTouched("start_date")}
                  />
                </>
              )}

              <CustomSelect
                label="Line"
                name="line_id"
                value={values.line_id}
                options={lineOptions}
                onChange={(val) => setFieldValue("line_id", val)}
                onBlur={handleBlur}
                error={errors.line_id}
                touched={touched.line_id}
              />
              <CustomSelect
                label="Price Tag"
                name="price_tag_id"
                value={values.price_tag_id}
                options={priceOptions}
                onChange={(val) => setFieldValue("price_tag_id", val)}
                onBlur={handleBlur}
                error={errors.price_tag_id}
                touched={touched.price_tag_id}
              />
              <CustomSelect
                label="Pay Type"
                name="pay_type"
                value={values.pay_type}
                options={[
                  { label: "Daily", value: 1 },
                  { label: "Monthly", value: 2 },
                ]}
                onChange={(val) => setFieldValue("pay_type", val)}
                onBlur={handleBlur}
                error={errors.pay_type}
                touched={touched.pay_type}
              />
            </>
          )}

          <Box mt={3}>
            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              fullWidth
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </Box>
        </form>
      )}
    </Box>
  );
};

export default UserForm;
