
import type { RouteObject } from "react-router-dom";
import UserMangement from "../Screens/Home/UserMangement";
import UserForm from "../Compontents/UserForm";
import MainLayout from "../Layout/MainLayout";
import Inventory from "../Screens/Home/Innventory"

import Inventorylistview from "../Screens/Home/Inventorylistview";
import Slotmapping from "../Screens/Home/Slotmapping";
import Distributer from "../Screens/Home/Distributer";
import Route from "../Screens/Home/Route";

export const AdminRouter: RouteObject[] = [
      {
        element: <MainLayout />,
        children: [
          { path: "", element: <UserMangement/> },
          {path:"add",element:<UserForm/>},
          {path:"edit",element:<UserForm/>},
          {path:"inventory",element:<Inventory/>},
          {path:"inventory/inventorylistview",element:<Inventorylistview/> },
          {path:"inventory/slotmapping",element:<Slotmapping/>},
          {path:"distributedList",element:<Distributer/>},
          {path:"distributedList/Route",element:<Route/>}
        ],
      },
    ]
