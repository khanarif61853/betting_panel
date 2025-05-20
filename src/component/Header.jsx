// import React, { useState } from "react";
// import Box from "@mui/material/Box";
// import Drawer from "@mui/material/Drawer";
// import List from "@mui/material/List";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import PersonIcon from "@mui/icons-material/Person";
// import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import IconButton from "@mui/material/IconButton";
// import Typography from "@mui/material/Typography";
// import Badge from "@mui/material/Badge";
// import MenuItem from "@mui/material/MenuItem";
// import Menu from "@mui/material/Menu";
// import AccountCircle from "@mui/icons-material/AccountCircle";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import MoreIcon from "@mui/icons-material/MoreVert";
// import { Outlet, useNavigate } from "react-router-dom";
// import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import ListSubheader from "@mui/material/ListSubheader";
// import MailIcon from '@mui/icons-material/Mail';
// import AddCardIcon from "@mui/icons-material/AddCard";
// import { Avatar } from "@mui/material";


// const drawerWidth = 250;

// export default function Header() {
//   const navigate = useNavigate();
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

//   const isMenuOpen = Boolean(anchorEl);
//   const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

//   const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
//   const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);
//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     handleMobileMenuClose();
//   };
//   const handleMobileMenuOpen = (event) =>
//     setMobileMoreAnchorEl(event.currentTarget);

//   const menuId = "primary-search-account-menu";
//   const renderMenu = (
//     <Menu
//       anchorEl={anchorEl}
//       anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       id={menuId}
//       keepMounted
//       transformOrigin={{ vertical: "top", horizontal: "right" }}
//       open={isMenuOpen}
//       onClose={handleMenuClose}
//     >
//       <MenuItem
//         onClick={() => {
//           handleMenuClose();
//           navigate("/profile");
//         }}
//       >
//         Profile
//       </MenuItem>
//       <MenuItem /* onClick={handleLogout} */>Logout</MenuItem>
//     </Menu>
//   );

//   const mobileMenuId = "primary-search-account-menu-mobile";
//   const renderMobileMenu = (
//     <Menu
//       anchorEl={mobileMoreAnchorEl}
//       anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       id={mobileMenuId}
//       keepMounted
//       transformOrigin={{ vertical: "top", horizontal: "right" }}
//       open={isMobileMenuOpen}
//       onClose={handleMobileMenuClose}
//     >
//       <MenuItem>
//         <IconButton size="large" aria-label="show 4 new mails" color="inherit">
//           <Badge badgeContent={4} color="error">
//             <MailIcon />
//           </Badge>
//         </IconButton>
//         <p>Messages</p>
//       </MenuItem>
//       <MenuItem>
//         <IconButton
//           size="large"
//           aria-label="show 17 new notifications"
//           color="inherit"
//         >
//           <Badge badgeContent={17} color="error">
//             <NotificationsIcon />
//           </Badge>
//         </IconButton>
//         <p>Notifications</p>
//       </MenuItem>
//       <MenuItem onClick={handleProfileMenuOpen}>
//         <IconButton
//           size="large"
//           aria-label="account of current user"
//           aria-controls="primary-search-account-menu"
//           aria-haspopup="true"
//           color="inherit"
//         >
//           <AccountCircle />
//         </IconButton>
//         <p>Profile</p>
//       </MenuItem>
//     </Menu>
//   );

//   const DrawerList = (
//     <Box sx={{ width: drawerWidth }} role="presentation">
//       <List
//         sx={{
//           width: "100%",
//           maxWidth: 360,
//           borderRadius: "50px",
//           minHeight: "100vh",
//         }}
//         component="nav"
//         aria-labelledby="nested-list-subheader"
//         subheader={
//           <ListSubheader
//             sx={{ background: "transparent", display: "flex" }}
//             component="div"
//             id="nested-list-subheader"
//           >
//             {/* Logo or Arrow here if needed */}
//           </ListSubheader>
//         }
//       >
//         <ListItemButton onClick={() => navigate("/home")}>
//           <ListItemIcon>
//             <DashboardIcon sx={{ color: "#9ed100" }} />
//           </ListItemIcon>
//           <ListItemText primary="Dashboard" />
//         </ListItemButton>
//         <ListItemButton onClick={() => navigate("/games")}>
//           <ListItemIcon>
//             <SportsEsportsIcon sx={{ color: "#9ed100" }} />
//           </ListItemIcon>
//           <ListItemText primary="Games" />
//         </ListItemButton>
//         <ListItemButton onClick={() => navigate("/withdrawal-requests")}>
//           <ListItemIcon>
//             <AttachMoneyIcon sx={{ color: "#9ed100" }} />
//           </ListItemIcon>
//           <ListItemText primary="Withdrawal Requests" />
//         </ListItemButton>
//         <ListItemButton onClick={() => navigate("/add-money")}>
//           <ListItemIcon>
//             <AddCardIcon sx={{ color: "#9ed100" }} />
//           </ListItemIcon>
//           <ListItemText primary="Add Money" />
//         </ListItemButton>
//         <ListItemButton onClick={() => navigate("/customers")}>
//           <ListItemIcon>
//             <PersonIcon sx={{ color: "#9ed100" }} />
//           </ListItemIcon>
//           <ListItemText primary="Customers" />
//         </ListItemButton>
//         {/* Add more items as needed */}
//       </List>
//     </Box>
//   );

