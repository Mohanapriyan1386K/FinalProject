import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Typography } from "@mui/material";
import { message, Spin } from "antd";
import CustomInput from "../CoustomInputFiled";
import CustomSelect from "./CustomSelect";
import CustomButton from "../CoustomButton";
import { getLinesDropDown, updateUser } from "../../Services/ApiService";
import { getDecryptedCookie } from "../../Uitils/Cookeis";
import { PriceTagData } from "../../Services/Data";

interface User {
  id: number;
  name: string;
  user_name: string;
  email: string;
  phone: string;
  alternative_number: string;
  user_type: number;
  customer_type: number;
  line_id: number;
  price_tag_id: number;
  pay_type: number;
  slot_data: {
    slot_id: number;
    quantity: number;
    method: number;
    start_date: string;
  }[];
}

interface Props {
  user: User;
  onBack: () => void;
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
  user_type: Yup.number().required().typeError("Select user type"),
  customer_type: Yup.number().required().typeError("Select customer type"),
  price_tag_id: Yup.number().required().typeError("Select price tag"),
  pay_type: Yup.number().required().typeError("Select pay type"),
  line_id: Yup.number().required("Line is required"),
  slot_data: Yup.array().when(["customer_type", "user_type"], (customer_type, user_type) => {
    if (customer_type === 1 && user_type !== 2) {
      return Yup.array()
        .of(
          Yup.object({
            slot_id: Yup.number().required("Select slot").min(1),
            quantity: Yup.number().required("Quantity is required").min(1),
            method: Yup.number().required("Select method").min(1),
            start_date: Yup.string().required("Start date is required"),
          })
        )
        .min(1, "At least one slot is required");
    }
    return Yup.array().notRequired();
  }),
});

