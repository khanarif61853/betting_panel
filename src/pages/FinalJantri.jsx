import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { useNavigate,useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL } from "../costants";
import { useFormik } from "formik";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CustomSnackbar from "../component/CustomSnackbar";
import { ElectricalServices, RsvpOutlined } from "@mui/icons-material";

const FinalJantri = () => {
  const navigate = useNavigate();
  const [formattedRows, setFormattedRows] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [resultDate, setResultDate] = useState(new Date().toISOString().split('T')[0]);
  const [topMaxBids, setTopMaxBids] = useState([]);
  const [topMinBids, setTopMinBids] = useState([]);
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
          setFormattedRows(response.data.formatted);
          
          const allBids = response.data.formatted.flatMap((item) => item.bids);
          const sortedBids = [...allBids].sort((a, b) => b.amount - a.amount);
          
          const topMax = sortedBids.slice(0, 10).map((bid) => ({
            ...bid,
            amountMultiplied: bid.amount * 90,
          }));
          
          const sortedMinBids = [...allBids].sort((a, b) => a.amount - b.amount);
          const topMin = sortedMinBids.slice(0, 10).map((bid) => ({
            ...bid,
            amountMultiplied: bid.amount * 90,
          }));
          
          setTopMaxBids(topMax);
          setTopMinBids(topMin);
        
      } catch (error) {
        setError("Failed to fetch game data");
        console.error("Error fetching games:", error);
      }
    };
    fetchGames();
  }, [resultDate]);

  const allBids = formattedRows.flatMap((item) => item.bids);
  console.log(allBids);
  const bidMap = allBids.reduce((acc, bid) => {
    acc[bid.number] = (acc[bid.number] || 0) + bid.amount;
    return acc;
  }, {});
   const totalAmount = allBids.reduce((sum, bid) => sum + bid.amount, 0);

  const rows = Array.from({ length: 100 }, (_, i) => i);

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
              Total collection:{" "}
              {totalAmount}
            </Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box mt={2}>
            <Typography
              variant="h6"
              fontFamily={"Alegreya Sans SC, sans-serif"}
              fontWeight={500}
            >
              Top 10 Maximum Bid Amounts
            </Typography>
            <Select sx={{ mt: 2, minWidth: 300 }} displayEmpty defaultValue="">
              <MenuItem value="" disabled>
                Select a maximum bid
              </MenuItem>
              {topMaxBids.map((bid) => (
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
              variant="h6"
              fontFamily={"Alegreya Sans SC, sans-serif"}
              fontWeight={500}
            >
              Top 10 Minimum Bid Amounts
            </Typography>
            <Select sx={{ mt: 2, minWidth: 300 }} displayEmpty defaultValue="">
              <MenuItem value="" disabled>
                Select a minimum bid
              </MenuItem>
              {topMinBids.map((bid, index) => (
                <MenuItem key={bid.number} value={bid.number}>
                  {`${index + 1}. Number: ${bid.number} | Bid: ₹${bid.amount.toLocaleString()} | Win: ₹${bid.amountMultiplied.toLocaleString()}`}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Grid>
        {/* <Grid item>
          <Box mt={2}>
            <Typography
              variant="h6"
              fontFamily={"Alegreya Sans SC, sans-serif"}
              fontWeight={500}
            >
              Select Start Date
            </Typography>
            <TextField
              type={"date"}
              value={resultDate}
              onChange={(e) => {
                setResultDate(e.target.value);
              }}
              format="DD/MM/yyyy"
            />
          </Box>
        </Grid> */}
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
          gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))",
          gap: 2,
        }}
      >
        {rows.map((number) => (
          <Box
            key={number}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: "1px solid #ddd",
              borderRadius: 1,
            }}
          >
            <Box
              sx={{
                width: "100%",
                padding: 0.5,
                backgroundColor: "#6f6bb7",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                borderTopLeftRadius: "4px",
                borderTopRightRadius: "4px",
              }}
            >
              <Typography variant="body2">{number}</Typography>
            </Box>
            <Box
              sx={{
                width: "100%",
                height: 30,
                backgroundColor: "#eceaf6",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderBottomLeftRadius: "4px",
                borderBottomRightRadius: "4px",
                color: "black",
              }}
            >
              <Typography variant="body2" fontWeight={"bold"}>
                {bidMap[number] ? `₹${bidMap[number]}` : ""}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
      <CustomSnackbar
        open={!!error || !!success}
        handleClose={handleCloseSnackbar}
        message={error || success}
        severity={error ? "error" : "success"}
      />
      <ToastContainer />
    </Box>
  );
};

export default FinalJantri;
