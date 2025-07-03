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
  IconButton,
  useMediaQuery,
} from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import LogoutModal from "../Screens/Modal/LogoutModal";
import { useUsertype } from "../Hooks/UserHook";
import { useTheme } from "@mui/material/styles";

const menuItems = [
  {
    text: "User",
    to: "/dashboard",
    icon: <GroupAddIcon />,
    allowedUserTypes: [1],
  },
  {
    text: "Inventory",
    to: "/dashboard/inventory",
    icon: <DashboardCustomizeIcon />,
    allowedUserTypes: [1],
  },
  {
    text: "Distributed",
    to: "/dashboard/distributedList",
    icon: <LocalShippingIcon />,
    allowedUserTypes: [1],
  },
  {
    text: "Users",
    to: "/distributor",
    icon: <GroupAddIcon />,
    allowedUserTypes: [4],
  },
];

const Sidebar = () => {
  const usertype = useUsertype();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const drawerWidth = collapsed ? 80 : 200;

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  const drawerContent = (
    <>
      <Toolbar sx={{ justifyContent: collapsed ? "center" : "space-around" }}>
        <Box display="flex" alignItems="center">
          {!collapsed && (
            <Typography
              variant="h6"
              sx={{
                color: "#2e7d32",
                fontWeight: "bold",
                ml: 1,
                fontSize: "15px",
              }}
            >
              MilkPro Sales
            </Typography>
          )}
        </Box>
        <IconButton onClick={toggleSidebar}>
          {collapsed ? <MenuIcon sx={{ color: "green" }} /> : <MenuOpenIcon />}
        </IconButton>
      </Toolbar>

      <Divider />

      <Box sx={{ overflow: "auto", p: 1 }}>
        <List>
          {menuItems
            .filter((item) => item.allowedUserTypes.includes(usertype))
            .map((item) => (
              <ListItem
                key={item.text}
                component={NavLink}
                to={item.to}
                onClick={() => isMobile && setMobileOpen(false)}
                sx={{
                  color: "#1B5E20",
                  "&:hover": { backgroundColor: "#c8e6c9" },
                  borderRadius: 1,
                  justifyContent: collapsed ? "center" : "flex-start",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "#1B5E20",
                    minWidth: collapsed ? "auto" : "40px",
                    mr: collapsed ? 0 : 1,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && <ListItemText primary={item.text} />}
              </ListItem>
            ))}
        </List>

        <List>
          <ListItem
            onClick={() => setIsModalOpen(true)}
            sx={{
              borderRadius: 2,
              mb: 1,
              cursor: "pointer",
              justifyContent: collapsed ? "center" : "flex-start",
              "&:hover": {
                backgroundColor: "#c8e6c9",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: "red",
                minWidth: collapsed ? "auto" : "40px",
                mr: collapsed ? 0 : 1,
              }}
            >
              <img src={assets.LogoutIcon} width={25} alt="Logout" />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText primary="Logout" sx={{ color: "red" }} />
            )}
          </ListItem>
        </List>
      </Box>

      <LogoutModal open={isModalOpen} onCancel={() => setIsModalOpen(false)} />
    </>
  );

  return (
    <>
      {/* Hamburger button for mobile */}
      {isMobile && (
        <IconButton
          onClick={toggleSidebar}
          sx={{ position: "fixed", top: 10, left: 10, zIndex: 1300 }}
        >
          <MenuIcon sx={{ color: "#2e7d32" }} />
        </IconButton>
      )}

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#e8f5e9",
            color: "#1b5e20",
            transition: "width 0.3s ease",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