const EditUserform: React.FC<Props> = ({ user, onBack }) => {
  const [priceOptions, setPriceOptions] = useState([]);
  const [lineOptions, setLineOptions] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = getDecryptedCookie("user_token").token;

  const formik = useFormik({
    initialValues: {
      name: user.name,
      user_name: user.user_name,
      email: user.email,
      phone: user.phone,
      alternative_number: user.alternative_number,
      user_type: user.user_type,
      customer_type: user.customer_type,
      price_tag_id: user.price_tag_id,
      line_id: user.line_id,
      pay_type: user.pay_type,
      slot_data: user.slot_data?.length ? user.slot_data : [{
        slot_id: 0,
        quantity: 0,
        method: 0,
        start_date: ""
      }],
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      const payload = {
        token,
        user_id: user.id,
        ...values,
      };

      try {
        setIsSubmitting(true);
        const res = await updateUser(payload);
        if (res.data?.status === 1) {
          message.success("User updated successfully");
          onBack();
        } else {
          message.error(res.data?.msg || "Update failed");
        }
      } catch (err) {
        console.error(err);
        message.error("Unexpected error occurred");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } = formik;

  const isAdmin = values.user_type === 2;
  const isRegularCustomer = values.customer_type === 1;

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
        message.error("Failed to load price tags");
      } finally {
        setLoadingDropdowns(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!values.user_type) return;
    const formData = new FormData();
    formData.append("token", token);
    formData.append("type", "1");

    (async () => {
      try {
        const res = await getLinesDropDown(formData);
        if (res.data.status === 1) {
          setLineOptions(
            res.data.data.map((line: any) => ({ label: line.line_name, value: line.id }))
          );
        } else {
          message.error(res.data.msg || "Line fetch failed");
        }
      } catch (error) {
        console.error("Line fetch error:", error);
      }
    })();
  }, [values.user_type]);

  const slotOptions = [
    { label: "Morning (09:15 - 13:00)", value: 1 },
    { label: "Evening (14:30 - 19:14)", value: 2 },
  ];

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", p: 3 }}>
      <Typography variant="h4" mb={2}>
        Edit User
      </Typography>

      {loadingDropdowns ? (
        <Spin />
      ) : (
        <form onSubmit={handleSubmit}>
          <CustomInput label="Name" name="name" value={values.name} onChange={handleChange} onBlur={handleBlur} error={errors.name} touched={touched.name} />
          <CustomInput label="Username" name="user_name" value={values.user_name} onChange={handleChange} onBlur={handleBlur} error={errors.user_name} touched={touched.user_name} />
          <CustomInput label="Email" name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} touched={touched.email} />
          <CustomInput label="Phone" name="phone" value={values.phone} onChange={handleChange} onBlur={handleBlur} error={errors.phone} touched={touched.phone} />
          <CustomInput label="Alternative Number" name="alternative_number" value={values.alternative_number} onChange={handleChange} onBlur={handleBlur} error={errors.alternative_number} touched={touched.alternative_number} />

          <CustomSelect label="User Type" name="user_type" value={values.user_type} options={[{ label: "Admin", value: 2 }, { label: "Vendor/logger", value: 1 }, { label: "Distributor", value: 4 }, { label: "Customer", value: 5 }]} onChange={(val) => setFieldValue("user_type", val)} onBlur={handleBlur} error={errors.user_type} touched={touched.user_type} />

          {!isAdmin && (
            <>
              <CustomSelect label="Customer Type" name="customer_type" value={values.customer_type} options={[{ label: "Regular", value: 1 }, { label: "Occasional", value: 2 }]} onChange={(val) => setFieldValue("customer_type", val)} onBlur={handleBlur} error={errors.customer_type} touched={touched.customer_type} />
              {isRegularCustomer && (
                <>
                  <CustomSelect label="Slot" name="slot_data[0].slot_id" value={values.slot_data?.[0]?.slot_id} options={slotOptions} onChange={(val) => setFieldValue("slot_data[0].slot_id", val)} onBlur={handleBlur} error={errors.slot_data?.[0]?.slot_id} touched={touched.slot_data?.[0]?.slot_id} />
                  <CustomInput label="Quantity" name="slot_data[0].quantity" type="number" value={values.slot_data?.[0]?.quantity} onChange={handleChange} onBlur={handleBlur} error={errors.slot_data?.[0]?.quantity} touched={touched.slot_data?.[0]?.quantity} />
                  <CustomSelect label="Method" name="slot_data[0].method" value={values.slot_data?.[0]?.method} options={[{ label: "Direct", value: 1 }, { label: "Distributor", value: 2 }]} onChange={(val) => setFieldValue("slot_data[0].method", val)} onBlur={handleBlur} error={errors.slot_data?.[0]?.method} touched={touched.slot_data?.[0]?.method} />
                  <CustomInput label="Start Date" name="slot_data[0].start_date" type="date" value={values.slot_data?.[0]?.start_date} onChange={handleChange} onBlur={handleBlur} error={errors.slot_data?.[0]?.start_date} touched={touched.slot_data?.[0]?.start_date} />
                </>
              )}
              <CustomSelect label="Select Line" name="line_id" value={values.line_id} options={lineOptions} onChange={(val) => setFieldValue("line_id", val)} onBlur={handleBlur} error={errors.line_id} touched={touched.line_id} />
              <CustomSelect label="Price Tag" name="price_tag_id" value={values.price_tag_id} options={priceOptions} onChange={(val) => setFieldValue("price_tag_id", val)} onBlur={handleBlur} error={errors.price_tag_id} touched={touched.price_tag_id} />
              <CustomSelect label="Pay Type" name="pay_type" value={values.pay_type} options={[{ label: "Daily", value: 1 }, { label: "Monthly", value: 2 }]} onChange={(val) => setFieldValue("pay_type", val)} onBlur={handleBlur} error={errors.pay_type} touched={touched.pay_type} />
            </>
          )}

          <Box mt={3} display="flex" gap={2}>
            <CustomButton buttonName="Update" type="submit" disabled={isSubmitting} />
            <CustomButton buttonName="Cancel" variant="outlined" type="button" onClick={onBack} />
          </Box>
        </form>
      )}
    </Box>
  );
};

export default EditUserform;
