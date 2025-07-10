import * as Yup from "yup";
import CustomInputField from "../../Compontents/CoustomInputFiled";
import { forgetpassword } from "../../Services/ApiService";
import {toast } from "react-toastify";
import { useFormik } from "formik";
import CustomButton from "../../Compontents/CoustomButton";
import { Box, Typography } from "@mui/material";
import assets from "../../Uitils/Assets";
import { useNavigate } from "react-router-dom";
import { setEncryptedCookie } from "../../Uitils/Cookeis";

const validationSchema = Yup.object({
  email: Yup.string().required("Email is required"),
});

function ForgetPassword() {
  const navigate = useNavigate();



  const handleforgetpassword = (values: any) => {
    const formdatas = new FormData();
    formdatas.append("email", values.email);
    forgetpassword(formdatas)
      .then((response) => {
        if (response.data.status === 0) {
          toast.error(response.data.msg);
        } else if (response.data.status === 1) {
          toast.success("OTP successfully sent", {
            autoClose: 1000,
          });
          navigate("/verify-otp")
          setEncryptedCookie("reset_key", response.data.reset_key);
          setEncryptedCookie("otp_verify", response.data.reset_key);
        }
      })
      .catch((error) => {
        toast.error(error.message || "Something went wrong");
      });
  };

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema,
    onSubmit: handleforgetpassword,
  });

  const { handleChange, values, touched, errors, handleSubmit } = formik;

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
      <Box
        padding={5}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="20px"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
          width: "500px",
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
          Forgot Your Password?
        </Typography>

        <Typography fontSize={16} color="gray" textAlign="center">
          Enter your email or phone to receive a reset code
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          display="flex"
          flexDirection="column"
          gap="30px"
          alignItems="center"
          mt={2}
        >
          <CustomInputField
            name="email"
            label="Email or Phone"
            variant="outlined"
            type="text"
            value={values.email}
            onChange={handleChange}
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email ? errors.email : ""}
            sx={{ width: "350px" }}
          />

          <CustomButton
            buttonName="Send OTP"
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
          <CustomButton buttonName="back" variant="text" onClick={()=>navigate(-1)}  />
        </Box>
      </Box>
    </Box>
  );
}

export default ForgetPassword;
