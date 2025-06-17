import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import CustomSnackbar from "../component/CustomSnackbar";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Grid,
  Typography,
  Fab,
} from "@mui/material";
import {
  Switch,
  IconButton,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import gamesSchema from "../schema/gamesSchema";
import { useEffect, useState } from "react";
import { BASE_URL } from "../costants";
import moment from "moment-timezone";
import { usePagination } from "../hooks/usePagination";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useContextProvider } from "../context/ContextProvider";
import PropTypes from "prop-types";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#d32f2f",
    },
    success: {
      main: "#2e7d32",
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          backgroundColor: "#f4f6f8",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#1976d2",
            fontSize: "1.1rem",
          },
        },
      },
    },
  },
});

const Allgames = () => {
  const [openAddDialog1, setOpenAddDialog1] = useState(false);
  const [success, setSuccess] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [editingGame, setEditingGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const { page, limit, changePage, changeLimit } = usePagination();

  const navigate = useNavigate();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const { existingGames, setExistingGames, error, setError, fetchAllGames } = useContextProvider();

  const formikAdd = useFormik({
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
    onSubmit: async (values, { resetForm }) => {
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
        setOpenAddDialog1(false);
        // resetForm()
      } catch (error) {
        console.error("Error adding game:", error.message);
        setSnackbarOpen(true);
        setSnackbarMessage(error?.response?.data?.message || error.message);
        setSnackbarSeverity("error");
        // Don't close dialog on error
      }
    },
  });


  const handleStatusChange = async (id) => {
    const currentStatus = existingGames?.games?.find(
      (row) => row.id === id
    )?.status;
    const newStatus = !currentStatus;
    const d = !existingGames?.games?.find((row) => row.id === id).status;
    setLoading(true);

    try {
      await axios.post(
        `${BASE_URL}/api/web/status/all-games`,
        {
          status: newStatus,
          id: id,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "ngrok-skip-browser-warning": true,
          },
        }
      );
      setExistingGames((prevState) => ({
        ...prevState,
        games: prevState.games.map((game) =>
          game.id === id ? { ...game, status: newStatus } : game
        ),
      }));
      setSnackbarMessage("Game status updated successfully");
    } catch (error) {
      console.error("Error updating game status", error.response.data.message);
      setError(error.response.data.message);
      setSnackbarMessage(error.message);
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  // const handleCloseSnackbar = () => {
  //   setError(null);
  //   setSuccess(null);
  //   setSnackbarOpen(false);
  // };

  // const showSnackbar = (message, severity) => {
  //   if (severity === "error") {
  //     setError(message);
  //   } else {
  //     setSuccess(message);
  //   }
  //   setSnackbarSeverity(severity);
  //   setSnackbarOpen(true);
  // };

  const handleEdit = (id) => {
    const gameToEdit = existingGames?.games?.find((row) => row.id === id);
    setEditingGame(gameToEdit);
    formik.setValues({
      name: gameToEdit.name,
      startTime: gameToEdit.startTime,
      endTime: gameToEdit.endTime,
      resultTime: gameToEdit.resultTime,
      image: null,
    });
    setOpenAddDialog(true);
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    setLoading(true);
    try {
      let response = await axios.delete(
        `${BASE_URL}/api/web/delete/all-games`,
        {
          params: { id: deleteId },
          headers: {
            Authorization: localStorage.getItem("token"),
            "ngrok-skip-browser-warning": true,
          },
        }
      );
      if (response.data.type == "error") {
        // setRows(rows.filter((row) => row.id !== deleteId));
        setError(response.data.message);
        return;
      }
      setExistingGames((prevState) => ({
        ...prevState,
        games: prevState.games.filter((game) => game.id !== deleteId),
      }));
      setSuccess("Game deleted successfully");
    } catch (error) {
      console.error("Error deleting game", error.response.data.message);
      setError(error.response.data.message);
    } finally {
      setLoading(false);
      setOpenDialog(false);
      setDeleteId(null);
    }
  };

  const handleOpenDialog = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDeleteId(null);
  };

  const handleAddOrEditGame = async (values) => {
    console.log(values, "values edit field");
    setLoading(true);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("startTime", values.startTime);
    formData.append("endTime", values.endTime);
    formData.append("resultTime", values.resultTime);
    if (values.image) formData.append("image", values.image);

    try {
      if (editingGame) {
        try {
          const response = await axios.put(
            `${BASE_URL}/api/web/update/all-games`,
            formData,
            {
              params: { id: editingGame.id },
              headers: {
                Authorization: localStorage.getItem("token"),
                "ngrok-skip-browser-warning": true,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log(response, "response");
          if (response.data.type === "error") {
            setSnackbarOpen(true);
            setSnackbarMessage(response.data.message, "error");
            return; // Keep dialog open on error
          }
          setSnackbarOpen(true);
          setSnackbarMessage("Game updated successfully", "success");
          setOpenAddDialog(false); // Only close on success
          setEditingGame(null);
          formik.resetForm();
          if (response.data.type === "success") {
            fetchGames();
          }
        } catch (err) {
          console.log(err.message);
          setSnackbarOpen(true);
          setSnackbarMessage(
            err.response?.data?.message || err.message,
            "error"
          );
          return; // Keep dialog open on error
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to add/update game";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage, "error");
      return; // Keep dialog open on error
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: editingGame ? editingGame.name : "",
      startTime: editingGame
        ? // moment(editingGame.startTime).format("YYYY-MM-DDTHH:mm")
          // moment(editingGame.startTime).utc().format("YYYY-MM-DD HH:mm:ss")
          moment(editingGame.startTime)
            .subtract(330, "minutes")
            .format("YYYY-MM-DDTHH:mm")
        : "",
      endTime: editingGame
        ? //  moment(editingGame.endTime).format("YYYY-MM-DD HH:mm:ss")
          moment(editingGame.endTime)
            .subtract(330, "minutes")
            .format("YYYY-MM-DDTHH:mm")
        : "",
      resultTime: editingGame
        ? // moment(editingGame.resultTime).format("YYYY-MM-DD HH:mm:ss")
          moment(editingGame.resultTime)
            .subtract(330, "minutes")
            .format("YYYY-MM-DDTHH:mm")
        : "",
      image: null,
    },
    validationSchema: gamesSchema,
    onSubmit: (values) => {
      handleAddOrEditGame(values);
    },
    enableReinitialize: true, // Reinitialize form when editingGame changes
  });

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
    formik.resetForm();
    setEditingGame(null);
  };
  const handleAddDialogClose1 = () => {
    setOpenAddDialog1(false);
    formikAdd.resetForm();
    setEditingGame(null);
  };

  const columns = [
    { field: "name", headerName: "Name", width: 150 },
    { field: "startTime", headerName: "Start Time", width: 150 },
    { field: "endTime", headerName: "End Time", width: 150 },
    { field: "resultTime", headerName: "Result Time", width: 150 },
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: ({ row }) => (
        <Avatar src={`${BASE_URL}/img/game/` + row.image} variant="rounded">
          {row.name[0]}
        </Avatar>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: ({ row }) => (
        <Switch
          size="small"
          checked={Boolean(row.status)}
          color="warning"
          onChange={() => handleStatusChange(row.id)}
          onClick={(e) => {
            e.stopPropagation();
          }}
          inputProps={{ "aria-label": "controlled" }}
        />
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 130,
      renderCell: ({ row }) => {
        // console.log(row.id,'id-')
        return (
          <div>
            <IconButton
              color="primary"
              sx={{ color: "purple" }}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(row.id);
              }}
              aria-label="edit"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="secondary"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenDialog(row.id);
              }}
              aria-label="delete"
            >
              <DeleteIcon />
            </IconButton>
          </div>
        );
      },
    },
  ];

  const CustomDataGrid = ({ rows }) => {
    return (
      <>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ArrowBackIcon
            style={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/home");
            }}
          />
          <Grid
            container
            alignItems={"center"}
            mb={2}
            justifyContent={"space-between"}
          ></Grid>
          <div style={{ height: 450, width: "100%" }}>
            <DataGrid
              rows={existingGames?.games}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: limit, page },
                },
              }}
              paginationMode="server"
              rowCount={existingGames.total}
              pageSize={limit}
              checkboxSelection
              onPaginationModelChange={(value) => {
                if (value.pageSize !== limit) {
                  changeLimit(value.pageSize);
                  return changePage(0);
                }
                changePage(value.page);
                changeLimit(value.pageSize);
              }}
              disableSelectionOnClick
              loading={loading}
            />
          </div>
        </LocalizationProvider>
      </>
    );
  };

  CustomDataGrid.propTypes = {
    rows: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        finalBidNumber: PropTypes.string,
        resultDateTime: PropTypes.string,
      })
    ).isRequired,
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: 550,
          width: "100%",
          backgroundColor: "#f0f4f7",
          borderRadius: "8px",
          padding: "16px",
          position: "relative",
        }}
      >
        <CustomDataGrid rows={existingGames?.games} />
        {/* <CustomSnackbar
          open={snackbarOpen}
          onClose={handleCloseSnackbar}
          message={error || success}
          severity={snackbarSeverity}
        /> */}
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        disableEscapeKeyDown
        disableBackdropClick
      >
        <DialogTitle>{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this game?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openAddDialog}
        onClose={handleAddDialogClose}
        disableEscapeKeyDown
        disableBackdropClick
      >
        <DialogTitle>{"Edit Game"}</DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
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
                Update Game
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openAddDialog1}
        onClose={handleAddDialogClose1}
        disableEscapeKeyDown
        disablebackdropclick="true"
      >
        <DialogTitle>{"Add New Game"}</DialogTitle>
        <DialogContent>
          <form onSubmit={formikAdd.handleSubmit}>
            <TextField
              margin="dense"
              label="Enter New Game Name"
              name="name"
              type="text"
              fullWidth
              value={formikAdd.values.name}
              onChange={formikAdd.handleChange}
              onBlur={formikAdd.handleBlur}
              error={formikAdd.touched.name && Boolean(formikAdd.errors.name)}
              helperText={formikAdd.touched.name && formikAdd.errors.name}
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
              value={formikAdd.values.startTime}
              onChange={formikAdd.handleChange}
              onBlur={formikAdd.handleBlur}
              error={
                formikAdd.touched.startTime &&
                Boolean(formikAdd.errors.startTime)
              }
              helperText={
                formikAdd.touched.startTime && formikAdd.errors.startTime
              }
            />
            <TextField
              margin="dense"
              label="End Date Time"
              name="endTime"
              type="datetime-local"
              fullWidth
              value={formikAdd.values.endTime}
              onChange={formikAdd.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              onBlur={formikAdd.handleBlur}
              error={
                formikAdd.touched.endTime && Boolean(formikAdd.errors.endTime)
              }
              helperText={formikAdd.touched.endTime && formikAdd.errors.endTime}
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
              value={formikAdd.values.resultTime}
              onChange={formikAdd.handleChange}
              onBlur={formikAdd.handleBlur}
              error={
                formikAdd.touched.resultTime &&
                Boolean(formikAdd.errors.resultTime)
              }
              helperText={
                formikAdd.touched.resultTime && formikAdd.errors.resultTime
              }
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
                formikAdd.setFieldValue("image", event.currentTarget.files[0])
              }
              error={formikAdd.touched.image && Boolean(formikAdd.errors.image)}
              helperText={formikAdd.touched.image && formikAdd.errors.image}
            />
            <DialogActions>
              <Button onClick={handleAddDialogClose1} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="secondary">
                {"Add Game"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setOpenAddDialog1(true)}
        sx={{
          position: "fixed",
          bottom: 30,
          right: 50,
        }}
      >
        <AddIcon />
      </Fab>
      <CustomSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </ThemeProvider>
  );
};

export default Allgames;
