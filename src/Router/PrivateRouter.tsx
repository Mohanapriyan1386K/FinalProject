import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import type { ReactNode } from "react";

// Public-only routes (like login, forgot password)
export const AuthPrivate = () => {
  const token = Cookies.get("user_token");
  const type = Cookies.get("user_type")?.toString();

  if (!token) return <Outlet />;

  // Redirect based on role
  if (type === "1") return <Navigate to="/admin-dashboard" replace />;
  if (type === "2") return <Navigate to="/vendor-dashboard" replace />;
  if (type === "3") return <Navigate to="/user-dashboard" replace />;

  return <Navigate to="/" replace />;
};

// Admin route guard
export const AdminPrivate = () => {
  const token = Cookies.get("user_token");
  const type = Cookies.get("user_type")?.toString();

  return token && type === "1" ? <Outlet /> : <Navigate to="/login" replace />;
};

// Vendor route guard
export const VendorPrivate = () => {
  const token = Cookies.get("user_token");
  const type = Cookies.get("user_type")?.toString();

  return token && type === "2" ? <Outlet /> : <Navigate to="/login" replace />;
};

// User route guard
export const UserPrivate = () => {
  const token = Cookies.get("user_token");
  const type = Cookies.get("user_type")?.toString();

  return token && type === "3" ? <Outlet /> : <Navigate to="/login" replace />;
};

// Type for wrapper routes like OTP and Reset Password
interface AuthWrapperProps {
  children: ReactNode;
}

// Reset password route protection
export const PasswordAuth = ({ children }: AuthWrapperProps) => {
  const key = Cookies.get("reset_key");
  return key ? children : <Navigate to="/forget-password" replace />;
};

// OTP route protection
export const OtpAuth = ({ children }: AuthWrapperProps) => {
  const otp = Cookies.get("otp_verify");
  return otp ? children : <Navigate to="/login" replace />;
};
