import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Avatar,
  Switch,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  TextField,
  DialogActions,
  Button,
  Drawer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
} from "@mui/material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PhoneIcon from "@mui/icons-material/Phone";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { BASE_URL } from "../costants";
import CustomSnackbar from "./CustomSnackbar";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Header() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [walletAnchorEl, setWalletAnchorEl] = useState(null);
  const [withdrawRequestEnabled, setWithdrawRequestEnabled] = useState(false);
  const [withdrawalTitle, setWithdrawalTitle] = useState("");
  const [addMoneyTitle, setAddMoneyTitle] = useState("");
  const [commision, setCommision] = useState("");
  const [addMoneyEnabled, setAddMoneyEnabled] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuOpen1, setMenuOpen1] = useState(null);
  const [menuOpen2, setMenuOpen2] = useState(null);
  const [existingGames, setExistingGames] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isSettingsMenuOpen = Boolean(settingsAnchorEl);

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: token,
    },
  };
  const handleWithdrawRequest = async (e) => {
    const newStatus = e.target.checked;
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/web/status/withdrawal-request`,
        { status: newStatus },
        config
      );
      setWithdrawRequestEnabled(Boolean(Number(newStatus)));
      setSnackbarMessage(data?.message);
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Error updating status:", error.message);
      setSnackbarMessage("Failed to update status");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleVerifyAmountRequest = async (e) => {
    const newStatus = e.target.checked;
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/web/status/verify-amount-request`,
        {
          status: newStatus,
        },
        config
      );
      setAddMoneyEnabled(Boolean(Number(newStatus)));
      setSnackbarMessage(data?.message);
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Error updating status:", error);
      setSnackbarMessage("Failed to update status");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const getWithdrawalStatus = async () => {
    try {
      const {
        data: { data },
      } = await axios.get(
        `${BASE_URL}/api/web/retrieve/withdrawal-request-setting`,
        config
      );
      setWithdrawRequestEnabled(Boolean(Number(data.status)));
      setWithdrawalTitle(data?.title);
    } catch (err) {
      console.error("Failed to fetch status:", err.message);
    }
  };
  const getCommisionApi = async () => {
    try {
      const {
        data: { data },
      } = await axios.get(
        `${BASE_URL}/api/web/retrieve/referral_commision`,
        config
      );
      setCommision(data?.title);
    } catch (err) {
      console.error("Failed to fetch status:", err.message);
    }
  };

  const getVerifyAmountRequest = async () => {
    try {
      const {
        data: { data },
      } = await axios.get(
        `${BASE_URL}/api/web/retrieve/verify-amount-request-setting`,
        config
      );
      setAddMoneyEnabled(Boolean(Number(data.status)));
      setAddMoneyTitle(data.title);
    } catch (err) {
      console.error("Failed to fetch status:", err.message);
    }
  };
  // const fetchGames = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${BASE_URL}/api/web/retrieve/gamesName`,
  //       {
  //         headers: {
  //           Authorization: localStorage.getItem("token"),
  //           "ngrok-skip-browser-warning": true,
  //         },
  //       }
  //     );
  //     setExistingGames(response.data.data);
  //   } catch (err) {
  //     console.error("Error fetching games:", err);
  //   }
  // };

  const handleSubmit = async () => {
    try {
      const updateCalls = [];

      if (withdrawalTitle)
        updateCalls.push(
          axios.put(
            `${BASE_URL}/api/web/update/withdrawal-request-title`,
            { title: withdrawalTitle },
            config
          )
        );

      if (addMoneyTitle)
        updateCalls.push(
          axios.put(
            `${BASE_URL}/api/web/update/add-money-request-title`,
            { title: addMoneyTitle },
            config
          )
        );
      if (commision)
        updateCalls.push(
          axios.put(
            `${BASE_URL}/api/web/update/referral_commision`,
            { title: commision },
            config
          )
        );

      await Promise.all(updateCalls);
      setSnackbarMessage("Updated successfully");
      setSnackbarSeverity("success");
      alert("Updated successfully");
      setOpen(false);
    } catch (err) {
      // console.error(err);
      setSnackbarMessage("Failed to update settings");
      setSnackbarSeverity("error");
      alert("Error updating settings");
    }
  };

  const winners = [
    { name: "Winning Users", goTo: "/winning-users" },
    { name: "Last Game Winners", goTo: "/last-game-winners" },
    { name: "Andar Bahar Winners", goTo: "/andar-bahar-winner" },
  ];

  const title = [
    { name: "Dashboard", goTo: "/home" },
    { name: "Players", goTo: "/customers" },
    { name: "All Games", goTo: "/all-games" },
    { name: "Today's Game", goTo: "/games" },
    { name: "Bids", goTo: "/totalbid" },
    { name: "Add money", goTo: "/add-money" },
    { name: "Withdrawal Requests", goTo: "/withdrawal-requests" },
    { name: "Rules", goTo: "/rules" },
  ];

  const wallets = [
    { name: "Add Money Approved List", goTo: "/add-money-approved" },
    { name: "Withdrawal Approved List", goTo: "/withdrawal-approved" },
  ];

  useEffect(() => {
    // fetchGames();
    getWithdrawalStatus();
    getVerifyAmountRequest();
    getCommisionApi();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      startTime: "",
      endTime: "",
      resultTime: "",
      image: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      startTime: Yup.string().required("Start date time is required"),
      endTime: Yup.string().required("End date time is required"),
      resultTime: Yup.string().required("Result date time is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("startTime", values.startTime);
      formData.append("endTime", values.endTime);
      formData.append("resultTime", values.resultTime);
      if (values.image) formData.append("image", values.image);

      try {
        const { data } = await axios.post(
          `${BASE_URL}/api/web/create/all-games`,
          formData,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
              "ngrok-skip-browser-warning": true,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (data.type === "error") {
          setSnackbarOpen(true);
          setSnackbarMessage(data.message);
          setSnackbarSeverity("error");
          return; // Keep dialog open on error
        }

        // Only close dialog and navigate on success
        handleAddDialogClose();
        setSnackbarOpen(true);
        setSnackbarMessage(data.message);
        setSnackbarSeverity("success");
        navigate("/all-games");
      } catch (error) {
        console.error("Error adding game:", error.message);
        setSnackbarOpen(true);
        setSnackbarMessage(error?.response?.data?.message || error.message);
        setSnackbarSeverity("error");
        // Don't close dialog on error
      }
    },
  });

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);
  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };
  const handleSettingsMenuClose = () => {
    setSettingsAnchorEl(null);
  };
  const handleSettingsMenuOpen = (event) => {
    setSettingsAnchorEl(event.currentTarget);
    handleMenuClose();
  };
  const handleMobileMenuOpen = (event) =>
    setMobileMoreAnchorEl(event.currentTarget);

  // const handleAddDialogOpen = () => {
  //   setOpenAddDialog(true);
  //   handleSettingsMenuClose();
  // };

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
    formik.resetForm();
  };

  const handleLogout = async () => {
    localStorage.removeItem("token");
    navigate("sign-in");
  };

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
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
      <MenuItem onClick={handleSettingsMenuOpen}>Settings</MenuItem>
    </Menu>
  );

  const settingsMenuId = "settings-menu";
  const renderSettingsMenu = (
    <Menu
      anchorEl={settingsAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={settingsMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isSettingsMenuOpen}
      onClose={handleSettingsMenuClose}
    >
      {/* <MenuItem onClick={() => setOpen(true)} sx={{ minHeight: "48px" }}>
        <ListItemIcon>
          <AddCircleIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Add Title</ListItemText>
      </MenuItem> */}
      {/* <MenuItem onClick={handleAddDialogOpen} sx={{ minHeight: "48px" }}>
        <ListItemIcon>
          <SportsEsportsIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Add Game</ListItemText>
      </MenuItem> */}
      {/* <MenuItem sx={{ minHeight: "48px" }}>
        <ListItemIcon>
          <AccountBalanceWalletIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          onClick={(event) => {
            event.stopPropagation();
            setWalletAnchorEl(event.currentTarget);
          }}
        >
          Wallets
        </ListItemText>

        <ListItemIcon>
          <ArrowRightIcon fontSize="small" />
        </ListItemIcon>
      </MenuItem> */}
      <MenuItem
        sx={{
          minHeight: "48px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ListItemIcon>
            <MoneyOffIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Withdraw Request</ListItemText>
        </Box>
        <Switch
          checked={Boolean(withdrawRequestEnabled)}
          onChange={(e) => {
            e.stopPropagation();
            handleWithdrawRequest(e);
          }}
          onClick={(e) => e.stopPropagation()}
        />
      </MenuItem>
      <MenuItem
        sx={{
          minHeight: "48px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ListItemIcon>
            <AddCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add Money</ListItemText>
        </Box>
        <Switch
          // edge="end"
          checked={addMoneyEnabled}
          onChange={(e) => {
            e.stopPropagation();
            handleVerifyAmountRequest(e);
          }}
          onClick={(e) => e.stopPropagation()}
        />
      </MenuItem>
      {/* <Divider />
      <MenuItem sx={{ minHeight: "48px" }}>
        <ListItemIcon>
          <PhoneIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Helpline" secondary="+1 (800) 123-4567" />
      </MenuItem> */}
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
      onClick={handleProfileMenuOpen}
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
        <p className="">Menu</p>
      </MenuItem>
    </Menu>
  );

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen2(false); // 👈 close menu on item click
  };
  const handleNavigate1 = (path) => {
    navigate(path);
    setMenuOpen1(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: "conic-gradient(black, white, black)",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            // flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              // flexWrap: "wrap",
            }}
          >
            {/* Logo */}
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", md: "block" }, cursor: "pointer" }}
              onClick={() => navigate("/home")}
            >
              <img src="assets/img/admin-logo.png" height={"60px"} alt="logo" />
            </Typography>
            <Box sx={{ display: { xs: "flex", lg: "none" } }}>
              <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
            </Box>
          </Box>
          {/* Navigation Links */}
          <Box
            sx={{
              display: { xs: "none", lg: "flex" },
              gap: 3,
              alignItems: "center",
            }}
          >
            {/* <Box
              sx={{
                position: "relative",
                display: "inline-block",
                cursor: "pointer",
                // "&:hover .menuBox": {
                //   display: "block",
                // },
              }}
              onMouseEnter={() => setMenuOpen1(true)}
              onMouseLeave={() => setMenuOpen1(false)}
            >
              <Box display="flex" alignItems="center">
                <Typography variant="h6">Games</Typography>
                <KeyboardArrowDownIcon fontSize="small" />
              </Box>
              {menuOpen1 && (
                <Box
                  className="menuBox"
                  sx={{
                    // display: "none",
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    boxShadow: 3,
                    zIndex: 1000,
                    borderRadius: 1,
                    minWidth: 150,
                  }}
                >
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      "&:hover": { backgroundColor: "#f0f0f0" },
                    }}
                    onClick={() => {
                      navigate("/games");
                      setMenuOpen1(false);
                    }}
                  >
                    <Typography
                      variant="h6"
                      noWrap
                      sx={{
                        cursor: "pointer",
                        color: "black",
                        fontSize: { xs: 10, sm: 15 },
                      }}
                      // onClick={() => navigate("/games")}
                    >
                      Live Games
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box> */}

            {title.map(({ name, goTo }) => {
              return (
                <Typography
                  key={name}
                  variant="h6"
                  noWrap
                  sx={{
                    cursor: "pointer",
                    position: "relative",
                    fontSize: { md: 17 },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: 0,
                      height: "1px",
                      backgroundColor: "#fff",
                      transition: "width 0.3s ease",
                    },
                    "&:hover::after": {
                      width: "100%",
                    },
                  }}
                  onClick={() => navigate(goTo)}
                >
                  {name}
                </Typography>
              );
            })}
            <Typography
              variant="h6"
              noWrap
              sx={{
                cursor: "pointer",
                position: "relative",
                fontSize: { md: 17 },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: 0,
                  height: "1px",
                  backgroundColor: "#fff",
                  transition: "width 0.3s ease",
                },
                "&:hover::after": {
                  width: "100%",
                },
              }}
              onClick={() => setOpen(true)}
            >
              Add Messages
            </Typography>
            <Box
              sx={{
                position: "relative",
                display: "inline-block",
                cursor: "pointer",
                // "&:hover .menuBox": {
                //   display: "block",
                // },
              }}
              onMouseEnter={() => setMenuOpen1(true)}
              onMouseLeave={() => setMenuOpen1(false)}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    fontSize: { md: 17 },
                  }}
                >
                  Wallet
                </Typography>
                <KeyboardArrowDownIcon fontSize="small" />
              </Box>

              {menuOpen1 && (
                <Box
                  className="menuBox"
                  sx={{
                    // display: "none",
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: 1,
                    boxShadow: 3,
                    zIndex: 10,
                    minWidth: 160,
                  }}
                >
                  {wallets?.map(({ name, goTo }, index) => (
                    <Box
                      key={index}
                      onClick={() => handleNavigate1(goTo)}
                      sx={{
                        px: 2,
                        py: 1,
                        "&:hover": {
                          backgroundColor: "#f0f0f0",
                        },
                      }}
                    >
                      <Typography
                        variant="h6"
                        noWrap
                        sx={{
                          cursor: "pointer",
                          color: "black",
                          fontSize: { xs: 10, sm: 15 },
                        }}
                      >
                        {name}
                      </Typography>
                      {/* {name} */}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
            <Box
              sx={{
                position: "relative",
                display: "inline-block",
                cursor: "pointer",
                // "&:hover .menuBox": {
                //   display: "block",
                // },
              }}
              onMouseEnter={() => setMenuOpen2(true)}
              onMouseLeave={() => setMenuOpen2(false)}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    fontSize: { md: 17 },
                  }}
                >
                  Winners
                </Typography>
                <KeyboardArrowDownIcon fontSize="small" />
              </Box>

              {menuOpen2 && (
                <Box
                  className="menuBox"
                  sx={{
                    // display: "none",
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: 1,
                    boxShadow: 3,
                    zIndex: 10,
                    minWidth: 160,
                  }}
                >
                  {winners.map(({ name, goTo }, index) => (
                    <Box
                      key={index}
                      onClick={() => handleNavigate(goTo)}
                      sx={{
                        px: 2,
                        py: 1,
                        "&:hover": {
                          backgroundColor: "#f0f0f0",
                        },
                      }}
                    >
                      <Typography
                        variant="h6"
                        noWrap
                        sx={{
                          cursor: "pointer",
                          color: "black",
                          fontSize: { xs: 10, sm: 15 },
                        }}
                      >
                        {name}
                      </Typography>
                      {/* {name} */}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>

          {/* Avatar or Profile */}
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
              <Avatar />
            </IconButton>
          </Box>
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            <Box
              sx={{
                width: 250,
                mt: 8,
                overflow: "auto",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {title.map(({ name, goTo }) => (
                <ListItem
                  button
                  key={name}
                  onClick={() => {
                    navigate(goTo);
                    setDrawerOpen(false);
                  }}
                >
                  <ListItemText primary={name} />
                </ListItem>
              ))}
              <ListItem
                onClick={() => {
                  setOpen(true);
                  setDrawerOpen(false);
                }}
              >
                <ListItemText primary={"Add messages"} />
              </ListItem>
              <Accordion
                sx={{
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  color: "#fff",
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon
                      sx={{
                        color: "#fff",
                      }}
                    />
                  }
                >
                  <Typography>Winners</Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    p: 0,
                  }}
                >
                  {winners.map(({ name, goTo }) => (
                    <ListItem
                      button
                      key={name}
                      onClick={() => {
                        navigate(goTo);
                        setDrawerOpen(false);
                      }}
                    >
                      <ListItemText primary={name} />
                    </ListItem>
                  ))}
                </AccordionDetails>
              </Accordion>
              <Accordion
                sx={{
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  color: "#fff",
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon
                      sx={{
                        color: "#fff",
                      }}
                    />
                  }
                >
                  <Typography>Wallet</Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    p: 0,
                  }}
                >
                  {wallets.map(({ name, goTo }) => (
                    <ListItem
                      button
                      key={name}
                      onClick={() => {
                        navigate(goTo);
                        setDrawerOpen(false);
                      }}
                    >
                      <ListItemText primary={name} />
                    </ListItem>
                  ))}
                </AccordionDetails>
              </Accordion>
            </Box>
          </Drawer>
          {/* Mobile Menu Icon */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {renderMobileMenu}
      {renderMenu}
      {renderSettingsMenu}

      <Box sx={{ p: 3, width: "100%", mt: 10 }}>
        <Outlet />
      </Box>

      <Dialog
        open={openAddDialog}
        onClose={handleAddDialogClose}
        disableEscapeKeyDown
        disablebackdropclick="true"
      >
        <DialogTitle>{"Add New Game"}</DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            {/* <FormControl fullWidth margin="dense">
              <InputLabel>Select Game</InputLabel>
              <Select
                label="Select Game"
                value={formik.values.name}
                onChange={(event) => {
                  formik.setFieldValue("name", event.target.value);
                }}
              >
                {existingGames?.map((game, index) => (
                  <MenuItem key={index} value={game.name}>
                    {game.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
            <TextField
              margin="dense"
              label="Enter New Game Name"
              name="name"
              type="text"
              fullWidth
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              margin="dense"
              name="startTime"
              label="Start Date Time"
              type="datetime-local"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={formik.values.startTime}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.startTime && Boolean(formik.errors.startTime)
              }
              helperText={formik.touched.startTime && formik.errors.startTime}
            />
            <TextField
              margin="dense"
              label="End Date Time"
              name="endTime"
              type="datetime-local"
              fullWidth
              value={formik.values.endTime}
              onChange={formik.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.endTime && Boolean(formik.errors.endTime)}
              helperText={formik.touched.endTime && formik.errors.endTime}
            />
            <TextField
              margin="dense"
              label="Result Date Time"
              name="resultTime"
              type="datetime-local"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={formik.values.resultTime}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.resultTime && Boolean(formik.errors.resultTime)
              }
              helperText={formik.touched.resultTime && formik.errors.resultTime}
            />
            <TextField
              margin="dense"
              label="Image"
              name="image"
              type="file"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) =>
                formik.setFieldValue("image", event.currentTarget.files[0])
              }
              error={formik.touched.image && Boolean(formik.errors.image)}
              helperText={formik.touched.image && formik.errors.image}
            />
            <DialogActions>
              <Button onClick={handleAddDialogClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="secondary">
                {"Add Game"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(!open);
          getWithdrawalStatus();
          getVerifyAmountRequest();
          getCommisionApi();
        }}
        disableEscapeKeyDown
        disablebackdropclick="true"
      >
        <DialogTitle>{"Update Message"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Withdrawal Title"
            name="withdrawalTitle"
            type="text"
            // type="datetime-local"
            fullWidth
            value={withdrawalTitle}
            onChange={(e) => setWithdrawalTitle(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            // error={
            //   formik.touched.endDateTime && Boolean(formik.errors.endDateTime)
            // }
            // helperText={
            //   formik.touched.endDateTime && formik.errors.endDateTime
            // }
          />
          <TextField
            margin="dense"
            label="Add Money Title"
            name="addMoneyTitle"
            type="text"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={addMoneyTitle}
            onChange={(e) => setAddMoneyTitle(e.target.value)}
            // error={
            //   formik.touched.resultDateTime &&
            //   Boolean(formik.errors.resultDateTime)
            // }
            // helperText={
            //   formik.touched.resultDateTime && formik.errors.resultDateTime
            // }
          />
          <TextField
            margin="dense"
            label="Add Referral Commision"
            name="addCommision"
            type="number"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={commision}
            onChange={(e) => setCommision(e.target.value)}
            // error={
            //   formik.touched.resultDateTime &&
            //   Boolean(formik.errors.resultDateTime)
            // }
            // helperText={
            //   formik.touched.resultDateTime && formik.errors.resultDateTime
            // }
          />
          <DialogActions>
            <Button
              onClick={() => {
                setOpen(false);
                getWithdrawalStatus();
                getVerifyAmountRequest();
                getCommisionApi();
              }}
              color="primary"
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} type="submit" color="secondary">
              {"Save"}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <CustomSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />

      {/* <Menu
        anchorEl={walletAnchorEl}
        open={Boolean(walletAnchorEl)}
        onClose={() => setWalletAnchorEl(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            navigate("/add-money");
            setWalletAnchorEl(null);
            handleSettingsMenuClose();
          }}
        >
          <ListItemIcon>
            <AddCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add Money List</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate("/withdrawal-approved");
            setWalletAnchorEl(null);
            handleSettingsMenuClose();
          }}
        >
          <ListItemIcon>
            <AccountBalanceWalletIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Withdrawal Approved List</ListItemText>
        </MenuItem>
      </Menu> */}
    </>
  );
}
