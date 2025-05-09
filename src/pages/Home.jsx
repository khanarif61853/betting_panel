import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Grid, Paper, Typography, Skeleton } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import PublicIcon from "@mui/icons-material/Public";
import axios from "axios";
import { BASE_URL } from "../costants";

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

  const [loading, setLoading] = useState(true); // Loading state for skeleton

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { data },
      } = await axios.get(`${BASE_URL}/api/web/retrieve/dashboard`, {
        headers: localStorage.getItem("token"),
      });
      setDashboardData(data);
      setLoading(false); // Data is loaded, set loading to false
    };
    fetchData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={2} my={2}>
          {/* Key Metrics */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <PeopleIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
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
                <Typography variant="h4">{dashboardData.liveGames}</Typography>
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
                <Typography variant="h4">{dashboardData.totalGames}</Typography>
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
                <PublicIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
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
    </ThemeProvider>
  );
};

export default Home;
