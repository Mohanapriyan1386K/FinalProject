import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Select } from "antd";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  fetchLinesDropDown,
  fetchPriceTagDropDown,
  fetchUserById,
  handleCreateUser,
  handleEditUser,
} from "../../../Services/ApiService";
import FormField from "../../../Compontents/CoustomInputFiled";
import { useNavigate } from "react-router-dom";
import {useUserdata} from "../../../Hooks/UserHook"

const { Option } = Select;

interface Line {
  id: string;
  line_name: string;
}
interface PriceTag {
  id: string;
  price_tag_name: string;
}
interface SlotEntry {
  id?: number;
  slot_id: number;
  quantity: string;
  method: string;
  start_date: string;
}
interface FormValues {
  name: string;
  user_name: string;
  email: string;
  phone: string;
  alternative_number: string;
  password: string;
  user_type: string;
  customer_type: string;
  line_id: string;
  price_tag_id: string;
  pay_type: string;
  slot_data: SlotEntry[];
}

const getValidationSchema = (isEdit: boolean) =>
  Yup.object({
    name: Yup.string().required("Required"),
    user_name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid").required("Required"),
    phone: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number")
      .required("Required"),
    alternative_number: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number")
      .notRequired(),
    password: isEdit
      ? Yup.string().notRequired()
      : Yup.string().required("Required"),
    user_type: Yup.string().required("Required"),
    customer_type: Yup.string().when("user_type", {
      is: "5",
      then: (schema) => schema.required("Customer type is required"),
    }),
    line_id: Yup.string().when("user_type", {
      is: "5",
      then: (schema) => schema.required("Line is required"),
    }),
    price_tag_id: Yup.string().when("user_type", {
      is: "5",
      then: (schema) => schema.required("Price Tag is required"),
    }),
    pay_type: Yup.string().when("user_type", {
      is: "5",
      then: (schema) => schema.required("Pay Type is required"),
    }),
    slot_data: Yup.array().when(["user_type", "customer_type"], {
      is: (user_type: string, customer_type: string) =>
        user_type === "5" && customer_type === "1",
      then: () =>
        Yup.array()
          .of(
            Yup.object().shape({
              slot_id: Yup.number().required("Slot ID required"),
              quantity: Yup.string().when("$index", {
                is: 0,
                then: (schema) => schema.required("Quantity required"),
                otherwise: (schema) => schema.notRequired(),
              }),
              method: Yup.string().when("$index", {
                is: 0,
                then: (schema) => schema.required("Method required"),
                otherwise: (schema) => schema.notRequired(),
              }),
              start_date: Yup.string().when(["$index", "quantity", "method"], {
                is: (index: number, quantity: string, method: string) =>
                  index === 0 || quantity || method,
                then: (schema) => schema.required("Start date required"),
                otherwise: (schema) => schema.notRequired(),
              }),
            })
          )
          .min(1, "At least one slot is required"),
      otherwise: () => Yup.mixed().notRequired(),
    }),
  });

