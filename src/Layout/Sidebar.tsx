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
  Collapse,
} from "@mui/material";
import {
  GroupAdd,
  LocalShipping,
  DashboardCustomize,
  MenuOpen,
  Settings,
  Menu,
  ExpandLess,
  ExpandMore,
  ChevronRight,
} from "@mui/icons-material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RealEstateAgentIcon from "@mui/icons-material/RealEstateAgent";
import { useState, type ReactNode } from "react";
import LogoutModal from "../Screens/Modal/LogoutModal";
import { useUsertype } from "../Hooks/UserHook";
import { useTheme } from "@mui/material/styles";

interface MenuItemType {
  text: string;
  to?: string;
  icon?: ReactNode;
  allowedUserTypes: number[];
  children?: MenuItemType[];
}

const menuItems: MenuItemType[] = [
  {
    text: "User",
    to: "/dashboard",
    icon: <GroupAdd />,
    allowedUserTypes: [1],
  },
  {
    text: "Master",
    icon: <Settings />,
    allowedUserTypes: [1],
    children: [
      {
        text: "Slot",
        to: "/dashboard/Slot",
        icon: <ChevronRight />,
        allowedUserTypes: [1],
      },
      {
        text: "Line",
        to: "/dashboard/Lines",
        icon: <ChevronRight />,
        allowedUserTypes: [1],
      },
      {
        text: "Price Tag",
        to: "/dashboard/Pricetag",
        icon: <ChevronRight />,
        allowedUserTypes: [1],
      },
      {
        text: "Reason",
        to: "/dashboard/Reason",
        icon: <ChevronRight />,
        allowedUserTypes: [1],
      },
    ],
  },
  {
    text: "Sales Log",
    to: "/dashboard/saleslog",
    allowedUserTypes: [1],
    icon: <RealEstateAgentIcon />,
  },
  {
    text: "Inventory",
    to: "/dashboard/inventory",
    icon: <DashboardCustomize />,
    allowedUserTypes: [1],
  },
  {
    text: "Distributed",
    to: "/dashboard/distributedList",
    icon: <LocalShipping />,
    allowedUserTypes: [1],
  },
  {
    text: "Place order",
    to: "/dashboard/PlaceOrder",
    icon: <AddShoppingCartIcon />,
    allowedUserTypes: [1],
  },
  {
    text: "Users",
    to: "/distributor",
    icon: <GroupAdd />,
    allowedUserTypes: [4],
  },
];

const commonListItemStyle = (collapsed: boolean) => ({
  color: "#1B5E20",
  borderRadius: 1,
  justifyContent: collapsed ? "center" : "flex-start",
  "&:hover": {
    backgroundColor: "#c8e6c9",
  },
});

const commonIconStyle = (collapsed: boolean) => ({
  color: "#1B5E20",
  minWidth: collapsed ? "auto" : "20px",
  mr: collapsed ? 0 : 1,
});

interface NestedMenuProps {
  item: MenuItemType;
  collapsed: boolean;
  isMobile: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  usertype: number;
}

const NestedMenuItem: React.FC<NestedMenuProps> = ({
  item,
  collapsed,
  isMobile,
  setMobileOpen,
  usertype,
}) => {
  const [open, setOpen] = useState(true);
  const handleClick = () => setOpen((prev) => !prev);

  return (
    <>
      <ListItem onClick={handleClick} sx={commonListItemStyle(collapsed)}>
        <ListItemIcon sx={commonIconStyle(collapsed)}>{item.icon}</ListItemIcon>
        {!collapsed && (
          <>
            <ListItemText primary={item.text} />
            {open ? <ExpandLess /> : <ExpandMore />}
          </>
        )}
      </ListItem>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {item.children
            ?.filter((child) => child.allowedUserTypes.includes(usertype))
            .map((child) =>
              child.to ? (
                <ListItem
                  key={child.text}
                  component={NavLink}
                  to={child.to}
                  onClick={() => isMobile && setMobileOpen(false)}
                  sx={{
                    ...commonListItemStyle(collapsed),
                    pl: collapsed ? 2 : 4,
                  }}
                >
                  <ListItemIcon sx={commonIconStyle(collapsed)}>
                    {child.icon || <ChevronRight />}
                  </ListItemIcon>
                  {!collapsed && <ListItemText primary={child.text} />}
                </ListItem>
              ) : null
            )}
        </List>
      </Collapse>
    </>
  );
};

const Sidebar: React.FC = () => {
  const usertype = useUsertype();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const drawerWidth = collapsed ? 80 : 200;

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  const drawerContent = (
    <>
      <Toolbar sx={{ justifyContent: collapsed ? "center" : "space-between" }}>
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
        <IconButton onClick={toggleSidebar}>
          {collapsed ? <Menu sx={{ color: "green" }} /> : <MenuOpen />}
        </IconButton>
      </Toolbar>

      <Divider />

      <Box sx={{ overflow: "auto", p: 1 }}>
        <List>
          {menuItems
            .filter((item) => item.allowedUserTypes.includes(usertype))
            .map((item) =>
              item.children ? (
                <NestedMenuItem
                  key={item.text}
                  item={item}
                  collapsed={collapsed}
                  isMobile={isMobile}
                  setMobileOpen={setMobileOpen}
                  usertype={usertype}
                />
              ) : item.to ? (
                <ListItem
                  key={item.text}
                  component={NavLink}
                  to={item.to}
                  onClick={() => isMobile && setMobileOpen(false)}
                  sx={commonListItemStyle(collapsed)}
                >
                  <ListItemIcon sx={commonIconStyle(collapsed)}>
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && <ListItemText primary={item.text} />}
                </ListItem>
              ) : null
            )}
        </List>

        <List>
          <ListItem
            onClick={() => setIsModalOpen(true)}
            sx={{
              ...commonListItemStyle(collapsed),
              mb: 1,
              color: "red",
            }}
          >
            <ListItemIcon sx={commonIconStyle(collapsed)}>
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
      {isMobile && (
        <IconButton
          onClick={toggleSidebar}
          sx={{ position: "fixed", top: 10, left: 10, zIndex: 1300 }}
        >
          <Menu sx={{ color: "#2e7d32" }} />
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
