// src/Components/Sidebar.tsx
import { NavLink } from "react-router-dom";
import assets from "../../Uitils/Assets";
import { Logout } from "../../Screens/Auth/Logout";
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
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import Dashboard from "@mui/icons-material/Dashboard";
import { Modal } from "antd";
import { useState } from "react";

const drawerWidth = 240;

const Sidebar = () => {
  const handleOk = () => {
    Logout();
  };
  const handleCancel = () => {
    SetModel(false);
  };
  const [Modelopen, SetModel] = useState(false);
  const LogoutModel = () => {
    SetModel(true);
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
          backgroundColor: "#e8f5e9", // Light green background
          color: "#1b5e20", // Darker green text
        },
      }}
    >
      <Toolbar>
        <Box display="flex" padding={0}>
          <img src={assets.Logo} width={70} />
          <Typography
            variant="h6"
            sx={{
              color: "#2e7d32",
              fontWeight: "bold",
            }}
          >
            MilkPro Sales
          </Typography>
        </Box>
      </Toolbar>
      <Divider />

      <Box sx={{ overflow: "auto", p: 1 }}>
        {/* User Management Section */}
        <List>
          <ListItem
            component={NavLink}
            to="/admin-dashboard"
            sx={{
              borderRadius: 2,
              mb: 1,
              "&:hover": {
                backgroundColor: "#c8e6c9",
              },
              "&.active": {
                backgroundColor: "#a5d6a7",
                fontWeight: "bold",
              },
            }}
          >
            <ListItemIcon>
              {" "}
              <Dashboard />{" "}
            </ListItemIcon>
            <ListItemText primary="Inventory" />
          </ListItem>
        </List>
        <List>
          <ListItem
            component={NavLink}
            to="/admin-dashboard/users"
            sx={{
              borderRadius: 2,
              mb: 1,
              "&:hover": {
                backgroundColor: "#c8e6c9",
              },
              "&.active": {
                backgroundColor: "#a5d6a7",
                fontWeight: "bold",
              },
            }}
          >
            <ListItemIcon>
              <PeopleAltIcon sx={{ color: "#2e7d32" }} />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
        </List>
        {/*  */}
        <List>
          <ListItem
            sx={{
              borderRadius: 2,
              mb: 1,
              "&:hover": {
                backgroundColor: "#c8e6c9",
              },
              "&.active": {
                backgroundColor: "#a5d6a7",
                fontWeight: "bold",
              },
            }}
          >
            <ListItemIcon>
              {" "}
              <LogoutIcon sx={{ color: "red" }} />{" "}
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              onClick={LogoutModel}
              sx={{ color: "red" }}
            />
          </ListItem>
        </List>
      </Box>

      <Modal
        title="Confirm Logout"
        open={Modelopen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Yes, Logout"
        cancelText="Cancel"
        okButtonProps={{
          style: {
            backgroundColor: "red", 
            borderColor: "#d9534f",
            color: "#fff",
          },
        }}
        cancelButtonProps={{
          style: {
            backgroundColor: "#f0f0f0",
            borderColor: "#d9d9d9",
            color: "#000",
          },
        }}
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </Drawer>
  );
};

export default Sidebar;