const CreateUser = () => {
  const token=useUserdata()
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id;
  const isEdit = !!id;

  console.log(id);
  const [linesList, setLinesList] = useState<Line[]>([]);
  const [priceTagList, setPriceTagList] = useState<PriceTag[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (token) {
      const formData = new FormData();
      formData.append("token", token);
      formData.append("type", "1");
      formData.append("distributer_id", "123");

      fetchLinesDropDown(formData)
        .then((res) => setLinesList(res.data.data))
        .catch(() => setError("Failed to fetch lines"));

      fetchPriceTagDropDown(formData)
        .then((res) => setPriceTagList(res.data.data))
        .catch(() => setError("Failed to fetch price tags"));
    }
  }, [token]);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setValues,
  } = useFormik<FormValues>({
    initialValues: {
      name: "",
      user_name: "",
      email: "",
      phone: "",
      alternative_number: "",
      password: "",
      user_type: "",
      customer_type: "",
      line_id: "",
      price_tag_id: "",
      pay_type: "",
      slot_data: [
        { slot_id: 1, quantity: "", method: "", start_date: "" },
        { slot_id: 2, quantity: "", method: "", start_date: "" },
      ],
    },
    validationSchema: getValidationSchema(isEdit),
    onSubmit: (values) => {
      submitUserForm(values);
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

 const submitUserForm = (values: FormValues) => {
  if (!token) {
    toast.error("Token missing. Please login again.");
    return;
  }

  const isCustomer = values.user_type === "5";
  const isRegularCustomer = isCustomer && values.customer_type === "1";

  const morningSlot = values.slot_data?.[0] || {};
  const eveningSlot = values.slot_data?.[1] || {};

  const slotData = isRegularCustomer
    ? [
        ...(morningSlot.quantity &&
        morningSlot.method &&
        morningSlot.start_date
          ? [
              {
                id: morningSlot.id,
                slot_id: morningSlot.slot_id,
                quantity: parseFloat(morningSlot.quantity),
                method: parseInt(morningSlot.method, 10),
                start_date: morningSlot.start_date,
              },
            ]
          : []),
        ...(eveningSlot.quantity && eveningSlot.method
          ? [
              {
                id: eveningSlot.id,
                slot_id: eveningSlot.slot_id,
                quantity: parseFloat(eveningSlot.quantity),
                method: parseInt(eveningSlot.method, 10),
                start_date: morningSlot.start_date,
              },
            ]
          : []),
      ]
    : [];

  const payload: any = {
    token,
    ...(values.name && { name: values.name }),
    ...(values.user_name && { user_name: values.user_name }),
    ...(values.email && { email: values.email }),
    ...(values.phone && { phone: values.phone }),
    ...(values.alternative_number && {
      alternative_number: values.alternative_number,
    }),
    ...(values.user_type && { user_type: parseInt(values.user_type) }),
    ...(isEdit && id ? { id: parseInt(id) } : { password: values.password }),
    ...(isCustomer && {
      customer_type: parseInt(values.customer_type),
      line_id: parseInt(values.line_id),
      price_tag_id: parseInt(values.price_tag_id),
      pay_type: parseInt(values.pay_type),
      ...(isRegularCustomer && { slot_data: slotData }),
    }),
  };

  const request = isEdit ? handleEditUser : handleCreateUser;

  request(payload)
    .then((response) => {
      const resData = response?.data;
      if (resData?.status === 1) {
        toast.success(resData.msg || "User saved successfully");
        navigate(-1);
        resetForm();
      } else {
        toast.error(resData?.msg || "Something went wrong");
      }
    })
    .catch(() => {
      toast.error(isEdit ? "Failed to update user" : "Failed to create user");
    });
};


  useEffect(() => {
    if (id && token) {
      const formData = new FormData();
      formData.append("token",token);
      formData.append("user_id", id);

      fetchUserById(formData)
        .then((res) => {
          const data = res.data.data;

          setValues({
            name: data.name || "",
            user_name: data.user_name || "",
            email: data.email || "",
            phone: data.phone || "",
            alternative_number: data.alternative_number || "",
            user_type: String(data.user_type || ""),
            customer_type: String(data.customer_type || ""),
            line_id: String(data.line_id || ""),
            price_tag_id: String(data.price_tag_id || ""),
            pay_type: data.pay_type != null ? String(data.pay_type) : "",
            slot_data: data.slot_data || [
              { slot_id: 1, quantity: "", method: "", start_date: "" },
              { slot_id: 2, quantity: "", method: "", start_date: "" },
            ],
            password: "",
          });
        })
        .catch(() => setError("Failed to fetch user details"));
    }
  }, [id, token]);

  const methodOptions = [
    { label: "Direct", value: 1 },
    { label: "Distributor", value: 2 },
  ];

  const renderSlotField = (index: number, label: string) => (
    <>
      <h5>{label}</h5>
      <div className="row">
        <div className="col-md-4 mb-3">
          <FormField
            label="Quantity"
            placeholder="quantity"
            name={`slot_data[${index}].quantity`}
            type="number"
            value={values.slot_data[index]?.quantity || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            error={(errors.slot_data?.[index] as any)?.quantity}
            touched={(touched.slot_data?.[index] as any)?.quantity}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label>Method</label>
          <Select
            value={values.slot_data[index]?.method || undefined}
            onChange={(val) => setFieldValue(`slot_data[${index}].method`, val)}
            placeholder="Select method"
            className="w-100"
          >
            {methodOptions.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
          {(touched.slot_data?.[index] as any)?.method &&
            (errors.slot_data?.[index] as any)?.method && (
              <div className="text-danger">
                {(errors.slot_data?.[index] as any)?.method}
              </div>
            )}
        </div>
        {index === 0 && (
          <div className="col-md-4 mb-3">
            <FormField
              placeholder="start date"
              label="Start Date"
              name={`slot_data[${index}].start_date`}
              type="date"
              value={values.slot_data[index]?.start_date || ""}
              onChange={(e) => {
                handleChange(e);

                setFieldValue(`slot_data[1].start_date`, e.target.value);
              }}
              onBlur={handleBlur}
              error={(errors.slot_data?.[index] as any)?.start_date}
              touched={(touched.slot_data?.[index] as any)?.start_date}
            />
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="container mt-4">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="d-flex justify-content-between mb-3">
        <h2>Add User</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <FormField
              placeholder="name"
              label="Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              touched={touched.name}
            />
          </div>
          <div className="col-md-6 mb-3">
            <FormField
              placeholder="username"
              label="Username"
              name="user_name"
              value={values.user_name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.user_name}
              touched={touched.user_name}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <FormField
              placeholder="email"
              label="Email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
            />
          </div>
          <div className="col-md-6 mb-3">
            <FormField
              placeholder="phone"
              label="Phone"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.phone}
              touched={touched.phone}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <FormField
              placeholder="alternative number"
              label="Alternative Number"
              name="alternative_number"
              value={values.alternative_number}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.alternative_number}
              touched={touched.alternative_number}
            />
          </div>
          {!isEdit && (
            <div className="col-md-6 mb-3">
              <FormField
                placeholder="password"
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password}
                touched={touched.password}
              />
            </div>
          )}
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label>User Type</label>
            <Select
              className="w-100"
              placeholder="Select user type"
              value={values.user_type}
              onChange={(val) => setFieldValue("user_type", val)}
            >
              <Option value="2">Admin</Option>
              <Option value="3">Vendor</Option>
              <Option value="4">Distributor</Option>
              <Option value="5">Customer</Option>
            </Select>
            {errors.user_type && (
              <div className="text-danger">{errors.user_type}</div>
            )}
          </div>
        </div>

        {values.user_type === "5" && (
          <>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label>Customer Type</label>
                <Select
                  className="w-100"
                  value={values.customer_type}
                  onChange={(val) => setFieldValue("customer_type", val)}
                  placeholder="Select customer type"
                >
                  <Option value="1">Regular</Option>
                  <Option value="2">Occasional</Option>
                </Select>
                {errors.customer_type && (
                  <div className="text-danger">{errors.customer_type}</div>
                )}
              </div>
              <div className="col-md-4 mb-3">
                <label>Line</label>
                <Select
                  className="w-100"
                  value={values.line_id}
                  onChange={(val) => setFieldValue("line_id", val)}
                  placeholder="Select line"
                >
                  {linesList.map((line) => (
                    <Option key={line.id} value={line.id}>
                      {line.line_name}
                    </Option>
                  ))}
                </Select>
                {errors.line_id && (
                  <div className="text-danger">{errors.line_id}</div>
                )}
              </div>
              <div className="col-md-4 mb-3">
                <label>Price Tag</label>
                <Select
                  className="w-100"
                  value={values.price_tag_id}
                  onChange={(val) => setFieldValue("price_tag_id", val)}
                  placeholder="Select price tag"
                >
                  {priceTagList.map((tag) => (
                    <Option key={tag.id} value={tag.id}>
                      {tag.price_tag_name}
                    </Option>
                  ))}
                </Select>
                {errors.price_tag_id && (
                  <div className="text-danger">{errors.price_tag_id}</div>
                )}
              </div>
              <div className="col-md-4 mb-3">
                <label>Pay Type</label>
                <Select
                  className="w-100"
                  value={values.pay_type}
                  onChange={(val) => setFieldValue("pay_type", val)}
                  placeholder="Select pay type"
                >
                  <Option value="1">Prepaid</Option>
                  <Option value="2">Postpaid</Option>
                </Select>
                {errors.pay_type && (
                  <div className="text-danger">{errors.pay_type}</div>
                )}
              </div>
            </div>

            {values.customer_type === "1" && (
              <>
                {renderSlotField(0, "Morning Slot")}
                {renderSlotField(1, "Evening Slot")}
              </>
            )}
          </>
        )}

        <div className="text-end mt-3">
          <button className="btn btn-primary" type="submit">
            {id ? "Update" : "Create"} User
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;
