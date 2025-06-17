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

const Games = () => {
  const [existingGames, setExistingGames] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const { page, limit, changePage, changeLimit } = usePagination();
  const {
    games,
    gamesTotal,
    loading: contextLoading,
    setGamesDate,
    gamesDate,
    latestLastGameResult,
  } = useContextProvider();

  const navigate = useNavigate();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  
  const fetchGames = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/web/retrieve/gamesName`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "ngrok-skip-browser-warning": true,
          },
          params: {
            page,
            limit
          }
        }
      );
      if (response.data) {
        setExistingGames(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      if (err.response) {
        console.error("Error fetching data", err.response.data.message);
        setError(err.response.data.message);
      } else {
        console.error("Error fetching data", err.message);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchGames();
  }, [page, limit]);
  
  const handleStatusChange = async (id) => {
    setLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/api/web/status/game`,
        {
          status: !games.find((row) => row.id === id).status,
          id: id,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "ngrok-skip-browser-warning": true,
          },
        }
      );
      setSuccess("Game status updated successfully");
    } catch (error) {
      console.error("Error updating game status", error.response.data.message);
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
    setSnackbarOpen(false);
  };

  const showSnackbar = (message, severity) => {
    if (severity === "error") {
      setError(message);
    } else {
      setSuccess(message);
    }
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleEdit = (id) => {
    const gameToEdit = games.find((row) => row.id === id);
    setEditingGame(gameToEdit);
    formik.setValues({
      name: gameToEdit.name,
      startDateTime: gameToEdit.startDateTime,
      endDateTime: gameToEdit.endDateTime,
      resultDateTime: gameToEdit.resultDateTime,
      image: null,
    });
    setOpenAddDialog(true);
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    setLoading(true);
    try {
      let response = await axios.delete(`${BASE_URL}/api/web/delete/game`, {
        params: { id: deleteId },
        headers: {
          Authorization: localStorage.getItem("token"),
          "ngrok-skip-browser-warning": true,
        },
      });
      if (response.data.type == "error") {
        // setRows(rows.filter((row) => row.id !== deleteId));
        setError(response.data.message);
        return;
      }
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

  // const handleOpenDialog = (id) => {
  //   setDeleteId(id);
  //   setOpenDialog(true);
  // };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDeleteId(null);
  };

  const handleAddOrEditGame = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("startDateTime", values.startDateTime);
    formData.append("endDateTime", values.endDateTime);
    formData.append("resultDateTime", values.resultDateTime);
    if (values.image) formData.append("image", values.image);

    try {
      if (editingGame) {
        try {
          const response = await axios.put(
            `${BASE_URL}/api/web/update/game`,
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

          if (response.data.type === "error") {
            showSnackbar(response.data.message, "error");
            return; // Keep dialog open on error
          }

          showSnackbar("Game updated successfully", "success");
          setOpenAddDialog(false); // Only close on success
          setEditingGame(null);
          formik.resetForm();
        } catch (err) {
          showSnackbar(err.response?.data?.message || err.message, "error");
          return; // Keep dialog open on error
        }
      } else {
        const response = await axios.post(
          `${BASE_URL}/api/web/create/game`,
          formData,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
              "ngrok-skip-browser-warning": true,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.type === "error") {
          showSnackbar(response.data.message, "error");
          return; // Keep dialog open on error
        }

        showSnackbar("Game added successfully", "success");
        setOpenAddDialog(false); // Only close on success
        formik.resetForm();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to add/update game";
      showSnackbar(errorMessage, "error");
      return; // Keep dialog open on error
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: editingGame ? editingGame.name : "",
      startDateTime: editingGame
        ? moment(editingGame.startDateTime).format("YYYY-MM-DD HH:mm:ss")
        : "",
      endDateTime: editingGame
        ? moment(editingGame.endDateTime).format("YYYY-MM-DD HH:mm:ss")
        : "",
      resultDateTime: editingGame
        ? moment(editingGame.resultDateTime).format("YYYY-MM-DD HH:mm:ss")
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

  const columns = [
    // { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "startDateTime", headerName: "Start Time", width: 150 },
    { field: "endDateTime", headerName: "End Time", width: 150 },
    { field: "resultDateTime", headerName: "Result Time", width: 150 },
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
    // {
    //   field: "status",
    //   headerName: "Status",
    //   width: 120,
    //   renderCell: ({ row }) => (
    //     <Switch
    //       size="small"
    //       checked={Boolean(row.status)}
    //       color="warning"
    //       onChange={() => handleStatusChange(row.id)}
    //       onClick={(e) => {
    //         e.stopPropagation();
    //       }}
    //       inputProps={{ "aria-label": "controlled" }}
    //     />
    //   ),
    // },
    {
      field: "action",
      headerName: "Action",
      width: 130,
      renderCell: ({ row }) => (
        <div>
          {/* <IconButton
            color="primary"
            sx={{ color: "purple" }}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row.id);
            }}
            aria-label="edit"
          >
            <EditIcon />
          </IconButton> */}
          {/* <IconButton
            color="secondary"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDialog(row.id);
            }}
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton> */}
          <IconButton
            sx={{ color: "#4389A2" }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/game?id=${row.id}&name=${row.name}`);
            }}
            aria-label="send"
          >
            <SendIcon />
          </IconButton>
        </div>
      ),
    },
    {
      field: "finaljantri",
      headerName: "Final Jantri",
      width: 100,
      textAlign: "center",
      renderCell: ({ row }) => (
        <div>
          <Chip
            label={"Open"}
            sx={{ textAlign: "center", marginLeft: 2, cursor: "pointer" }}
            color="primary"
            onClick={() => navigate("/final-jantri", { state: { id: row.id } })}
          />
        </div>
      ),
    },
    {
      field: "result",
      headerName: "Result",
      width: 100,
      textAlign: "center",
      renderCell: ({ row }) => (
        <div>
          {/* {console.log(row)} */}
          {row.finalBidNumber != null ? (
            <Chip
              label={row.finalBidNumber}
              sx={{ bgcolor: "#ff1744", color: "white" }}
            />
          ) : (
            <Chip label={"Not Declared"} color="primary" />
          )}
        </div>
      ),
    },
  ];

  const CustomDataGrid = ({ rows }) => {
    // let oldDateTime = moment('2025-08-31 12:47:00', "YYYY-MM-DD HH:mm:ss");
    // console.log(oldDateTime,'oldDateTime---')
    // let today = moment();
    // console.log(today.month(),'today')
    // let mergedDateTime = oldDateTime
    //   .set({
    //     year: today.year(),
    //     month: today.month(),
    //     date: today.date()
    //   })
    //   .format();

    // console.log(mergedDateTime, 'mergedDateTime------------');
    const [filter, setFilter] = useState("all");

    const handleFilterChange = (event) => {
      setFilter(event.target.value);
    };

    const filteredRows = rows.filter((row) => {
      if (filter === "all") return true;
      if (filter === "declared") return row.finalBidNumber !== null;
      if (filter === "notDeclared") return row.finalBidNumber === null;
    });

    const handleDateChange = (newDate) => {
      setGamesDate(newDate);
    };

    const latestGame = rows.find(
      (game) => game.finalBidNumber === latestLastGameResult
    );

    return (
      <>
        {/* <LocalizationProvider dateAdapter={AdapterDayjs}> */}
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
        >
          {latestLastGameResult && latestGame && (
            <Grid item xs={12}>
              <Box
                sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: "#f5f5f5",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="h6"
                  fontFamily={"Alegreya Sans SC, sans-serif"}
                  fontWeight={500}
                >
                  Latest Result: {latestGame.name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="subtitle1" sx={{ mr: 1 }}>
                    {moment(latestGame.resultDateTime).format("DD/MM/YYYY")}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}
          <Grid item xs={5} display={"flex"} alignItems={"center"}>
            <Typography variant="h6" paddingX={1}>
              Result:
            </Typography>
            <Select value={filter} onChange={handleFilterChange}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="declared">Declared</MenuItem>
              <MenuItem value="notDeclared">Not Declared</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={5} display={"flex"} alignItems={"center"}>
            <Typography variant="h6" paddingX={1}>
              Start Date:
            </Typography>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                label="Basic date picker"
                value={gamesDate}
                onChange={handleDateChange}
              />
            </DemoContainer>
          </Grid>
        </Grid>
        <div style={{ height: 450, width: "100%" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: limit, page },
              },
            }}
            paginationMode="server"
            rowCount={gamesTotal}
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
            loading={contextLoading || loading}
          />
        </div>
        {/* </LocalizationProvider> */}
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
        <CustomDataGrid rows={games} />
        <CustomSnackbar
          open={snackbarOpen}
          onClose={handleCloseSnackbar}
          message={error || success}
          severity={snackbarSeverity}
        />
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
            <FormControl fullWidth margin="dense">
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
            </FormControl>
            <TextField
              margin="dense"
              label="Or Enter New Game Name"
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
              name="startDateTime"
              label="Start Date Time"
              type="datetime-local"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={formik.values.startDateTime}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.startDateTime &&
                Boolean(formik.errors.startDateTime)
              }
              helperText={
                formik.touched.startDateTime && formik.errors.startDateTime
              }
            />
            <TextField
              margin="dense"
              label="End Date Time"
              name="endDateTime"
              type="datetime-local"
              fullWidth
              value={formik.values.endDateTime}
              onChange={formik.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              onBlur={formik.handleBlur}
              error={
                formik.touched.endDateTime && Boolean(formik.errors.endDateTime)
              }
              helperText={
                formik.touched.endDateTime && formik.errors.endDateTime
              }
            />
            <TextField
              margin="dense"
              label="Result Date Time"
              name="resultDateTime"
              type="datetime-local"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={formik.values.resultDateTime}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.resultDateTime &&
                Boolean(formik.errors.resultDateTime)
              }
              helperText={
                formik.touched.resultDateTime && formik.errors.resultDateTime
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
                {editingGame ? "Update Game" : "Add Game"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

export default Games;
