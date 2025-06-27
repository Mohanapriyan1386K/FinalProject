import React, { useState } from "react";
import { Input, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { verfiyotp } from "../../Services/ApiService";
import { getDecryptedCookie, setEncryptedCookie } from "../../Uitils/Cookeis";
import { assets } from "../../Uitils/Assets";
import CustomButton from "../../Compontents/CoustomButton";
import { Box } from "@mui/material";

const { OTP } = Input;

const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerifyOtp = () => {
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    const resetKey = getDecryptedCookie("reset_key");

    if (!resetKey) {
      toast.error("Reset key not found or invalid. Please try again.");
      return;
    }

    const formData = new FormData();
    formData.append("otp", otp);
    formData.append("reset_key", resetKey);
    console.log("before: ", resetKey);

    verfiyotp(formData)
      .then((res) => {
        const { data } = res;
        console.log("res data : ", res);
        if (data.status === 1) {
          toast.success("OTP verified successfully!");
          console.log("response on OTP sent: ", data.reset_key);
          setEncryptedCookie("reset_key", data.reset_key);
          navigate("/reset-password", { state: { from: "otp-verification" } });
        } else {
          toast.error(data.msg || "OTP verification failed.");
        }
      })
      .catch((err) => {
        console.error("API error:", err);
        toast.error("Error verifying OTP. Please try again.");
      });
  };

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

        <Typography>Verfiy OTP</Typography>

        <Typography>
          Enter the 6-digit OTP sent to your email or phone
        </Typography>

        <OTP
          value={otp}
          onChange={setOtp}
          length={6}
          autoFocus
          style={{
            letterSpacing: "0.5em",
            fontSize: "1.5em",
            width: "100%",
            maxWidth: "350px",
            textAlign: "center",
          }}
        />

        <CustomButton
          buttonName="Verify"
          onClick={handleVerifyOtp}
          sx={{
            width: "350px",
            backgroundColor: "#4CAF50",
            color: "white",
            fontWeight: "bold",
            marginTop: "10px",
            "&:hover": {
              backgroundColor: "#45A049",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default VerifyOtp;
