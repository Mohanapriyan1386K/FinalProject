import { Box, Typography } from "@mui/material";
import CustomInputField from "../../Compontents/CoustomInputFiled";
import assets from "../../Uitils/Assets";
import CustomButton from "../../Compontents/CoustomButton";
import * as Yup from "yup";
import { getDecryptedCookie } from "../../Uitils/Cookeis";
import { useFormik } from "formik";
import { resetpassword } from "../../Services/ApiService";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Cookie from "js-cookie";

function Resetpassword() {
  const navigate = useNavigate();
  const reset_key = getDecryptedCookie("reset_key");

  const validationSchema = Yup.object({
    new_password: Yup.string().required("New password is required"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("new_password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handlesumbitnewpassword = (values: any) => {
    const formdatas = new FormData();
    formdatas.append("new_password", values.new_password);
    formdatas.append("reset_key", reset_key);

    resetpassword(formdatas)
      .then((res) => {
        toast.success("Successfully reset password");
        Cookie.remove("reset_key");
        Cookie.remove("otp_verify");
        navigate("/");
      })
      .catch((error) => {
        toast.error("Failed to reset password");
      });
  };

  const formik = useFormik({
    initialValues: { new_password: "", confirm_password: "" },
    validationSchema,
    onSubmit: handlesumbitnewpassword,
  });

  const {
    handleBlur,
    handleChange,
    values,
    errors,
    handleSubmit,
    touched,
  } = formik;

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <ToastContainer />
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
          Reset Your Password
        </Typography>

        <Typography fontSize={16} color="gray" textAlign="center">
          Create a new password for your account
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
            type="password"
            name="new_password"
            label="New Password"
            variant="outlined"
            onChange={handleChange}
            value={values.new_password}
            onBlur={handleBlur}
            error={touched.new_password && Boolean(errors.new_password)}
            helperText={touched.new_password ? errors.new_password : ""}
            sx={{ width: "350px" }}
          />

          <CustomInputField
            type="password"
            name="confirm_password"
            label="Confirm Password"
            variant="outlined"
            onChange={handleChange}
            value={values.confirm_password}
            onBlur={handleBlur}
            error={touched.confirm_password && Boolean(errors.confirm_password)}
            helperText={touched.confirm_password ? errors.confirm_password : ""}
            sx={{ width: "350px" }}
          />

          <CustomButton
            type="submit"
            buttonName="Submit"
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
      </Box>
    </Box>
  );
}

export default Resetpassword;
