import type { RouteObject } from "react-router-dom";
import UserMangement from "../Screens/Home/Users/UserMangement";
import MainLayout from "../Layout/MainLayout";
import Inventory from "../Screens/Home/Inventory/Innventory";
import Inventorylistview from "../Screens/Home/Inventory/Inventorylistview";
import Slotmapping from "../Screens/Home/Inventory/Slotmapping";
import Distributer from "../Screens/Home/Distributed/Distributer";
import Route from "../Screens/Home/Distributed/Route";
import CreateUser from "../Screens/Home/Users/UersForm";
import AssignDistributor from "../Screens/Home/Distributed/AssignDistributor";
import Distributordasboard from "../Screens/Home/Distributed/Distributordasboard";

export const AdminRouter: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      { path: "", element: <UserMangement /> },
      { path: "createuser", element: <CreateUser /> },
      { path: "editUser", element: <CreateUser /> },
      { path: "inventory", element: <Inventory /> },
      { path: "inventory/inventorylistview", element: <Inventorylistview /> },
      { path: "inventory/slotmapping", element: <Slotmapping /> },
      { path: "distributedList", element: <Distributer /> },
      { path: "distributedList/Route", element: <Route /> },
      { path: "distributedList/Slotassign", element: <AssignDistributor /> },
    ],
  }
];

export const Distributor: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <Distributordasboard />,
      },
    ],
  },
];
