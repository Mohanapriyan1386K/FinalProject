import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useUsertype } from "../Hooks/UserHook";

import Sidebar from "./Sidebar";

const MainLayout = () => {
  const userType = useUsertype();
  if (!userType) return <Box>Loading layout...</Box>;

  return (
    <Box display="flex" minHeight="100vh" gap={2}>
      <CssBaseline />
      {userType == 1 && (
        <>
          <Sidebar />
          <Box flexGrow={1} p={2}>
            <Outlet />
          </Box>
        </>
      )}
      {
        userType==4 &&(
          <>
             <Sidebar/>
             <Box>
               <Outlet/>
             </Box>
          </>
        )
      }
    </Box>
  );
};

export default MainLayout;
