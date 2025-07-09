// Placeorder.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";
import { Typography, Descriptions } from "antd";
import Title from "antd/es/typography/Title";
import { Select } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  customerdropdown,
  viewUser,
  directcoustomerlog,
  getactiveslot,
} from "../../../Services/ApiService";
import { useUserdata } from "../../../Hooks/UserHook";
import { toast } from "react-toastify";
import CustomButton from "../../../Compontents/CoustomButton";
import CustomInputField from "../../../Compontents/CoustomInputFiled";
import Qrcode from "../../../assets/Images/png/Qr.png";

const { Option } = Select;

const Placeorder = () => {
  const [data, setUserdata] = useState<UserData | null>(null);
  const [coustomerdropdow, setcoustomerdropdown] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>();
  const [activeslot, setactiveslot] = useState<Getactiveslot>();
  const token = useUserdata();
  const navigate = useNavigate();

  interface SlotDatas {
    id: number;
    name: string;
    status: number;
    start_time: string;
    end_time: string;
    booking_end: string;
    inventory_start_time: string | null;
    inventory_end_time: string;
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
  }

  interface Getactiveslot {
    status: number;
    msg: string;
    data: SlotDatas;
  }

  interface SlotData {
    slot_id: number;
    quantity: string;
    method: string;
    start_date: string;
  }
  interface Todayslotdata {
    slot_id: number;
    quantity: string;
    method: string;
    start_date: string;
  }

  interface Invoice {
    length: number;
    id: number;
    amount: string;
    file_path: string;
    invoice_month: number;
    invoice_month_name: string;
    invoice_number: string;
    paid_status: number;
  }

  interface UserData {
    name: string;
    user_name: string;
    email: string;
    phone: string;
    customer_type: number;
    pay_type: any;
    line_name: string;
    price_tag_name: string;
    status: number;
    created_at: string;
    updated_at: string | null;
    user_id: number;
    slot_data: SlotData[];
    today_slot_data: Todayslotdata[];
    invoice_data: Invoice;
  }

  interface User {
    user_id: number;
    name: string;
    unit_price: number;
    customer_type: number;
    pay_type: number;
  }

  const paymentOptions = [
    { label: "Cash", value: 1 },
    { label: "UPI", value: 2 },
  ];

  const selectedCustomer = coustomerdropdow.find(
    (user) => user.user_id === selectedUserId
  );

  useEffect(() => {
    const payload = new FormData();
    payload.append("token", token);
    payload.append("type", "1");
    customerdropdown(payload)
      .then((res) => setcoustomerdropdown(res.data.data))
      .catch(() => toast.error("Failed to load customers"));
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      const payload = new FormData();
      payload.append("token", token);
      payload.append("user_id", selectedUserId.toString());
      viewUser(payload)
        .then((res) => {
          setUserdata(res.data.data);
          console.log(res.data.data);
        })
        .catch(() => toast.error("Failed to load user details"));
    }
  }, [selectedUserId]);

  useEffect(() => {
    getactiveslots();
  }, []);

  const getactiveslots = () => {
    const payload = new FormData();
    payload.append("token", token);
    getactiveslot(payload).then((res) => {
      setactiveslot(res.data);
    });
  };

  const hasMorning = !!data?.today_slot_data.find((s) => s.slot_id == 1);
  const hasEvening = !!data?.today_slot_data.find((s) => s.slot_id == 2);

  const validationSchema = Yup.object({
    morning_quantity: Yup.number().when([], {
      is: () => hasMorning,
      otherwise: () => Yup.number().notRequired(),
    }),
    evening_quantity: Yup.number().when([], {
      is: () => hasEvening,
      otherwise: () => Yup.number().notRequired(),
    }),
    is_paid: Yup.boolean(),
    payment_type: Yup.number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value
      )
      .when("is_paid", {
        is: true,
        then: (schema) => schema.required("Payment Type is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    transaction_id: Yup.string().when("payment_type", {
      is: 2,
      then: () => Yup.string().required("Transaction ID is required for UPI"),
      otherwise: () => Yup.string().notRequired(),
    }),
    is_monthly_paid: Yup.boolean(),
    monthly_transaction_id: Yup.string().when("monthly_payment_type", {
      is: 2,
      then: () =>
        Yup.string().required("Monthly Transaction ID is required for UPI"),
      otherwise: () => Yup.string().notRequired(),
    }),
    monthly_payment_type: Yup.number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value
      )
      .when("is_monthly_paid", {
        is: true,
        then: (schema) => schema.required("Monthly Payment Type is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      morning_quantity: "",
      evening_quantity: "",
      is_paid: false,
      payment_type: 0,
      transaction_id: "",
      is_monthly_paid: false,
      monthly_payment_type: 0,
      monthly_transaction_id: "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Submitting", values);
      if (!data?.user_id) {
        toast.error("No user selected. Please select a customer.");
        return;
      }

      const totalQty =
        Number(values.morning_quantity || 0) +
        Number(values.evening_quantity || 0);

      const payload: any = {
        token,
        quantity: totalQty,
        customer_id: data.user_id,
      };

      if (data.pay_type === 1 && values.is_paid) {
        payload.is_paid = true;
        payload.payment_type = values.payment_type;
        if (Number(values.payment_type) === 2) {
          payload.transaction_id = values.transaction_id;
        }
      }

      if (data.pay_type === 2 && values.is_monthly_paid) {
        payload.is_monthly_paid = true;
        payload.monthly_id = data.invoice_data.id
        payload.monthly_payment_type = values.monthly_payment_type;
        if (Number(values.monthly_payment_type) === 2) {
          payload.monthly_transaction_id = values.monthly_transaction_id;
        }
      }

      directcoustomerlog(payload)
        .then((res) => {
          toast.success(res.data.msg || "Order submitted");
          formik.resetForm();
        })
        .catch((err) => {
          toast.error("Failed to submit order");
          console.error(err);
        });
    },
  });

  // console.log("FOrmik error", formik.errors);
  // console.log("FOrmik touched", formik.touched);
  // console.log("FOrmik values", formik.values);
  console.log(data)
  const totalQty =
    Number(formik.values.morning_quantity || 0) +
    Number(formik.values.evening_quantity || 0);

  const totalPrice = selectedCustomer?.unit_price
    ? totalQty * selectedCustomer.unit_price
    : 0;

  return activeslot?.status === 1 ? (
    <Box>
      <Paper sx={{ padding: 2, backgroundColor: "#E8F5E9" }}>
        <Typography style={{ fontSize: 25 }}>Place Order</Typography>
      </Paper>

      <Paper
        sx={{
          padding: 2,
          marginTop: 2,
          backgroundColor: "#E8F5E9",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Select
          showSearch
          placeholder="Select Customer"
          value={selectedUserId}
          onChange={(value) => setSelectedUserId(value)}
          style={{ width: "300px", marginTop: 16 }}
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)
              .toLowerCase()
              .includes(input.toLowerCase())
          }
        >
          {coustomerdropdow.map((user) => (
            <Option key={user.user_id} value={user.user_id}>
              {user.name}
            </Option>
          ))}
        </Select>

        <span>
          No users are available?{" "}
          <span
            onClick={() =>
              navigate("/dashboard/createuser", {
                state: { user_type: 5, from: "/place-order" },
              })
            }
            style={{
              textDecoration: "underline",
              cursor: "pointer",
              color: "blue",
            }}
          >
            Add customer
          </span>
        </span>
      </Paper>

      {data && (
        <Paper sx={{ marginTop: 2, padding: 2, backgroundColor: "#e8f5e9" }}>
          <Title level={4}>User Information</Title>
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Name">{data.name}</Descriptions.Item>
            <Descriptions.Item label="Username">
              {data.user_name}
            </Descriptions.Item>
            <Descriptions.Item label="Email">{data.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{data.phone}</Descriptions.Item>
            <Descriptions.Item label="Customer Type">
              {data.customer_type === 1 ? "Regular" : "Occasional"}
            </Descriptions.Item>
            <Descriptions.Item label="Pay Type">
              {data.pay_type === 1 ? "Daily" : "Monthly"}
            </Descriptions.Item>
            <Descriptions.Item label="Line Name">
              {data.line_name}
            </Descriptions.Item>
            <Descriptions.Item label="Price Tag">
              {data.price_tag_name}
            </Descriptions.Item>
            <Descriptions.Item label="Unit Price">
              ₹{selectedCustomer?.unit_price}
            </Descriptions.Item>
            <Descriptions.Item label="Total Price">
              ₹{totalPrice}
            </Descriptions.Item>
          </Descriptions>

          {!hasMorning || !hasEvening ? (
            <Box>
              <Paper sx={{ padding: 2, backgroundColor: "#E8F5E9" }}>
                <Typography style={{ fontSize: 25, fontWeight: 700 }}>
                  Place Order
                </Typography>
              </Paper>
              <Paper
                sx={{
                  height: "200px",
                  marginTop: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#E8F5E9",
                }}
              >
                <Typography style={{ fontWeight: "bold", fontSize: 30 }}>
                  -------No active slot found--------
                </Typography>
              </Paper>
            </Box>
          ) : (
            <Box
              component="form"
              onSubmit={formik.handleSubmit}
              sx={{ maxWidth: 500, mx: "auto", p: 2 }}
            >
              {hasMorning && activeslot.data.id == 1 && (
                <CustomInputField
                  fullWidth
                  label="Morning Quantity"
                  name="morning_quantity"
                  type="number"
                  value={formik.values.morning_quantity}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.morning_quantity &&
                    Boolean(formik.errors.morning_quantity)
                  }
                  helperText={
                    formik.touched.morning_quantity &&
                    formik.errors.morning_quantity
                  }
                />
              )}

              {hasEvening && activeslot.data.id == 2 && (
                <CustomInputField
                  fullWidth
                  label="Evening Quantity"
                  name="evening_quantity"
                  type="number"
                  value={formik.values.evening_quantity}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.evening_quantity &&
                    Boolean(formik.errors.evening_quantity)
                  }
                  helperText={
                    formik.touched.evening_quantity &&
                    formik.errors.evening_quantity
                  }
                />
              )}

              {data.pay_type === 1 && (
                <>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="is_paid"
                        checked={formik.values.is_paid}
                        onChange={formik.handleChange}
                      />
                    }
                    label="Is Paid?"
                  />

                  {formik.values.is_paid && (
                    <>
                      <TextField
                        select
                        fullWidth
                        label="Payment Type"
                        name="payment_type"
                        margin="normal"
                        value={formik.values.payment_type}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.payment_type &&
                          Boolean(formik.errors.payment_type)
                        }
                        helperText={
                          formik.touched.payment_type &&
                          formik.errors.payment_type
                        }
                      >
                        {paymentOptions.map((option) => (
                          <MenuItem value={option.value} key={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>

                      {formik.values.payment_type === 2 && (
                        <>
                          <Box sx={{ mt: 2 }}>
                            <Typography>Scan QR to Pay</Typography>
                            <img
                              src={Qrcode}
                              alt="UPI QR Code"
                              style={{ width: 200, height: 200 }}
                            />
                          </Box>
                          <CustomInputField
                            fullWidth
                            label="Transaction ID"
                            name="transaction_id"
                            value={formik.values.transaction_id}
                            onChange={formik.handleChange}
                            error={
                              formik.touched.transaction_id &&
                              Boolean(formik.errors.transaction_id)
                            }
                            helperText={
                              formik.touched.transaction_id &&
                              formik.errors.transaction_id
                            }
                          />
                        </>
                      )}
                    </>
                  )}
                </>
              )}

              {data.invoice_data &&
                data.invoice_data.length > 0 &&
                data.pay_type === 2 && (
                  <>
                     <Box sx={{marginBottom:2}}>
                    <Paper sx={{display:"flex", justifyContent:"space-between",padding:2,backgroundColor:"#E8F5E9"}}>
                     <Typography>Total amount Pay</Typography>
                    <Typography>{data.invoice_data.amount?data.invoice_data.amount:"0"}</Typography>
                      </Paper>

                    </Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="is_monthly_paid"
                          checked={formik.values.is_monthly_paid}
                          onChange={formik.handleChange}
                        />
                      }
                      label="Is Monthly Paid?"
                    />

                    {formik.values.is_monthly_paid && (
                      <>
                        <TextField
                          select
                          fullWidth
                          label="Monthly Payment Type"
                          name="monthly_payment_type"
                          margin="normal"
                          value={formik.values.monthly_payment_type}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.monthly_payment_type &&
                            Boolean(formik.errors.monthly_payment_type)
                          }
                          helperText={
                            formik.touched.monthly_payment_type &&
                            formik.errors.monthly_payment_type
                          }
                        >
                          {paymentOptions.map((option) => (
                            <MenuItem value={option.value} key={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>

                        {formik.values.monthly_payment_type === 2 && (
                          <>
                            <CustomInputField
                              fullWidth
                              label="Monthly Transaction ID"
                              name="monthly_transaction_id"
                              value={formik.values.monthly_transaction_id}
                              onChange={formik.handleChange}
                              error={
                                formik.touched.monthly_transaction_id &&
                                Boolean(formik.errors.monthly_transaction_id)
                              }
                              helperText={
                                formik.touched.monthly_transaction_id &&
                                formik.errors.monthly_transaction_id
                              }
                            />

                            <Box sx={{ mt: 2 }}>
                              <Typography>Scan UPI QR Code to Pay</Typography>
                              <img
                                src={Qrcode}
                                alt="UPI QR Code"
                                style={{ width: 200, height: 200 }}
                              />
                            </Box>
                          </>
                        )}
                      </>
                    )}
                  </>
                )}

              <CustomButton
                type="submit"
                buttonName="Submit"
                sx={{ backgroundColor: "#4EB24E" }}
              />
            </Box>
          )}
        </Paper>
      )}
    </Box>
  ) : (
    <Box>
      <Paper sx={{ padding: 2, backgroundColor: "#E8F5E9" }}>
        <Typography style={{ fontSize: 25, fontWeight: 700 }}>
          Place Order
        </Typography>
      </Paper>
      <Paper
        sx={{
          height: "200px",
          marginTop: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#E8F5E9",
        }}
      >
        <Typography style={{ fontWeight: "bold", fontSize: 30, color: "red" }}>
          No active slot found
        </Typography>
      </Paper>
    </Box>
  );
};

export default Placeorder;
