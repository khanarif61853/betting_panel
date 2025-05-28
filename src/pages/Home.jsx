import { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Grid, Paper, Typography, Skeleton } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
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
  const { 
    dashboardTotalBid, 
    abDataShowNo, 
    dashboardWinningUsers,
    latestLastGameResult,
    lastGameTotalBid,
    lastGameWinners
  } = useContextProvider();

  const { page, limit } = usePagination();
  const [selectedDate] = useState("");
  const [profitValue, setProfitValue] = useState();
  const [lossValue, setLossValue] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // fetch data ---------------
  const fetchData = async () => {
    const {
      data: { data },
    } = await axios.get(`${BASE_URL}/api/web/retrieve/dashboard`, {
      headers: localStorage.getItem("token"),
      params: { page: page + 1, limit },
    });
    setDashboardData(data);
    console.log(data,"---home data");
    setLoading(false); // Data is loaded, set loading to false
  };

  const profitLoss = async () => {
    try {
      const {
        data: { data },
      } = await axios.get(`${BASE_URL}/api/web/retrieve/profit-loss`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const winValue = data?.jantriWin || 0;
      const totalValue = data?.jantriTotalAmount || 0;
      let profitValue;
      let lossValue;
      if (winValue > 0) {
        profitValue = Number(totalValue) - Number(winValue);
      }
      if (winValue > totalValue) {
        lossValue = Number(winValue) - Number(totalValue);
        profitValue = 0;
      }
      if (totalValue == winValue) {
        profitValue = 0;
        lossValue = 0;
      }
      setProfitValue(profitValue);
      setLossValue(lossValue);

      console.log(
        "Profit:",
        profitValue,
        "Loss:",
        lossValue,
        "jantri Total:",
        data.jantriTotalAmount
      );
    } catch (error) {
      console.error("Error fetching profit/loss:", error);
    }
  };

  useEffect(() => {
    fetchData();
    profitLoss();
  }, [page, limit, selectedDate]);

  const dashboardItems = [
    {
      title: "All Players",
      value: dashboardData?.totalCustomers,
      icon: <PeopleIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />,
      onClick: () => navigate("/customers"),
    },
    {
      title: "Live Games",
      value: dashboardData.liveGames,
      icon: (
        <SportsEsportsIcon
          sx={{ color: theme.palette.secondary.main, mr: 1 }}
        />
      ),
      onClick: () => navigate("/games"),
    },
    // {
    //   title: "Total Games",
    //   value: dashboardData.totalGames,
    //   icon: <SportsEsportsIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />,
    // },
    // ------------------------------------------------------------
    {
      title: "Total Collection",
      value: -dashboardData.totalCollection,
      icon: <AddCardIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />,
    },
    {
      title: "Last Game Result",
      value: latestLastGameResult,
      icon: <SportsEsportsIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />,
    },
    {
      title: "Last Game Total Bid",
      customContent: (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="h4">{lastGameTotalBid.amount}</Typography>
        </Box>
      ),
      icon: <SportsEsportsIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />,
      // onClick: () => navigate("/totalbid"),
    },
    {
      title: "Last Game Winners",
      customContent: (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="h4">{lastGameWinners.count}</Typography>
        </Box>
      ),
      icon: <SportsEsportsIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />,
      onClick: () => navigate("/last-game-winners"),
    },
    {
      title: "Winning Users",
      value: dashboardWinningUsers,
      icon: <GroupIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />,
      onClick: () => navigate("/winning-users"),
    },
    {
      title: "Total Bid",
      value: dashboardTotalBid,
      icon: <EqualizerIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />,
      onClick: () => navigate("/totalbid"),
    },
    {
      title: "Andar Bahar Winners",
      value: abDataShowNo,
      icon: <GroupIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />,
      onClick: () => navigate("/andar-bahar-winner"),
    },
    {
      title: "Profit / Loss",
      customContent: (
        <Box
          sx={{ display: "flex", width: "40%", justifyContent: "space-evenly" }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, color: "green" }}>
            {`+${profitValue || 0}`}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "red" }}>
            {`-${lossValue || 0}`}
          </Typography>
        </Box>
      ),
      icon: <EqualizerIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />,
    },
    {
      title: "Withdrawal Requests",
      icon: (
        <AttachMoneyIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
      ),
      onClick: () => navigate("/withdrawal-requests"),
    },
    {
      title: "Qr Code",
      icon: <PersonIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />,
      onClick: () => navigate("/qr-code"),
    },
    {
      title: "Rules",
      icon: <PersonIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />,
      onClick: () => navigate("/rules"),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={2} my={2}>
          {dashboardItems.map((item, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              key={index}
              onClick={item.onClick}
              sx={{ cursor: item.onClick ? "pointer" : "default" }}
            >
              <Paper elevation={3}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {item.icon}
                  <Typography variant="h6" color="primary">
                    {item.title}
                  </Typography>
                </Box>
                {loading ? (
                  <Skeleton variant="text" width="60%" height={50} />
                ) : item.customContent ? (
                  item.customContent
                ) : (
                  item.value !== undefined && (
                    <Typography variant="h4">{item.value}</Typography>
                  )
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default Home;
