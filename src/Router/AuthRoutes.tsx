import type { RouteObject } from "react-router-dom";
import Logins from "../Screens/Auth/Logins";
import ForgetPassword from "../Screens/Auth/ForgetPassword";
import VerifyOtp from "../Screens/Auth/VerifyOtp";
import Resetpassword from "../Screens/Auth/Resetpassword";
import {  AuthGuard } from "./PrivateRouter";

const authRoutes: RouteObject[] = [
  { path: "/", element: <Logins /> },
  { path: "forget-password", element: <ForgetPassword /> },
  {
    path: "verify-otp",
    element: (
    <AuthGuard type="otp">
      <VerifyOtp />
    </AuthGuard>
    ),
  },
  {
    path: "reset-password",
    element: (
    <AuthGuard type="reset">
      <Resetpassword />
    </AuthGuard>
    ),
  },
];
export default authRoutes;
