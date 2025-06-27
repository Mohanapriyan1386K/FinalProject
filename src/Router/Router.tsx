import { createHashRouter, RouterProvider, Navigate } from "react-router-dom";

// Auth pages
import Logins from "../Screens/Auth/Logins";
import ForgetPassword from "../Screens/Auth/ForgetPassword";
import VerifyOtp from "../Screens/Auth/VerifyOtp";
import Resetpassword from "../Screens/Auth/Resetpassword";
import PageNotFound from "../Screens/Auth/PageNotFound";

// Dashboards
import AdminDashboard from "../Screens/Home/Admin/Innventory";
import VendorDashboard from "../Screens/Home/Vendor/Vendor";
import UserDashboard from "../Screens/Home/Admin/Coustomer";

// Admin Pages
import User from "../Screens/Home/Admin/UserMangement";
import UserForm from "../Compontents/Admin/UserForm";

// Route guards
import {
  AuthPrivate,
  AdminPrivate,
  VendorPrivate,
  UserPrivate,
  PasswordAuth,
  OtpAuth,
} from "./PrivateRouter";

// Shared layout
import MainLayout from "../Layout/MainLayout";

const router = createHashRouter([
  // Redirect root path to /login
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  // Public auth routes (only accessible if not logged in)
  {
    path: "/",
    element: <AuthPrivate />,
    children: [
      { path: "login", element: <Logins /> },
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
    ],
  },

  // Admin Dashboard (Protected)
  {
    path: "/admin-dashboard",
    element: <AdminPrivate />,
    children: [
      {
        path: "",
        element: <MainLayout />,
        children: [
          { path: "", element: <AdminDashboard /> },
          { path: "users", element: <User /> },
          {path:"users/add",element:<UserForm/>},
          {path:"users/edit/:user_id",element:<UserForm/>  }
        ],
      },
    ],
  },

  // Vendor Dashboard (Protected)
  {
    path: "/vendor-dashboard",
    element: <VendorPrivate />,
    children: [
      {
        path: "",
        element: <MainLayout />,
        children: [{ path: "", element: <VendorDashboard /> }],
      },
    ],
  },

  // User Dashboard (Protected)
  {
    path: "/user-dashboard",
    element: <UserPrivate />,
    children: [
      {
        path: "",
        element: <MainLayout />,
        children: [{ path: "", element: <UserDashboard /> }],
      },
    ],
  },

  // 404 - Page Not Found
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

// Export wrapped provider
export default function AppRouterProvider() {
  return <RouterProvider router={router} />;
}
