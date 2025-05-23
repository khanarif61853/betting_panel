import { useContext, useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Grid, Paper, Typography, Skeleton } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import PublicIcon from "@mui/icons-material/Public";
import axios from "axios";
import { BASE_URL } from "../costants";
import usePagination from "@mui/material/usePagination/usePagination";
import { useNavigate } from "react-router-dom";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AddCardIcon from "@mui/icons-material/AddCard";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import { useContextProvider } from "../context/ContextProvider";

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
  const { dashboardTotalBid, dashboardWinningUsers } = useContextProvider();

  const { page, limit, total, changePage, changeLimit, changeTotal } =
    usePagination();
  let [selectedDate, setSelectedDate] = useState("");

  const navigate = useNavigate();
  console.log(selectedDate);

  const [loading, setLoading] = useState(true); // Loading state for skeleton

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

  const profitLoss = async () => {
    const {
      data: { data },
    } = await axios.get(`${BASE_URL}/api/web/retrieve/dashboard`, {
      headers: localStorage.getItem("token"),
      params: { page: page + 1, limit },
    });
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, selectedDate]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <Box sx={{ flexGrow: 1, p: 2 }}>
          <Grid container spacing={2} my={2}>
            {/* Key Metrics */}
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              onClick={() => navigate("/customers")}
              sx={{ cursor: "pointer" }}
            >
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

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              onClick={() => navigate("/games")}
              sx={{ cursor: "pointer" }}
            >
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

            <Grid item xs={12} sm={6} md={3} sx={{ cursor: "pointer" }}>
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

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              onClick={() => navigate("/add-money")}
              sx={{ cursor: "pointer" }}
            >
              <Paper elevation={3}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <AddCardIcon
                    sx={{ color: theme.palette.primary.main, mr: 1 }}
                  />
                  <Typography variant="h6" color="primary">
                    Total Add Money
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

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              onClick={() => navigate("/winning-users")}
              sx={{ cursor: "pointer" }}
            >
              <Paper elevation={3}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <GroupIcon
                    sx={{ color: theme.palette.primary.main, mr: 1 }}
                  />
                  <Typography variant="h6" color="primary">
                    Winning Users
                  </Typography>
                </Box>
                {loading ? (
                  <Skeleton variant="text" width="60%" height={50} />
                ) : (
                  <Typography variant="h4">{dashboardWinningUsers}</Typography>
                )}
              </Paper>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              onClick={() => navigate("/totalbid")}
              sx={{ cursor: "pointer" }}
            >
              <Paper elevation={3}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <EqualizerIcon
                    sx={{ color: theme.palette.primary.main, mr: 1 }}
                  />
                  <Typography variant="h6" color="primary">
                    Total Bid
                  </Typography>
                </Box>
                {loading ? (
                  <Skeleton variant="text" width="60%" height={50} />
                ) : (
                  <Typography variant="h4">{dashboardTotalBid}</Typography>
                )}
              </Paper>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              onClick={() => navigate("/andar-bahar-winners")}
              sx={{ cursor: "pointer" }}
            >
              <Paper elevation={3}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <GroupIcon
                    sx={{ color: theme.palette.primary.main, mr: 1 }}
                  />
                  <Typography variant="h6" color="primary">
                    Andar Bahar Winners
                  </Typography>
                </Box>
                {loading ? (
                  <Skeleton variant="text" width="60%" height={50} />
                ) : (
                  <Typography variant="h4">{dashboardWinningUsers}</Typography>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3} sx={{ cursor: "pointer" }}>
              <Paper elevation={3}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <EqualizerIcon
                    sx={{ color: theme.palette.primary.main, mr: 1 }}
                  />
                  <Typography variant="h6" color="primary">
                    Profit / Loss
                  </Typography>
                </Box>
                {loading ? (
                  <Skeleton variant="text" width="60%" height={50} />
                ) : (
                  <Typography variant="h4">
                    {"+500"} {"-200"}
                  </Typography>
                )}
              </Paper>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              onClick={() => navigate("/withdrawal-requests")}
              sx={{ cursor: "pointer" }}
            >
              <Paper elevation={3}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <AttachMoneyIcon
                    sx={{ color: theme.palette.primary.main, mr: 1 }}
                  />
                  <Typography variant="h6" color="primary">
                    Withdrawal Requests
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              onClick={() => navigate("/qr-code")}
              sx={{ cursor: "pointer" }}
            >
              <Paper elevation={3}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <PersonIcon
                    sx={{ color: theme.palette.primary.main, mr: 1 }}
                  />
                  <Typography variant="h6" color="primary">
                    Qr Code
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              onClick={() => navigate("/rules")}
              sx={{ cursor: "pointer" }}
            >
              <Paper elevation={3}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <PersonIcon
                    sx={{ color: theme.palette.primary.main, mr: 1 }}
                  />
                  <Typography variant="h6" color="primary">
                    Rules
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
        {/* Render Snackbar */}
      </ThemeProvider>
    </>
  );
};

export default Home;