//   return (
//     <Box sx={{ display: "flex" }}>
//       {/* Permanent Drawer */}
//       <Drawer
//         variant="permanent"
//         sx={{
//           width: drawerWidth,
//           flexShrink: 0,
//           [`& .MuiDrawer-paper`]: {
//             width: drawerWidth,
//             boxSizing: "border-box",
//           },
//           zIndex: 1200,
//         }}
//       >
//         {DrawerList}
//       </Drawer>

//       {/* Main content area */}
//       <Box sx={{ flexGrow: 1 }}>
//         {/* AppBar */}
//         <AppBar
//           position="static"
//           sx={{
//             background: "conic-gradient(black, white, black)",
//             zIndex: 1300,
//           }}
//         >
//           <Toolbar>
//             {/* Remove the menu button */}
//             <Typography
//               variant="h6"
//               noWrap
//               component="div"
//               sx={{ display: { xs: "none", sm: "block" }, cursor: "pointer" }}
//               onClick={() => navigate("/home")}
//             >
//               <img src="assets/img/admin-logo.png" height={"80px"} alt="logo" />
//             </Typography>
//             <Box sx={{ flexGrow: 1 }} />
//             <Box sx={{ display: { xs: "none", md: "flex" } }}>
//               <IconButton
//                 size="large"
//                 edge="end"
//                 aria-label="account of current user"
//                 aria-controls={menuId}
//                 aria-haspopup="true"
//                 onClick={handleProfileMenuOpen}
//                 color="inherit"
//               >
//                 <Avatar color="inherit" />
//               </IconButton>
//             </Box>
//             <Box sx={{ display: { xs: "flex", md: "none" } }}>
//               <IconButton
//                 size="large"
//                 aria-label="show more"
//                 aria-controls={mobileMenuId}
//                 aria-haspopup="true"
//                 onClick={handleMobileMenuOpen}
//                 color="inherit"
//               >
//                 <MoreIcon />
//               </IconButton>
//             </Box>
//           </Toolbar>
//         </AppBar>
//         {renderMobileMenu}
//         {renderMenu}
//         {/* Main page content */}
//         <Box sx={{ p: 3 }}>
//           <Outlet />
//         </Box>
//       </Box>
//     </Box>
//   );    
// }

// 222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222


