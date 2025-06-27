import type { RouteObject } from "react-router-dom";
import Logins from "../Screens/Auth/Logins";
import ForgetPassword from "../Screens/Auth/ForgetPassword";
import VerifyOtp from "../Screens/Auth/VerifyOtp";
import Resetpassword from "../Screens/Auth/Resetpassword";
import {  OtpAuth, PasswordAuth } from "./PrivateRouter";

const authRoutes: RouteObject[] = [
  { path: "/", element: <Logins /> },
  { path: "forget-password", element: <ForgetPassword /> },
  {
    path: "verify-otp",
    element: (
      <OtpAuth>
        <VerifyOtp />
      </OtpAuth>
    ),
  },
  {
    path: "reset-password",
    element: (
      <PasswordAuth>
        <Resetpassword />
      </PasswordAuth>
    ),
  },
];
export default authRoutes;
