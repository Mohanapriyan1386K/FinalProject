import type { RouteObject } from "react-router-dom";
import Logins from "../Screens/Auth/Logins";
import ForgetPassword from "../Screens/Auth/ForgetPassword";
import VerifyOtp from "../Screens/Auth/VerifyOtp";
import Resetpassword from "../Screens/Auth/Resetpassword";
import { AuthGuard } from "./PrivateRouter";

const authRoutes: RouteObject[] = [
  { path: "/", element: <Logins /> },
  { path: "forget-password", element: <ForgetPassword /> },
  {
    element: <AuthGuard type="otp" />,
    children: [
      {
        path: "verify-otp",
        element: <VerifyOtp />,
      },
    ],
  },
  {
    element: <AuthGuard type="reset" />,
    children: [
      {
        path: "reset-password",
        element: <Resetpassword />,
      },
    ],
  },
];
export default authRoutes;
