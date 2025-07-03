import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { useUserdata, useUsertype } from "../Hooks/UserHook";

// Public-only routes (like login, forgot password)
export const AuthPrivate = () => {
  const token = useUserdata();
  const type = useUsertype();

  if (!token) return <Outlet />;

  // Redirect based on role
  if (type == 1) return <Navigate to="/dashboard" replace />;
  if (type == 4) return <Navigate to="/distributor" replace />;
  if (type == 3) return <Navigate to="/userdashboard" replace />;

  return <Navigate to="/" replace />;
};

// Admin route guard
export const AdminPrivate = () => {
  const token = useUserdata();
  const type = useUsertype();
  return token && type === 1 ? <Outlet /> : <Navigate to="/" replace />;
};

// Vendor route guard
export const DistributorPrivate = () => {
  const token = useUserdata();
  const type = useUsertype();

  return token && type === 4 ? <Outlet /> : <Navigate to="/" replace />;
};

// User route guard
export const UserPrivate = () => {
  const token = useUserdata();
  const type = useUsertype();
  return token && type === 3 ? <Outlet /> : <Navigate to="/" replace />;
};

// Type for wrapper routes like OTP and Reset Password
interface AuthWrapperProps {
  type: "otp" | "reset";
}

// Reset password route protection
export const AuthGuard: React.FC<AuthWrapperProps> = ({ type }) => {
  const isOtpVerified = Cookies.get("otp_verify");
  const hasResetKey = Cookies.get("reset_key");

  if (type === "otp" && !isOtpVerified) {
    return <Navigate to="/forget-password" replace />;
  }

  if (type === "reset" && !hasResetKey) {
    return <Navigate to="/forget-password" replace />;
  }

  return <Outlet />;
};

