import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../costants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CustomSnackbar from "../component/CustomSnackbar";
import moment from "moment-timezone";

const FinalJantri = () => {
  const navigate = useNavigate();
  const [formattedRows, setFormattedRows] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [resultDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [topMaxBids, setTopMaxBids] = useState([]);
  const [topMinBids, setTopMinBids] = useState([]);
  const [gameDetails, setGameDetails] = useState(null);
  const location = useLocation();
  const gameId = location.state?.id;

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/web/retrieve/andar-bahar-jodi`,
          {
            params: {
              gameId,
            },
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        if (response?.data?.data) {
          setFormattedRows(response?.data?.data);
          setGameDetails(response?.data?.gameDetails);

          const allBids = response?.data?.data?.flatMap(
            (item) => item.bids || []
          );
          const sortedBids = [...allBids].sort((a, b) => b.amount - a.amount);

          //  max bids
          const maxBidsMap = new Map();
          sortedBids.slice(0, 10).forEach((bid) => {
            const existingBid = maxBidsMap.get(bid.number);
            if (existingBid) {
              existingBid.amount += bid.amount;
              existingBid.amountMultiplied = existingBid.amount * 90;
            } else {
              maxBidsMap.set(bid.number, {
                ...bid,
                amountMultiplied: bid.amount * 90,
              });
            }
          });
          const topMax = Array.from(maxBidsMap.values()).sort(
            (a, b) => b.amount - a.amount
          );

          //  min bids
          const minBidsMap = new Map();
          const sortedMinBids = [...allBids].sort(
            (a, b) => a.amount - b.amount
          );
          sortedMinBids.slice(0, 10).forEach((bid) => {
            const existingBid = minBidsMap.get(bid.number);
            if (existingBid) {
              existingBid.amount += bid.amount;
              existingBid.amountMultiplied = existingBid.amount * 90;
            } else {
              minBidsMap.set(bid.number, {
                ...bid,
                amountMultiplied: bid.amount * 90,
              });
            }
          });
          const topMin = Array.from(minBidsMap.values()).sort(
            (a, b) => a.amount - b.amount
          );

          setTopMaxBids(topMax);
          setTopMinBids(topMin);
        }
      } catch (error) {
        setError("Failed to fetch game data");
        console.error("Error fetching games:", error);
      }
    };
    fetchGames();
  }, [resultDate]);

  const allBids = formattedRows?.flatMap((item) => item?.bids || []) || [];
  const bidMap = allBids.reduce((acc, bid) => {
    const key = bid.number === 0 ? "00" : bid.number;
    acc[key] = (acc[key] || 0) + bid.amount;
    return acc;
  }, {});
  const totalAmount = allBids.reduce((sum, bid) => sum + bid.amount, 0);

  const bidColumns = [];
  for (let col = 0; col < 10; col++) {
    const column = [];
    for (let row = 1; row <= 10; row++) {
      let num = col * 10 + row;
      if (col === 9 && row === 10) num = "00";
      column.push(num);
    }
    bidColumns.push(column);
  }

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "";
    return moment(dateTimeStr).format("DD MMM YYYY, hh:mm A");
  };

  const displayTopMaxBids = topMaxBids.map(bid => ({
    ...bid,
    number: bid.number === 0 ? "00" : bid.number
  }));
  const displayTopMinBids = topMinBids.map(bid => ({
    ...bid,
    number: bid.number === 0 ? "00" : bid.number
  }));

  return (
    <Box padding={3}>
      {" "}
      <Box
        sx={{ display: "flex", justifyContent: "space-between", width: "50%" }}
      >
        <ArrowBackIcon
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/games");
          }}
        />
        <Typography variant="v5" sx={{ fontSize: "20px" }} fontWeight={500}>
          Final Jantri
        </Typography>
      </Box>
      {gameDetails && (
        <Grid container spacing={2} sx={{ mt: 2, mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 2,
                backgroundColor: "#f5f5f5",
                borderRadius: 1,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                Start Time
              </Typography>
              <Typography variant="h6">
                {formatDateTime(gameDetails.startTime)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 2,
                backgroundColor: "#f5f5f5",
                borderRadius: 1,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                End Time
              </Typography>
              <Typography variant="h6">
                {formatDateTime(gameDetails.endTime)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 2,
                backgroundColor: "#f5f5f5",
                borderRadius: 1,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                Result Time
              </Typography>
              <Typography variant="h6">
                {formatDateTime(gameDetails.resultTime)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      )}
      <Grid
        container
        alignItems={"center"}
        spacing={2}
        justifyContent={"space-between"}
      >
        <Grid item>
          <Box mt={2} display={"flex"}>
            <Typography
              variant="h6"
              fontFamily={"Alegreya Sans SC, sans-serif"}
              fontWeight={500}
            >
              Total collection: {totalAmount}
            </Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box mt={2}>
            <Typography
              fontFamily={"Alegreya Sans SC, sans-serif"}
              fontWeight={500}
            >
              Top 10 Maximum Bid Amounts
            </Typography>
            <Select sx={{ mt: 1, minWidth: 150, height: 32, fontSize: 12, '.MuiSelect-select': { padding: '4px 8px', fontSize: 12 }}}  displayEmpty defaultValue="">
              <MenuItem value="" disabled>
                Select a maximum bid
              </MenuItem>
              {displayTopMaxBids.map((bid) => (
                <MenuItem key={bid.number} value={bid.number}>
                  {`Number: ${bid.number} | Bid: ₹${bid.amount.toLocaleString()} | Win: ₹${bid.amountMultiplied.toLocaleString()}`}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Grid>
        <Grid item>
          <Box mt={2}>
            <Typography
              fontFamily={"Alegreya Sans SC, sans-serif"}
              fontWeight={500}
            >
              Top 10 Minimum Bid Amounts
            </Typography>
            <Select sx={{ mt: 1, minWidth: 150, height: 32, fontSize: 12, '.MuiSelect-select': { padding: '4px 8px', fontSize: 12 }}}  displayEmpty defaultValue="">
              <MenuItem value="" disabled>
                Select a minimum bid
              </MenuItem>
              {displayTopMinBids.map((bid, index) => (
                <MenuItem key={bid.number} value={bid.number}>
                  {`${index + 1}. Number: ${bid.number} | Bid: ₹${bid.amount.toLocaleString()} | Win: ₹${bid.amountMultiplied.toLocaleString()}`}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Grid>
      </Grid>
      <Box
        mt={2}
        display="flex"
        alignItems={"center"}
        justifyContent={"space-between"}
        mb={2}
      >
        <Typography
          variant="h4"
          fontFamily={"Alegreya Sans SC, sans-serif"}
          fontWeight={500}
        >
          Bid Numbers
        </Typography>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(10, 1fr)",
          border: "1px solid black",
          width: "100%",
        }}
      >
        {Array.from({ length: 10 }).map((_, rowIdx) =>
          bidColumns.map((column) => {
            const number = column[rowIdx];
            return (
              <Box
                key={number}
                sx={{
                  display: "flex",
                  border: "1px solid lightgray",
                  borderRadius: 1,
                }}
              >
                <Box
                  sx={{
                    padding: {xs:0.1, sm:0.2,md:0.2, lg: 0.5 },
                    backgroundColor: "#6f6bb7",
                    color: "white",
                  }}
                >
                  <Typography variant="body2" fontSize={{ xs: 8, sm: 8, lg: 10 }}>
                    {number === "00" ? "00" : number < 10 ? `0${number}` : number}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "100%",
                    backgroundColor: "#eceaf6",
                    padding: {xs:0.1, sm:0.2,md:0.2, lg: 0.5 },
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "black",
                  }}
                >
                  <Typography variant="body2" fontWeight={"bold"} fontSize={{ xs: 8, sm: 8, lg: 10 }}>
                    {bidMap[number] ? `₹${bidMap[number]}` : ""}
                  </Typography>
                </Box>
              </Box>
            );
          })
        )}
      </Box>
      <CustomSnackbar
        open={!!error || !!success}
        handleClose={handleCloseSnackbar}
        message={error || success}
        severity={error ? "error" : "success"}
      />
    </Box>
  );
};

export default FinalJantri;
