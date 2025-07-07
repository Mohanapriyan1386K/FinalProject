import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
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

const { Option } = Select;

const Placeorder = () => {
    interface Getactiveslot{
    status:number,
    msg:string
  }


  const [data, setUserdata] = useState<UserData | null>(null);
  const [coustomerdropdow, setcoustomerdropdown] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>();
  const [activeslot,setactiveslot]=useState<Getactiveslot>()
  const token = useUserdata();
  const navigate = useNavigate();

  interface SlotData {
    slot_id: number;
    quantity: string;
    method: string;
    start_date: string;
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
  }

  interface User {
    user_id: number;
    name: string;
    unit_price: number;
    customer_type: number;
    pay_type: any;
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
        .then((res) => setUserdata(res.data.data))
        .catch(() => toast.error("Failed to load user details"));
    }
  }, [selectedUserId]);


  useEffect(()=>{
     getactiveslots()
  },[])

  const getactiveslots=()=>{
    const payload=new FormData()
    payload.append("token",token)
    getactiveslot(payload).then((res)=>{
        setactiveslot(res.data)
    })
  }

  console.log(activeslot)

  const hasMorning = !!data?.slot_data.find((s) => s.slot_id === 1);
  const hasEvening = !!data?.slot_data.find((s) => s.slot_id === 2);

  const validationSchema = Yup.object({
    morning_quantity: Yup.number().when([], {
      is: () => hasMorning,
      then: () => Yup.number().required("Morning Quantity is required").min(1),
      otherwise: () => Yup.number().notRequired(),
    }),
    evening_quantity: Yup.number().when([], {
      is: () => hasEvening,
      then: () => Yup.number().required("Evening Quantity is required").min(1),
      otherwise: () => Yup.number().notRequired(),
    }),
    is_paid: Yup.boolean(),
    payment_type: Yup.number().when("is_paid", {
      is: true,
      then: () => Yup.number().required("Payment Type is required"),
      otherwise: () => Yup.number().notRequired(),
    }),
    transaction_id: Yup.string().when("payment_type", {
      is: 2,
      then: () => Yup.string().required("Transaction ID is required for UPI"),
      otherwise: () => Yup.string().notRequired(),
    }),
    is_monthly_paid: Yup.boolean(),
    monthly_id: Yup.string().when("is_monthly_paid", {
      is: true,
      then: () => Yup.string().required("Monthly ID is required"),
      otherwise: () => Yup.string().notRequired(),
    }),
    monthly_transaction_id: Yup.string().when("is_monthly_paid", {
      is: true,
      then: () => Yup.string().required("Monthly Transaction ID is required"),
      otherwise: () => Yup.string().notRequired(),
    }),
    monthly_payment_type: Yup.number().when("is_monthly_paid", {
      is: true,
      then: () => Yup.number().required("Monthly Payment Type is required"),
      otherwise: () => Yup.number().notRequired(),
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
      monthly_id: "",
      monthly_payment_type: "",
      monthly_transaction_id: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const totalQty =
        Number(values.morning_quantity || 0) +
        Number(values.evening_quantity || 0);

      const payload: any = {
        token,
        quantity: totalQty,
        customer_id: data?.user_id,
      };

      if (values.is_paid) {
        payload.is_paid = true;
        payload.payment_type = values.payment_type;
        if (Number(values.payment_type) === 2) {
          payload.transaction_id = values.transaction_id;
        }
      }

      if (values.is_monthly_paid) {
        payload.is_monthly_paid = true;
        payload.monthly_id = values.monthly_id;
        payload.monthly_payment_type = values.monthly_payment_type;
        payload.monthly_transaction_id = values.monthly_transaction_id;
      }

      directcoustomerlog(payload)
        .then((res) => toast.success(res.data.msg))
        .catch(() => toast.error("Failed to submit order"));
    },
  });

  const totalQty =
    Number(formik.values.morning_quantity || 0) +
    Number(formik.values.evening_quantity || 0);

  const totalPrice = selectedCustomer?.unit_price
    ? totalQty * selectedCustomer.unit_price
    : 0;

  return activeslot?.status==1?(
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
              {data.pay_type === 1 ? "Monthly" : "Daily"}
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

          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ maxWidth: 500, mx: "auto", p: 2 }}
          >
            {hasMorning && (
              <TextField
                fullWidth
                label="Morning Quantity"
                name="morning_quantity"
                type="number"
                margin="normal"
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
            {hasEvening && (
              <TextField
                fullWidth
                label="Evening Quantity"
                name="evening_quantity"
                type="number"
                margin="normal"
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
                    formik.touched.payment_type && formik.errors.payment_type
                  }
                >
                  {paymentOptions.map((option) => (
                    <MenuItem value={option.value} key={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>

                {formik.values.payment_type === 2 && (
                  <TextField
                    fullWidth
                    label="Transaction ID"
                    name="transaction_id"
                    margin="normal"
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
                )}
              </>
            )}

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
                  fullWidth
                  label="Monthly ID"
                  name="monthly_id"
                  margin="normal"
                  value={formik.values.monthly_id}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.monthly_id &&
                    Boolean(formik.errors.monthly_id)
                  }
                  helperText={
                    formik.touched.monthly_id && formik.errors.monthly_id
                  }
                />

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

                <TextField
                  fullWidth
                  label="Monthly Transaction ID"
                  name="monthly_transaction_id"
                  margin="normal"
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
              </>
            )}

            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 2 }}
              fullWidth
            >
              Submit
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  ):(
    <>
      <Box>
        <Paper sx={{ padding: 2, backgroundColor: "#E8F5E9" }}>
        <Typography style={{ fontSize: 25,fontWeight:700 }}>Place Order</Typography>
      </Paper>
       <Paper sx={{height:"200px",marginTop:2,display:"flex",justifyContent:"center",alignItems:"center",backgroundColor:"#E8F5E9"}}>
           <Box >
               <Typography style={{fontWeight:"bold",fontSize:30,color:"red"}}> No active slot found 😒 </Typography>
           </Box>
       </Paper>
      </Box>
    </>
  )
};

export default Placeorder;
