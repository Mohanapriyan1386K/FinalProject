import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useUsertype } from "../Hooks/UserHook";

import AdminSidebar from "./Sidebar";

const MainLayout = () => {
  const userType = useUsertype();
  if (!userType) return <Box>Loading layout...</Box>;

  return (
    <Box display="flex" minHeight="100vh">
      <CssBaseline />
      {userType == 1 && (
        <>
          <AdminSidebar />
          <Box flexGrow={1} p={2}>
            <Outlet />
          </Box>
        </>
      )}
    </Box>
  );
};

export default MainLayout;
