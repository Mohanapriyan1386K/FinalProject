import { createHashRouter, RouterProvider} from "react-router-dom";

// Route guards
import {
  AuthPrivate,
  AdminPrivate,
  VendorPrivate,
  UserPrivate,
} from "./PrivateRouter";

// Auth route definitions
import authRoutes from "./AuthRoutes";

// 404 Page
import PageNotFound from "../Screens/Auth/PageNotFound";

// Role-based child routes
import { AdminRouter, VendorRouter, UserRouter } from "./Home";

const router = createHashRouter([
  {
    path: "/",
    element: <AuthPrivate />,
    children: authRoutes,
  },
  {
    path: "/admin-dashboard",
    element: <AdminPrivate />,
    children: AdminRouter,
  },
  {
    path: "/vendor-dashboard",
    element: <VendorPrivate />,
    children: VendorRouter,
  },
  {
    path: "/user-dashboard",
    element: <UserPrivate />,
    children: UserRouter,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

export default function AppRouterProvider() {
  return <RouterProvider router={router} />;
}
