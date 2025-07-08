import { Box, Typography } from "@mui/material";
import CustomInputField from "../../Compontents/CoustomInputFiled";
import CustomButton from "../../Compontents/CoustomButton";
import { useUserdata, useUsertype } from "../../Hooks/UserHook";
import { assets } from "../../Uitils/Assets";
import { sha1 } from "js-sha1";
import { logindata } from "../../Services/ApiService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setEncryptedCookie } from "../../Uitils/Cookeis";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { saltkey } from "../../../public/config";
import 'react-toastify/dist/ReactToastify.css'; // ✅ Required for toast styling

// Yup validation schema
const validationSchema = Yup.object({
  user_name: Yup.string().required("Username is required *"),
  password: Yup.string().required("Password is required *"),
});

function Logins() {
  const token = useUserdata();
  const userType = useUsertype();
  const navigate = useNavigate();

  useEffect(() => {
    if (token && userType === 1) {
      navigate("/dashboard");
    } else if (token && userType === 4) {
      navigate("/distributor");
    }
  }, [token, userType, navigate]);

  const handleLogin = (values: { user_name: string; password: string }) => {
    const formdatas = new FormData();
    formdatas.append("user_name", values.user_name);
    formdatas.append("password", values.password);
    formdatas.append("device_type", "3");
    formdatas.append("auth_code", sha1(saltkey + values.user_name));

    logindata(formdatas)
      .then((res) => {
        const data = res?.data;
        console.log("Login response:", data);

        if (!data) {
          toast.error("Unexpected response from server");
          return;
        }

        if (data.status === 0) {
          toast.error(data.msg || "Login failed");
        } else if (data.status === 1) {
          const userData = {
            token: data.token,
            user_id: data.user_id,
            user_name: data.user_name,
            user_type: data.user_type,
            is_daily: data.is_daily,
            is_occasional: data.is_occasional,
          };

          setEncryptedCookie("user_token", userData);
          Cookies.set("user_type", data.user_type.toString());

          toast.success("Login successful");

          setTimeout(() => {
            if (data.user_type === 1) {
              navigate("/dashboard");
            } else if (data.user_type === 4) {
              navigate("/distributor");
            }
          }, 500);
        } else if (data.status === 2) {
          setEncryptedCookie("reset_key", data.reset_key);
          toast.success("OTP sent successfully");
          setTimeout(() => navigate("/verify-otp"), 500);
        } else {
          toast.error("Unhandled server response");
        }
      })
      .catch((error) => {
        console.error("Login error", error?.response?.data || error.message);
        toast.error("Login failed. Please try again");
      });
  };

  const formik = useFormik({
    initialValues: { user_name: "", password: "" },
    validationSchema,
    onSubmit: handleLogin,
  });

  const { handleBlur, handleChange, values, touched, errors, handleSubmit } = formik;

  const handleForget = () => {
    navigate("/forget-password");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Poppins, sans-serif",
        background: `url(${assets.Background})`,
        backgroundSize: "cover",
      }}
    >
      <ToastContainer /> {/* ✅ ToastContainer included */}

      <Box
        padding={2}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="20px"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
          width: "400px",
          borderRadius: 5,
          backdropFilter: "blur(10px)",
        }}
      >
        <img
          src={assets.Logo}
          alt="Milk Dairy Logo"
          style={{ width: 150, marginBottom: 10 }}
        />

        <Typography
          fontSize={26}
          fontWeight="bold"
          color="#4CAF50"
          textAlign="center"
        >
          Welcome to MilkPro Sales
        </Typography>

        <Typography
          fontSize={18}
          fontStyle="italic"
          color="gray"
          textAlign="center"
        >
          Fresh Dairy Delivered Daily
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          display="flex"
          flexDirection="column"
          gap="10px"
          alignItems="center"
        >
          <CustomInputField
            sx={{ width: "350px" }}
            name="user_name"
            label="Username"
            variant="outlined"
            type="text"
            value={values.user_name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.user_name && Boolean(errors.user_name)}
            helperText={touched.user_name ? errors.user_name : ""}
          />

          <CustomInputField
            sx={{ width: "350px" }}
            name="password"
            label="Password"
            variant="outlined"
            type="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password && Boolean(errors.password)}
            helperText={touched.password ? errors.password : ""}
          />

          <CustomButton
            buttonName="Sign In"
            type="submit"
            sx={{
              width: "350px",
              backgroundColor: "#4CAF50",
              color: "white",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#45A049",
              },
            }}
          />
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            mt: 2,
          }}
        >
          <Typography fontSize={14} color="textSecondary">
            Need help?
          </Typography>
          <CustomButton
            onClick={handleForget}
            sx={{ color: "#4CAF50", textDecoration: "underline" }}
            variant="text"
            buttonName="Forgot Password?"
            type="button"
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Logins;
