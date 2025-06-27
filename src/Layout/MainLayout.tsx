import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import Cookies from "js-cookie";

import AdminSidebar from "../Compontents/Admin/Sidebar";
import VendorSidebar from "../Compontents/Vendor/Sidebar";
import Navbar from "../Compontents/User/Navbar";

const MainLayout = () => {
  const userType = Cookies.get("user_type")
  if (!userType) return <Box>Loading layout...</Box>;

  return (
    <Box display="flex" minHeight="100vh">
      <CssBaseline />

      {userType === "1" && (
        <>
          <AdminSidebar />
          <Box flexGrow={1} p={2}>
            <Outlet />
          </Box>
        </>
      )}

      {userType === "2" && (
        <>
          <VendorSidebar />
          <Box flexGrow={1} p={2}>
            <Outlet />
          </Box>
        </>
      )}

      {userType === "3" && (
        <Box flexDirection="column" width="100%">
          <Navbar />
          <Box p={2} flexGrow={1}>
            <Outlet />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MainLayout;