import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MailIcon from '@mui/icons-material/Mail';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Outlet, useNavigate } from 'react-router-dom';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListSubheader from '@mui/material/ListSubheader';
import "../index.css"
import axios from 'axios';
import Lottie from 'lottie-react';
import AddCardIcon from '@mui/icons-material/AddCard';
import Arrow from "../assets/lottie/Arrow.json"
import { BASE_URL } from '../costants';
import { Avatar } from '@mui/material';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
export default function Header() {
    // Drawer list item states
    const [dropdown, setDropdown] = useState(false);
    const navigate = useNavigate();

    const handleClick = () => {
        setDropdown(!dropdown);
    };

    const handleLogout = () => {
        let res = axios.delete(`${BASE_URL}/api/web/auth/logout`, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        })
        res.then(() => {
            localStorage.removeItem("token")
            navigate("/sign-in")
        }).catch((err) => {
            localStorage.removeItem("token")
            navigate("/sign-in")
        })
    }

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            sx={{ zIndex: 999999 }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={() => {
                handleMenuClose()
                navigate("/profile")
            }}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="error">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <Badge badgeContent={17} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
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

    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const DrawerList = (
        <Box sx={{ width: 250, }} role="presentation" onClick={toggleDrawer(false)}>
            <List
                sx={{ width: '100%', maxWidth: 360, borderRadius: "50px", minHeight: "100vh" }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader sx={{ background: "transparent", display: "flex", }} component="div" id="nested-list-subheader">
                        <ListItemIcon className='img-fluid' sx={{ height: "50px", marginLeft: "auto", cursor: "pointer", transform: "rotate(180deg)", }}>
                            <Lottie animationData={Arrow} />
                        </ListItemIcon>
                    </ListSubheader>
                }
            >
                <ListItemButton className='listItem' onClick={() => navigate("/home")}>
                    <ListItemIcon>
                        <DashboardIcon sx={{color:"#9ed100"}}/>
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItemButton>
                <ListItemButton className='listItem' onClick={() => navigate("/games")}>
                    <ListItemIcon>
                        <SportsEsportsIcon sx={{color:"#9ed100"}} />
                    </ListItemIcon>
                    <ListItemText primary="Games" />
                  </ListItemButton>
                <ListItemButton className='listItem' onClick={() => navigate("/withdrawal-requests")}>
                    <ListItemIcon>
                        <AttachMoneyIcon sx={{color:"#9ed100"}}/>
                    </ListItemIcon>
                    <ListItemText primary="Withdrawal Requests" />
                </ListItemButton>
                 <ListItemButton className='listItem' onClick={() => navigate("/add-money")}>
                    <ListItemIcon>
                        <AddCardIcon sx={{color:"#9ed100"}}/>
                    </ListItemIcon>
                    <ListItemText primary="Add Money" />
                </ListItemButton>
                <ListItemButton className='listItem' onClick={() => navigate("/customers")}>
                    <ListItemIcon>
                        <PersonIcon sx={{color:"#9ed100"}}/>
                    </ListItemIcon>
                    <ListItemText primary="Customers" />
                </ListItemButton>
                <ListItemButton className='listItem' onClick={() => navigate("/rules")}>
                    <ListItemIcon>
                        <PersonIcon sx={{color:"#9ed100"}}/>
                    </ListItemIcon>
                    <ListItemText primary="Rules" />
                </ListItemButton>
                <ListItemButton className='listItem' onClick={() => navigate("/qr-code")}>
                    <ListItemIcon>
                        <PersonIcon sx={{color:"#9ed100"}}/>
                    </ListItemIcon>
                    <ListItemText primary="Qr Codes" />
                </ListItemButton>
                {/* <ListItemButton className='listItem' onClick={() => navigate("/verify-payments")}>
                    <ListItemIcon>
                        <LocalAtmIcon sx={{color:"#9ed100"}}/>
                    </ListItemIcon>
                    <ListItemText primary="Verify Payments" />
                </ListItemButton> */}
                {/* <ListItemButton onClick={(e) => {
                    e.stopPropagation()
                    handleClick()
                }}>
                    <ListItemIcon>
                        <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary="Exams" />
                    {dropdown ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={dropdown} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => navigate("/question-bank")}>
                            <ListItemIcon>
                                <StarBorder />
                            </ListItemIcon>
                            <ListItemText primary="Question Bank" />
                        </ListItemButton>
                    </List>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => navigate("/exams")}>
                            <ListItemIcon>
                                <StarBorder />
                            </ListItemIcon>
                            <ListItemText primary="Exams" />
                        </ListItemButton>
                    </List>
                </Collapse>
                <ListItemButton onClick={() => navigate("/faqs")}>
                    <ListItemIcon>
                        <LiveHelpIcon />
                    </ListItemIcon>
                    <ListItemText primary="FAQs" />
                </ListItemButton> */}
            </List>
        </Box>
    );

    return (
        <div >
            <Box sx={{ position: "sticky", top: 0, zIndex: 999 }}>
                <AppBar position="static" sx={{ background: "conic-gradient(black  ,white,black)" }}>
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            sx={{ mr: 2 }}
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ display: { xs: 'none', sm: 'block' } }}
                        >
                            <img style={{cursor:"pointer",}} onClick={() => {
                                navigate("/home")
                            }} src="assets/img/admin-logo.png" height={"80px"} alt="logo" />
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            {/* <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                                <Badge badgeContent={4} color="error">
                                    <MailIcon />
                                </Badge>
                            </IconButton>
                            <IconButton
                                size="large"
                                aria-label="show 17 new notifications"
                                color="inherit"
                            >
                                <Badge badgeContent={17} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton> */}
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                                color="inherit"
                            >
                                <Avatar
                                color="inherit"/>
                                {/* <AccountCircle /> */}
                            </IconButton>
                        </Box>
                        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
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
            </Box>
            <Drawer open={open} onClose={toggleDrawer(false)} sx={{ zIndex: 99999 }}>
                {DrawerList}
            </Drawer>
            <Outlet />
        </div>
    );
}
