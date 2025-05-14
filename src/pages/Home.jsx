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
  TextField,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import PublicIcon from "@mui/icons-material/Public";
import axios from "axios";
import { BASE_URL } from "../costants";
import { DataGrid } from "@mui/x-data-grid";
import usePagination from "@mui/material/usePagination/usePagination";
import CustomSnackbar from "../component/CustomSnackbar";
import moment from "moment";

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
  const [dataRequest, setDataRequest] = useState([]);
  const [selectedDate, setSelectDate] = useState("");
  console.log(selectedDate);

  const [loading, setLoading] = useState(true); // Loading state for skeleton

  useEffect(() => {
    // fetch data ---------------
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

    // last winner  ---------------------------------
    const lastWinner = async () => {
      setLoading(true);
      const {
        data: { data },
      } = await axios.get(`${BASE_URL}/api/web/retrieve/last-winner`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { page: page + 1, limit, date: selectedDate || undefined },
      });

      const jantriData = (data.jantri || []).map((item) => ({
        ...item,
        remark: "Jantri",
      }));

      const crossData = (data.cross || []).map((item) => ({
        ...item,
        remark: "Cross",
      }));

      const openPlayData = (data.openPlay || []).map((item) => ({
        ...item,
        remark: "Open Play",
      }));

      const combinedData = [...jantriData, ...crossData, ...openPlayData];

      setRequests(combinedData);
      // console.log(combinedData, "-----combineddatalastwinner");
      setLoading(false); // Data is loaded, set loading to false
    };

    // all bids api fetch -----------------------------------------------------------------------------------
    const allbids = async () => {
      setLoading(true);
      try {
        const {
          data: { data },
        } = await axios.get(`${BASE_URL}/api/web/retrieve/all-bids`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // console.log(data,'---bidsdata');
        // const jantriData = (data.jantriGame || []).map((item) => ({
        //   game_name: item.game_name || "N/A",
        //   total_bid: item.total_bid,
        //   createdAt: item?.createdAt,
        //   remark: "JANTRI",
        // }));

        // const crossData = (data.crossGame || []).map((item) => ({
        //   game_name: item.game_name || "N/A",
        //   total_bid: item.total_bid,
        //   createdAt: item?.createdAt,
        //   remark: "CROSS",
        // }));

        // const openPlayData = (data.openplayGame || []).map((item) => ({
        //   game_name: item.game_name || "N/A",
        //   total_bid: item.total_bid,
        //   createdAt: item?.createdAt,
        //   remark: "OPEN PLAY",
        // }));

        // const combinedData = [...jantriData, ...crossData, ...openPlayData];
        // const formattedRows = combinedData.map((item, index) => ({
        //   id: index + 1,
        //   game: item.game_name,
        //   jantri: item.remark === "JANTRI" ? item.total_bid : 0,
        //   cross: item.remark === "CROSS" ? item.total_bid : 0,
        //   openPlay: item.remark === "OPEN PLAY" ? item.total_bid : 0,
        //   total: item?.total_bid,
        //   createdAt: item?.createdAt,
        // }));
        // console.log(formattedRows, "--------formatedd rowwss");

        setDataRequest(data);
      } catch (error) {
        console.error("Failed to fetch all bids:", error);
      }
      setLoading(false);
    };

    // fetch all data -----------------------------
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([allbids(), fetchData(), lastWinner()]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    // ----------------
  }, [page, limit, selectedDate]);

  // total bidding row column
  const bidcolumns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "game", headerName: "GAME", width: 200 },
    // { field: "jantri", headerName: "JANTRI", width: 200 },
    // { field: "cross", headerName: "CROSS", width: 200 },
    // { field: "openPlay", headerName: "OPEN PLAY", width: 200 },
    { field: "total", headerName: "TOTAL", width: 200 },
    { field: "createdAt", headerName: "Created At", width: 200 },
  ];
  const bidrows = (dataRequest || []).map((item, i) => ({
    id: i + 1,
    game: item.game_name || "N/A",
    // jantri: item.jantri || 0,
    // cross: item.cross || 0,
    // openPlay: item.openPlay || 0,
    total: item.total_bid || 0,
    createdAt: item?.createdAt
      ? moment(item.createdAt).format("YYYY-MM-DD")
      : "N/A",
  }));

  // winning number row column  -----------------------
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "customerName", headerName: "CUSTOMER NAME", width: 200 },
    { field: "game", headerName: "GAME", width: 200 },
    { field: "finalBidNumber", headerName: "BID NUMBER", width: 200 },
    { field: "winningAmount", headerName: "WINNING AMOUNT", width: 200 },
    { field: "gameCategory", headerName: "GAME CATEGORY", width: 200 },
    { field: "createdAt", headerName: "Created At", width: 200 },
  ];

  const rows = (requests || []).map((request, i) => ({
    id: i + 1,
    customerName: request?.customer?.name || "N/A",
    game: request?.Game?.name || "N/A",
    finalBidNumber: request?.Game?.finalBidNumber || "N/A",
    winningAmount: request?.winningAmount || "0",
    gameCategory: request?.remark || "N/A",
    createdAt: request?.createdAt
      ? moment(request.createdAt).format("YYYY-MM-DD")
      : "N/A",
  }));

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
                    Total Add Money Collection
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
        <Box style={{ width: "100%", display: "flex" }}>
          <Box style={{ height: 450, width: "50%" }} p={2}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography sx={{ textAlign: "center" }} variant="h5">
                Winning Users
              </Typography>
              <TextField
                label="Filter by Date"
                type="date"
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => {
                  setSelectDate(e.target.value);
                }}
              />
            </Box>
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

          {/* second table -----------------------------------------------------------------  */}
          <Box style={{ height: 450, width: "50%" }} p={2}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
                mt: 1,
              }}
            >
              <Typography sx={{ textAlign: "center" }} variant="h5">
                Total Bid
              </Typography>
              {/* <TextField
              label="Filter by Date"
              type="date"
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => {
                setSelectDate(e.target.value);
              }}
            /> */}
            </Box>
            <DataGrid
              rows={bidrows}
              columns={bidcolumns}
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
        </Box>
        {/* Render Snackbar */}
      </ThemeProvider>
    </>
  );
};

export default Home;
