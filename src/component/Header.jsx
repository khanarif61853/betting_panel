import React, { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { Outlet, useNavigate } from "react-router-dom";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListSubheader from "@mui/material/ListSubheader";
import MailIcon from "@mui/icons-material/Mail";
import AddCardIcon from "@mui/icons-material/AddCard";
import { Avatar } from "@mui/material";

const drawerWidth = 250;

export default function Header() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);
  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };
  const handleMobileMenuOpen = (event) =>
    setMobileMoreAnchorEl(event.currentTarget);

  const handleLogout = ()=>{
     localStorage.removeItem("token");  
  }

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={() => {
          handleMenuClose();
          navigate("/profile");
        }}
      >
        Profile
      </MenuItem>
      <MenuItem onClick={handleLogout} >Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const DrawerList = (
    <Box sx={{ width: "100%",marginTop:"90px" }}>
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          borderRadius: "50px",
        }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader
            sx={{ background: "transparent", display: "flex" }}
            component="div"
            id="nested-list-subheader"
          >
            {/* Logo or Arrow here if needed */}
          </ListSubheader>
        }
      >
        <ListItemButton onClick={() => navigate("/home")}>
          <ListItemIcon>
            <DashboardIcon sx={{ color: "#9ed100" }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("/games")}>
          <ListItemIcon>
            <SportsEsportsIcon sx={{ color: "#9ed100" }} />
          </ListItemIcon>
          <ListItemText primary="Games" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("/withdrawal-requests")}>
          <ListItemIcon>
            <AttachMoneyIcon sx={{ color: "#9ed100" }} />
          </ListItemIcon>
          <ListItemText primary="Withdrawal Requests" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("/add-money")}>
          <ListItemIcon>
            <AddCardIcon sx={{ color: "#9ed100" }} />
          </ListItemIcon>
          <ListItemText primary="Add Money" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("/customers")}>
          <ListItemIcon>
            <PersonIcon sx={{ color: "#9ed100" }} />
          </ListItemIcon>
          <ListItemText primary="Customers" />
        </ListItemButton>
        <ListItemButton className="listItem" onClick={() => navigate("/rules")}>
          <ListItemIcon>
            <PersonIcon sx={{ color: "#9ed100" }} />
          </ListItemIcon>
          <ListItemText primary="Rules" />
        </ListItemButton>
        <ListItemButton
          className="listItem"
          onClick={() => navigate("/qr-code")}
        >
          <ListItemIcon>
            <PersonIcon sx={{ color: "#9ed100" }} />
          </ListItemIcon>
          <ListItemText primary="Qr Codes" />
        </ListItemButton>
        {/* Add more items as needed */}
      </List>
    </Box>
  );

  return (
    <>
      {/* Permanent Drawer */}

      {/* Main content area */}
      <Box>
        {/* AppBar */}
        <AppBar
          position="fixed"
          sx={{
            background: "conic-gradient(black, white, black)",
              zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            {/* Remove the menu button */}
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" }, cursor: "pointer" }}
              onClick={() => navigate("/home")}
            >
              <img src="assets/img/admin-logo.png" height={"80px"} alt="logo" />
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar color="inherit" />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {renderMobileMenu}
        {renderMenu}
        {/* Main page content */}
        <Box sx={{ display: "flex" }}>
          {/* drawer  */}
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: "border-box",
              },
            }}
          >
            {DrawerList}
          </Drawer>

          {/* end Drawer  */}
          <Box sx={{ p: 3, width: "80%",mt:10 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </>
  );
}

