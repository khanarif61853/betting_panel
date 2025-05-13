import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import PublicIcon from "@mui/icons-material/Public";
import axios from "axios";
import { BASE_URL } from "../costants";
import { DataGrid } from "@mui/x-data-grid";
import usePagination from "@mui/material/usePagination/usePagination";
import CustomSnackbar from "../component/CustomSnackbar";

const theme = createTheme({
  palette: {
    primary: {
      main: "#604586",
    },
    secondary: {
      main: "#516294",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: "16px",
          borderRadius: "8px",
        },
      },
    },
  },
});

const Home = () => {
  const [dashboardData, setDashboardData] = useState({
    totalCustomers: "",
    liveGames: "",
    totalGames: "",
    totalUsers: "",
  });
  const { page, limit, total, changePage, changeLimit, changeTotal } =
    usePagination();
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true); // Loading state for skeleton


  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { data },
      } = await axios.get(`${BASE_URL}/api/web/retrieve/dashboard`, {
        headers: localStorage.getItem("token"),
        params: { page: page + 1, limit },
      });
      setDashboardData(data);
      setLoading(false); // Data is loaded, set loading to false
    };
    fetchData();
     const lastWinner = async () => {
      const {
        data: { data },
      } = await axios.get(`${BASE_URL}/api/web/retrieve/last-winner`, {
        // headers: localStorage.getItem("token"),
        headers:{
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        params: { page: page + 1, limit },
      });
      // setDashboardData(data);
      console.log(data,'last-winner')
      setLoading(false); // Data is loaded, set loading to false
    };
    lastWinner();
  }, []);

  // winning user table --------------

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "customerName", headerName: "CUSTOMER NAME", width: 200 },
    { field: "game", headerName: "GAME", width: 200 },
    { field: "winningAmount", headerName: "WINNING AMOUNT", width: 200 },
    { field: "gameName", headerName: "GAME NAME", width: 200 },
    { field: "createdAt", headerName: "Created At", width: 200 },
  ];

  const rows = requests?.map((request) => {
    return {
      id: request.id,
      customerName: request.Customer.name,
      amount: request.game,
      total: request.total,
      createdAt: moment(request.createdAt).format("YYYY-MM-DD HH:mm:ss"),

    };
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <Box sx={{ flexGrow: 1, p: 2 }}>
          <Grid container spacing={2} my={2}>
            {/* Key Metrics */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <PeopleIcon
                    sx={{ color: theme.palette.primary.main, mr: 1 }}
                  />
                  <Typography variant="h6" color="primary">
                    Total Customers
                  </Typography>
                </Box>
                {loading ? (
                  <Skeleton variant="text" width="60%" height={50} />
                ) : (
                  <Typography variant="h4">
                    {dashboardData?.totalCustomers}
                  </Typography>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <SportsEsportsIcon
                    sx={{ color: theme.palette.secondary.main, mr: 1 }}
                  />
                  <Typography variant="h6" color="primary">
                    Live Games
                  </Typography>
                </Box>
                {loading ? (
                  <Skeleton variant="text" width="60%" height={50} />
                ) : (
                  <Typography variant="h4">
                    {dashboardData.liveGames}
                  </Typography>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <SportsEsportsIcon
                    sx={{ color: theme.palette.primary.main, mr: 1 }}
                  />
                  <Typography variant="h6" color="primary">
                    Total Games
                  </Typography>
                </Box>
                {loading ? (
                  <Skeleton variant="text" width="60%" height={50} />
                ) : (
                  <Typography variant="h4">
                    {dashboardData.totalGames}
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/*<Grid item xs={12} sm={6} md={3}>*/}
            {/*  <Paper elevation={3}>*/}
            {/*    <Box sx={{ display: 'flex', alignItems: 'center' }}>*/}
            {/*      <PublicIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />*/}
            {/*      <Typography variant="h6" color="primary">Total Users</Typography>*/}
            {/*    </Box>*/}
            {/*    {loading ? (*/}
            {/*        <Skeleton variant="text" width="60%" height={50} />*/}
            {/*    ) : (*/}
            {/*        <Typography variant="h4">{dashboardData.totalUsers}</Typography>*/}
            {/*    )}*/}
            {/*  </Paper>*/}
            {/*</Grid>*/}
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <PublicIcon
                    sx={{ color: theme.palette.primary.main, mr: 1 }}
                  />
                  <Typography variant="h6" color="primary">
                    Total Collection
                  </Typography>
                </Box>
                {loading ? (
                  <Skeleton variant="text" width="60%" height={50} />
                ) : (
                  <Typography variant="h4">
                    {-dashboardData.totalCollection}
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* table of winners ------------------------------------------------------------------------ */}

        <Box style={{ height: 450, width: "100%" }} p={2}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: limit, page },
              },
            }}
            paginationMode="server"
            rowCount={total}
            pageSize={limit}
            disableSelectionOnClick
            onRowSelectionModelChange={() => {}} // No-op to prevent default selection behavior
            onPaginationModelChange={(value) => {
              if (value.pageSize !== limit) {
                changeLimit(value.pageSize);
                return changePage(0);
              }
              changePage(value.page);
              changeLimit(value.pageSize);
            }}
            loading={loading}
            getRowHeight={() => "auto"} // Adjust row height based on content
          />
        </Box>

        {/* Render Snackbar */}

      </ThemeProvider>
    </>
  );
};

export default Home;
