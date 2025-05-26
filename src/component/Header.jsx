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
import { Avatar, Switch, ListItemIcon, ListItemText, Divider, Dialog, DialogTitle, DialogContent, FormControl, InputLabel, Select, TextField, DialogActions, Button } from "@mui/material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PhoneIcon from "@mui/icons-material/Phone";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { BASE_URL } from '../costants';

export default function Header() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [withdrawRequestEnabled, setWithdrawRequestEnabled] = useState(false);
  const [addMoneyEnabled, setAddMoneyEnabled] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [existingGames, setExistingGames] = useState([]);
  const [editingGame, setEditingGame] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isSettingsMenuOpen = Boolean(settingsAnchorEl);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/web/retrieve/gamesName`, {
          headers: {
            Authorization: localStorage.getItem('token'),
            'ngrok-skip-browser-warning': true,
          },
        });
        setExistingGames(response.data.data);
      } catch (err) {
        console.error('Error fetching games:', err);
      }
    };
    fetchGames();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      startDateTime: '',
      endDateTime: '',
      resultDateTime: '',
      image: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      startDateTime: Yup.string().required('Start date time is required'),
      endDateTime: Yup.string().required('End date time is required'),
      resultDateTime: Yup.string().required('Result date time is required'),
      image: Yup.mixed().required('Image is required'),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('startDateTime', values.startDateTime);
      formData.append('endDateTime', values.endDateTime);
      formData.append('resultDateTime', values.resultDateTime);
      if (values.image) formData.append('image', values.image);

      try {
        await axios.post(`${BASE_URL}/api/web/create/game`, formData, {
          headers: {
            Authorization: localStorage.getItem('token'),
            'ngrok-skip-browser-warning': true,
            'Content-Type': 'multipart/form-data',
          },
        });
        handleAddDialogClose();
        navigate('/games');
      } catch (error) {
        console.error('Error adding game:', error);
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

  const handleAddDialogOpen = () => {
    setOpenAddDialog(true);
    handleSettingsMenuClose();
  };

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
      <MenuItem onClick={handleAddDialogOpen}
        sx={{ minHeight: '48px' }}
      >
        <ListItemIcon>
          <SportsEsportsIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Add Game</ListItemText>
      </MenuItem>
      <MenuItem sx={{ minHeight: '48px' }}>
        <ListItemIcon>
          <AccountBalanceWalletIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Wallet</ListItemText>
      </MenuItem>
      <MenuItem sx={{ 
        minHeight: '48px',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemIcon>
            <MoneyOffIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Withdraw Request</ListItemText>
        </Box>
        <Switch
          edge="end"
          checked={withdrawRequestEnabled}
          onChange={(e) => setWithdrawRequestEnabled(e.target.checked)}
        />
      </MenuItem>
      <MenuItem sx={{ 
        minHeight: '48px',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemIcon>
            <AddCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add Money</ListItemText>
        </Box>
        <Switch
          edge="end"
          checked={addMoneyEnabled}
          onChange={(e) => setAddMoneyEnabled(e.target.checked)}
        />
      </MenuItem>
      <Divider />
      <MenuItem sx={{ minHeight: '48px' }}>
        <ListItemIcon>
          <PhoneIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Helpline" secondary="+1 (800) 123-4567" />
      </MenuItem>
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

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: "conic-gradient(black, white, black)",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
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
      {renderSettingsMenu}

      <Box sx={{ p: 3, width: "100%", mt: 10 }}>
        <Outlet />
      </Box>
      
      <Dialog open={openAddDialog} onClose={handleAddDialogClose}>
        <DialogTitle>{editingGame ? 'Edit Game' : 'Add New Game'}</DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Select Game</InputLabel>
              <Select
                label="Select Game"
                value={formik.values.name}
                onChange={(event) => {
                  formik.setFieldValue('name', event.target.value);
                }}
              >
                {existingGames?.map((game, index) => (
                  <MenuItem key={index} value={game.name}>
                    {game.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Or Enter New Game Name"
              name='name'
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
              name='startDateTime'
              label="Start Date Time"
              type="datetime-local"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={formik.values.startDateTime}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.startDateTime && Boolean(formik.errors.startDateTime)}
              helperText={formik.touched.startDateTime && formik.errors.startDateTime}
            />
            <TextField
              margin="dense"
              label="End Date Time"
              name='endDateTime'
              type="datetime-local"
              fullWidth
              value={formik.values.endDateTime}
              onChange={formik.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.endDateTime && Boolean(formik.errors.endDateTime)}
              helperText={formik.touched.endDateTime && formik.errors.endDateTime}
            />
            <TextField
              margin="dense"
              label="Result Date Time"
              name='resultDateTime'
              type="datetime-local"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={formik.values.resultDateTime}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.resultDateTime && Boolean(formik.errors.resultDateTime)}
              helperText={formik.touched.resultDateTime && formik.errors.resultDateTime}
            />
            <TextField
              margin="dense"
              label="Image"
              name='image'
              type="file"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) => formik.setFieldValue('image', event.currentTarget.files[0])}
              error={formik.touched.image && Boolean(formik.errors.image)}
              helperText={formik.touched.image && formik.errors.image}
            />
            <DialogActions>
              <Button onClick={handleAddDialogClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="secondary">
                {editingGame ? 'Update Game' : 'Add Game'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
