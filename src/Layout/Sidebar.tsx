// src/Components/Sidebar.tsx
import { NavLink } from "react-router-dom";
import assets from "../Uitils/Assets";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import { useState } from "react";
import LogoutModal from "../Screens/Modal/LogoutModal";

const drawerWidth = 240;
const menuItems = [
  {
    text: "User Management",
    to: "/dashboard",
    icon: <GroupAddIcon/>,
    
  },
  {
    text: "Inventory Management",
    to: "/dashboard/inventory",
    icon: <DashboardCustomizeIcon />,
  },
  {
    text: "Distributed",
    to: "/dashboard/distributedList",
    icon: <AddBusinessIcon />,
  },
];

const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const openLogoutModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#e8f5e9",
          color: "#1b5e20",
        },
      }}
    >
      <Toolbar>
        <Box display="flex" alignItems="center">
          <img src={assets.Logo} width={60} alt="Logo" />
          <Typography
            variant="h6"
            sx={{ color: "#2e7d32", fontWeight: "bold", ml: 1 }}
          >
            MilkPro Sales
          </Typography>
        </Box>
      </Toolbar>
      <Divider />

      <Box sx={{ overflow: "auto", p: 1 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              component={NavLink}
              to={item.to}
              sx={{
                color: "#1B5E20",
                "&:hover": { backgroundColor: "#c8e6c9" },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "#1B5E20",
                  "&:hover": { backgroundColor: "#c8e6c9" },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>

        {/* Logout */}
        <List>
          <ListItem
            onClick={openLogoutModal}
            sx={{
              borderRadius: 2,
              mb: 1,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#c8e6c9",
              },
            }}
          >
            <ListItemIcon>
              <LogoutIcon sx={{ color: "red" }} />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: "red" }} />
          </ListItem>
        </List>
      </Box>

      {/* Logout Modal with Props */}
      <LogoutModal
        open={isModalOpen}
        onCancel={handleCancel}
      />
    </Drawer>
  );
};

export default Sidebar;
