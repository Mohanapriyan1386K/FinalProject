
import type { RouteObject } from "react-router-dom";
import AdminDashboard from "../Screens/Home/Admin/Innventory";
import User from "../Screens/Home/Admin/UserMangement";
import UserForm from "../Compontents/Admin/UserForm";
import MainLayout from "../Layout/MainLayout";
import VendorDashboard from "../Screens/Home/Vendor/Vendor";
import Inventorylistview from "../Screens/Home/Admin/Inventorylistview";
import Slotmapping from "../Screens/Home/Admin/Slotmapping";

export const AdminRouter: RouteObject[] = [
      {
        path: "",
        element: <MainLayout />,
        children: [
          { path: "", element: <AdminDashboard /> },
          { path: "users", element: <User /> },
          {path:"users/add",element:<UserForm/>},
          {path:"users/edit/:user_id",element:<UserForm/>},
          {path:"inventorylistview",element:<Inventorylistview/> },
          {path:"slotmapping",element:<Slotmapping/>}
        ],
      },
    ]


export const VendorRouter:RouteObject[]=[
      {
        path: "",
        element: <MainLayout />,
        children: [{ path: "", element: <VendorDashboard /> }],
      },
    ]

export const UserRouter:RouteObject[]=[
      {
        path: "",
        element: <MainLayout />,
        children: [{ path: "", element: <User/> }],
      },
    ]