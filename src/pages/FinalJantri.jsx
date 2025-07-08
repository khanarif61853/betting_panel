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
        <Typography
          fontFamily={"Alegreya Sans SC, sans-serif"}
          fontWeight={700}
          color="#604586"
          sx={{ fontSize: { xs: 15, sm: 18 } }}
        >
          Total: ₹{totalAmount}
        </Typography>
      </Box>
      {/* Responsive Bid Grid like Game.jsx */}
      <Box
        mt={2}
        sx={{
          overflowX: "auto",
          width: "100%",
          pb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: { xs: 1, sm: 2 },
            minWidth: 0,
            width: "100%",
            background: "#faf7fa",
            borderRadius: 2,
            px: { xs: 0.5, sm: 2 },
            py: { xs: 0.5, sm: 1 },
            overflowX: "auto",
          }}
        >
          {Array.from({ length: 10 }).map((_, colIdx) => {
            const colStart = colIdx * 10 + 1;
            const colHeader = colStart.toString().padStart(2, "0");
            return (
              <Box
                key={colHeader}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flex: 1,
                  minWidth: { xs: 60, sm: 0 },
                  maxWidth: { xs: 80, sm: 'none' },
                }}
              >
                {/* Column Header */}
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    color: "#604586",
                    mb: { xs: 0.5, sm: 1 },
                    fontSize: { xs: 12, sm: 14 },
                    letterSpacing: 1,
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  {colHeader}
                </Typography>
                {/* Column Cells */}
                {Array.from({ length: 10 }).map((_, rowIdx) => {
                  let number = colIdx * 10 + rowIdx + 1;
                  if (number > 99) number = "00";
                  const numberStr = number === "00" ? "00" : number.toString().padStart(2, "0");
                  const amount = bidMap[numberStr] || 0;
                  return (
                    <Box key={numberStr} sx={{ display: "flex", alignItems: "center", mb: { xs: 0.2, sm: 0.5 }, width: "100%" }}>
                      {/* Row label only for first column, but hide for first row */}
                      {colIdx === 0 && (
                        rowIdx === 0 ? (
                          // For the first cell (01), show empty space
                          <Box sx={{ width: { xs: 16, sm: 22 }, mr: 1 }} />
                        ) : (
                          // For other rows, show the row label
                          <Typography
                            variant="caption"
                            sx={{
                              width: { xs: 16, sm: 22 },
                              textAlign: "right",
                              mr: 1,
                              color: "#888",
                              fontWeight: 500,
                              fontSize: { xs: 11, sm: 13 },
                            }}
                          >
                            {numberStr}
                          </Typography>
                        )
                      )}
                      <Box
                        sx={{
                          border: "1px solid #eee",
                          background: "#f8f6f8",
                          borderRadius: 1,
                          minWidth: { xs: 28, sm: 38 },
                          minHeight: { xs: 24, sm: 32 },
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: { xs: 11, sm: 13 },
                          fontWeight: 500,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: "#604586",
                            fontSize: { xs: 11, sm: 13 },
                            lineHeight: 1.1,
                          }}
                        >
                          {/* {numberStr} */}
                        </Typography>
                        <Box
                          sx={{
                            borderRadius: 1,
                            px: 1,
                            py: 0.2,
                            mt: 0.2,
                            minWidth: { xs: 20, sm: 28 },
                            fontWeight: 700,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#333",
                              fontSize: { xs: 12, sm: 14 },
                              fontWeight: "bold",
                              lineHeight: 1.1,
                              textAlign: "center",
                            }}
                          >
                            {amount}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
                {/* Column Total */}
                <Typography
                  variant="caption"
                  sx={{
                    mt: { xs: 0.5, sm: 1 },
                    color: "#604586",
                    fontWeight: 700,
                    fontSize: { xs: 11, sm: 13 },
                    borderTop: "1px solid #eee",
                    pt: 0.5,
                    width: "100%",
                    textAlign: "center",
                    boxShadow: "0 1px 3px 0 #e0d7f7",
                  }}
                >
                  ₹{Array.from({ length: 10 }).reduce((sum, _, rowIdx) => {
                    let number = colIdx * 10 + rowIdx + 1;
                    if (number > 99) number = "00";
                    const numberStr = number === "00" ? "00" : number.toString().padStart(2, "0");
                    return sum + (Number(bidMap[numberStr]) || 0);
                  }, 0)}
                </Typography>
              </Box>
            );
          })}
        </Box>
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
