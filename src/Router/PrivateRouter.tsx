import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import type { ReactNode } from "react";

// Public-only routes (like login, forgot password)
export const AuthPrivate = () => {
  const token = Cookies.get("user_token");
  const type = Cookies.get("user_type")?.toString();

  if (!token) return <Outlet />;

  // Redirect based on role
  if (type === "1") return <Navigate to="/admindashboard" replace />;
  if (type === "2") return <Navigate to="/vendordashboard" replace />;
  if (type === "3") return <Navigate to="/userdashboard" replace />;

  return <Navigate to="/" replace />;
};

// Admin route guard
export const AdminPrivate = () => {
  const token = Cookies.get("user_token");
  const type = Cookies.get("user_type")?.toString();

  return token && type === "1" ? <Outlet /> : <Navigate to="/" replace />;
};

// Vendor route guard
export const VendorPrivate = () => {
  const token = Cookies.get("user_token");
  const type = Cookies.get("user_type")?.toString();

  return token && type === "2" ? <Outlet /> : <Navigate to="/" replace />;
};

// User route guard
export const UserPrivate = () => {
  const token = Cookies.get("user_token");
  const type = Cookies.get("user_type")?.toString();

  return token && type === "3" ? <Outlet /> : <Navigate to="/" replace />;
};

// Type for wrapper routes like OTP and Reset Password
interface AuthWrapperProps {
  children: ReactNode;
  type: "otp" | "reset"
}

// Reset password route protection
export const AuthGuard: React.FC<AuthWrapperProps> = ({ children, type }) => {
  const isOtpVerified = Cookies.get("otp_verify");
  const hasResetKey = Cookies.get("reset_key");

  if (type === "otp" && !isOtpVerified) {
    return <Navigate to="/" replace />;
  }

  if (type === "reset" && !hasResetKey) {
    return <Navigate to="/forget-password" replace />;
  }

  return <>{children}</>;
};

