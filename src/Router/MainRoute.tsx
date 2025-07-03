import { createHashRouter, RouterProvider} from "react-router-dom";

// Route guards
import {
  AuthPrivate,
  AdminPrivate,
  DistributorPrivate,
} from "./PrivateRouter";

// Auth route definitions
import authRoutes from "./AuthRoutes";

// 404 Page
import PageNotFound from "../Screens/Auth/PageNotFound";

// Role-based child routes
import { AdminRouter, Distributor} from "./Home";

const router = createHashRouter([
  {
    element: <AuthPrivate />,
    children: authRoutes,
  },
  {
    path: "/dashboard",
    element: <AdminPrivate />,
    children: AdminRouter,
  },

  {
    path:"/distributor",
    element:<DistributorPrivate/>,
    children:Distributor
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

export default function AppRouterProvider() {
  return <RouterProvider router={router} />;
}
