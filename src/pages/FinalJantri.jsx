import { useEffect, useState } from "react";
import {
  Box,
  Typography,
<<<<<<< HEAD
  useTheme,
  useMediaQuery,
=======
>>>>>>> 9cbca005a124c5fe173c878800d2fb34d112b328
  Grid,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
<<<<<<< HEAD
import { useNavigate, useSearchParams } from "react-router-dom";
=======
import { useNavigate } from "react-router-dom";
>>>>>>> 9cbca005a124c5fe173c878800d2fb34d112b328
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL } from "../costants";
import { useFormik } from "formik";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CustomSnackbar from "../component/CustomSnackbar";
<<<<<<< HEAD
import { ElectricalServices } from "@mui/icons-material";

const FinalJantri = () => {
  const navigate = useNavigate();
  const [bids, setBids] = useState([]);
  const [insideNumbersAddBid, setInsideNumbersAddBid] = useState([]);
  const [outsideNumbersAddBid, setOutsideNumbersAddBid] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [resultDate, setResultDate] = useState(new Date());
  const [bidDeclared, setBidDeclared] = useState(false); // New state for declaration status
  const [collectedAmount, setCollectedAmount] = useState();
  const [games, setGames] = useState([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
=======
import { ElectricalServices, RsvpOutlined } from "@mui/icons-material";

const FinalJantri = () => {
  const navigate = useNavigate();
  const [formattedRows, setFormattedRows] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [resultDate, setResultDate] = useState(new Date().toISOString().split('T')[0]);
  const [topMaxBids, setTopMaxBids] = useState([]);
  const [topMinBids, setTopMinBids] = useState([]);
>>>>>>> 9cbca005a124c5fe173c878800d2fb34d112b328

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };
<<<<<<< HEAD
  const [topMaxBids, setTopMaxBids] = useState([]);
  const [topMinBids, setTopMinBids] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      const response = await axios.get(BASE_URL + "/api/web/retrieve/games", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setGames(response.data.data.games);
    };
    fetchGames();
  }, []);

  useEffect(() => {
    let intervalId;
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/web/retrieve/bids`, {
          params: { id: searchParams.get("id"), resultDate },
          headers: {
            Authorization: localStorage.getItem("token"),
            "ngrok-skip-browser-warning": true,
          },
        });

        if (response.data.type === "success") {
          let {
            bids,
            inside,
            outside,
            finalBidNumber,
            collectedAmount: amountCollection,
          } = response.data.data;
          if (finalBidNumber == 0) {
            finalBidNumber = "0";
          }
          setCollectedAmount(amountCollection);
          if (finalBidNumber) {
            setBidDeclared(finalBidNumber);
            clearInterval(intervalId);
          }

          inside = JSON.parse(inside);
          outside = JSON.parse(outside);
          setInsideNumbersAddBid(inside);
          setOutsideNumbersAddBid(outside);

          //  -----------------------------------
          // const insideNumbers = outsideNumbersAddBid?.map(({ number, amount }) => ({
          //   number: number,
          //   amount: amount / 10,
          // }));

          // const outsideNumbers = insideNumbersAddBid?.map((item) => ({
          //   number: item.number,
          //   amount: item.amount / 10,
          // }));
          // // -------------------------------------------
          // const updateBids = bids?.map((bid) => {
          //   let bidAmount = bid.amount;
          //   const numString = bid.number.toString();
          //   insideNumbersAddBid?.forEach((insideBid) => {
          //     console.log(insideBid, "insideBid");
          //     if (
          //       parseInt(numString[0], 10) === insideBid.number ||
          //       parseInt(numString[1], 10) === insideBid.number
          //     ) {
          //       bidAmount += insideBid.amount;
          //       console.log(bidAmount, "insideBidAmount");
          //       console.log(insideBid.amount, "insideBidAmount of .............");
          //     }
          //   });
          //   return {...bid, amount: bidAmount };
          // });
          
          setBids(updateBids);
          response?.data?.data?.prevGame?.id
            ? setSearchParams({ id: response?.data?.data?.prevGame?.id })
            : null;
          response?.data?.data?.prevGame?.finalBidNumber
            ? setBidDeclared(response?.data?.data?.prevGame?.finalBidNumber)
            : setBidDeclared(false);

          // Calculate Top 10 Max and Min Bids (multiply by 90)
          const sortedBids = [...bids].sort((a, b) => b.amount - a.amount);
=======

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/web/retrieve/andar-bahar-jodi`,
          {
            params: {
              resultDate,
            },
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        if (response.statusText === "OK") {
          setFormattedRows(response.data.formatted);
          
          const allBids = response.data.formatted.flatMap((item) => item.bids);
          const sortedBids = [...allBids].sort((a, b) => b.amount - a.amount);
          
>>>>>>> 9cbca005a124c5fe173c878800d2fb34d112b328
          const topMax = sortedBids.slice(0, 10).map((bid) => ({
            ...bid,
            amountMultiplied: bid.amount * 90,
          }));
<<<<<<< HEAD

          const sortedMinBids = [...bids].sort((a, b) => a.amount - b.amount);
=======
          
          const sortedMinBids = [...allBids].sort((a, b) => a.amount - b.amount);
>>>>>>> 9cbca005a124c5fe173c878800d2fb34d112b328
          const topMin = sortedMinBids.slice(0, 10).map((bid) => ({
            ...bid,
            amountMultiplied: bid.amount * 90,
          }));
<<<<<<< HEAD

=======
          
>>>>>>> 9cbca005a124c5fe173c878800d2fb34d112b328
          setTopMaxBids(topMax);
          setTopMinBids(topMin);
        }
      } catch (error) {
<<<<<<< HEAD
        console.error("Error fetching bids:", error);
        setBids([]);
      }
    };

    fetchData();
    intervalId = setInterval(() => {
      fetchData();
    }, 7000);

    return () => {
      clearInterval(intervalId);
    };
  }, [searchParams, resultDate]);

  //  -----------------------------------
  // const insideNumbers = outsideNumbersAddBid?.map(({ number, amount }) => ({
  //   number: number,
  //   amount: amount / 10,
  // }));

  // const outsideNumbers = insideNumbersAddBid?.map((item) => ({
  //   number: item.number,
  //   amount: item.amount / 10,
  // }));
  // -------------------------------------------

  const bidMap = bids?.reduce((acc, bid) => {
    acc[parseInt(bid.number, 10)] = bid.amount;
    return acc;
  }, {});
  console.log(bidMap, "-----------------bidMap");

  // const minBidAmount =
  //   bids?.length > 0 ? Math.min(...bids.map((bid) => bid.amount)) : 0;
  // const maxBidAmount =
  //   bids?.length > 0 ? Math.max(...bids.map((bid) => bid.amount)) : 0;
  // const minInsideBidAmount =
  //   insideNumbers?.length > 0
  //     ? Math.min(...insideNumbers.map((bid) => bid.amount))
  //     : 0;
  // const minOutsideBidAmount =
  //   outsideNumbers?.length > 0
  //     ? Math.min(...outsideNumbers.map((bid) => bid.amount))
  //     : 0;

  const rows = Array.from({ length: 100 }, (_, i) => i);
  // if (i < 10) {
  //      "0"+ i;
  // }
  // else{
  //    i
  // }

  // const insideOutsideRow = Array.from({ length: 10 }, (_, i) => i);
  // const insideBidMap = insideNumbers?.reduce((acc, bid) => {
  //   acc[parseInt(bid.number, 10)] = bid.amount;
  //   return acc;
  // }, {});
  // const outsideBidMap = outsideNumbers?.reduce((acc, bid) => {
  //   acc[parseInt(bid.number, 10)] = bid.amount;
  //   return acc;
  // }, {});

  // const formik = useFormik({
  //   initialValues: {
  //     bidNumber: {},
  //     insideBidNumber: {},
  //     outsideBidNumber: {},
  //   },
  //   onSubmit: (values) => {
  //     // console.log(values);
  //   },
  // });

  // const handleBidNumberClick = (number) => {
  //   // console.log(formik.values.bidNumber.number)
  //   if (bidDeclared) return; // Prevent clicking if bid is declared

  //   let insideBidNumber = { number: 0, amount: 0 };
  //   let outsideBidNumber = { number, amount: bidMap[number] || 0 };

  //   if (number < 10) {
  //     insideBidNumber = { number: 0, amount: insideBidMap[0] || 0 };
  //     outsideBidNumber = { number, amount: bidMap[number] || 0 };
  //   } else {
  //     const numberStr = number.toString();
  //     const insideNumber = parseInt(numberStr[0], 10);
  //     const outsideNumber = parseInt(numberStr[numberStr.length - 1], 10);

  //     insideBidNumber = {
  //       number: insideNumber,
  //       amount: insideBidMap[insideNumber] || 0,
  //     };
  //     outsideBidNumber = {
  //       number: outsideNumber,
  //       amount: outsideBidMap[outsideNumber] || 0,
  //     };
  //   }

  //   formik.setFieldValue("bidNumber", { number, amount: bidMap[number] || 0 });
  //   formik.setFieldValue("insideBidNumber", insideBidNumber);
  //   formik.setFieldValue("outsideBidNumber", outsideBidNumber);

  //   setSelectedBid({ number, amount: bidMap[number] || 0 });
  // };
=======
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
>>>>>>> 9cbca005a124c5fe173c878800d2fb34d112b328

  return (
    <Box padding={3}>
      {" "}
<<<<<<< HEAD
      <ArrowBackIcon
        style={{ cursor: "pointer" }}
        onClick={() => {
          navigate("/games");
        }}
      />
=======
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
>>>>>>> 9cbca005a124c5fe173c878800d2fb34d112b328
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
<<<<<<< HEAD
              <span style={{ color: "#28a745" }}>
                {collectedAmount ? "+" + -collectedAmount : 0}
              </span>
=======
              {totalAmount}
>>>>>>> 9cbca005a124c5fe173c878800d2fb34d112b328
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
            <Select sx={{ mt: 2, minWidth: 200 }} displayEmpty defaultValue="">
              <MenuItem value="" disabled>
                Select a maximum bid
              </MenuItem>
              {topMaxBids.map((bid) => (
                <MenuItem key={bid.number} value={bid.number}>
                  {`Bid Number: ${bid.number}, Amount: ₹${bid.amount}, Multiplied Amount: ₹${bid.amountMultiplied}`}
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
            <Select sx={{ mt: 2, minWidth: 200 }} displayEmpty defaultValue="">
              <MenuItem value="" disabled>
                Select a minimum bid
              </MenuItem>
              {topMinBids.map((bid) => (
                <MenuItem key={bid.number} value={bid.number}>
                  {`Bid Number: ${bid.number}, Amount: ₹${bid.amount}, Multiplied Amount: ₹${bid.amountMultiplied}`}
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
<<<<<<< HEAD
        <Typography
          variant="h4"
          fontFamily={"Alegreya Sans SC, sans -serif"}
          display={bidDeclared ? "inline-flex" : "none"}
          backgroundColor="red"
          borderRadius={"10px"}
          color={"white"}
          p={1}
          fontWeight={500}
        >
          {bidDeclared}
        </Typography>
=======
>>>>>>> 9cbca005a124c5fe173c878800d2fb34d112b328
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
<<<<<<< HEAD
              cursor: bidDeclared ? "not-allowed" : "pointer", // Change cursor if bid is declared
=======
>>>>>>> 9cbca005a124c5fe173c878800d2fb34d112b328
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
<<<<<<< HEAD
                // backgroundColor: '#eceaf6',
                width: "100%",
                height: 30,
                backgroundColor: bidDeclared ? "#BEB8D1" : "#eceaf6", // Change background color if bid is declared
=======
                width: "100%",
                height: 30,
                backgroundColor: "#eceaf6",
>>>>>>> 9cbca005a124c5fe173c878800d2fb34d112b328
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderBottomLeftRadius: "4px",
                borderBottomRightRadius: "4px",
                color: "black",
              }}
            >
              <Typography variant="body2" fontWeight={"bold"}>
<<<<<<< HEAD
                {bidMap
                  ? bidMap[number] !== undefined
                    ? `₹${bidMap[number]}`
                    : ""
                  : ""}
=======
                {bidMap[number] ? `₹${bidMap[number]}` : ""}
>>>>>>> 9cbca005a124c5fe173c878800d2fb34d112b328
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
<<<<<<< HEAD
      {/* Display Inside Numbers */}
      {/* <Box mt={4}>
        <Typography
          variant="h4"
          fontFamily={"Alegreya Sans SC, sans-serif"}
          fontWeight={500}
        >
          Andar
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))",
            gap: 2,
          }}
        >
          {insideOutsideRow?.map((number) => (
            <Box
              key={number}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px solid #ddd",
                cursor: "not-allowed",
                borderRadius: 1,
                boxShadow:
                  formik.values.insideBidNumber.number === number
                    ? "0px 4px 10px rgba(0, 0, 0, 1)"
                    : "none",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  paddingY: 1,
                  backgroundColor: bidDeclared
                    ? "gray"
                    : insideBidMap[number] === minInsideBidAmount
                    ? "#ffa500"
                    : formik.values.insideBidNumber.number === number
                    ? "green"
                    : "#6f6bb7",
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
                  backgroundColor: bidDeclared ? "#BEB8D1" : "#eceaf6", // Change background color if bid is declared
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderBottomLeftRadius: "4px",
                  borderBottomRightRadius: "4px",
                  color: "black",
                }}
              >
                <Typography variant="body2" fontWeight={"bold"}>
                  {insideBidMap
                    ? insideBidMap[number] !== undefined
                      ? `₹${insideBidMap[number]}`
                      : ""
                    : ""}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box> */}
      {/* Display Outside Numbers */}
      {/* <Box mt={4}>
        <Typography
          variant="h4"
          fontFamily={"Alegreya Sans SC, sans-serif"}
          fontWeight={500}
        >
          Bahar
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))",
            gap: 2,
          }}
        >
          {insideOutsideRow.map((number) => (
            <Box
              key={number}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px solid #ddd",
                cursor: "not-allowed",
                borderRadius: 1,
                boxShadow:
                  formik.values.outsideBidNumber.number === number
                    ? "0px 4px 10px rgba(0, 0, 0, 1)"
                    : "none",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  paddingY: 1,
                  backgroundColor: bidDeclared
                    ? "gray"
                    : outsideBidMap[number] === minOutsideBidAmount
                    ? "#ffa500"
                    : formik.values.outsideBidNumber.number === number
                    ? "green"
                    : "#6f6bb7",
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
                  backgroundColor: bidDeclared ? "#BEB8D1" : "#eceaf6", // Change background color if bid is declared
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderBottomLeftRadius: "4px",
                  borderBottomRightRadius: "4px",
                  color: "black",
                }}
              >
                <Typography variant="body2" fontWeight={"bold"}>
                  {outsideBidMap
                    ? outsideBidMap[number] !== undefined
                      ? outsideBidMap[number]
                      : ""
                    : ""}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box> */}
      {/* <Tooltip
        title={
          formik.values.bidNumber.number
            ? ""
            : bidDeclared
            ? ""
            : "Select bid number first"
        }
        placement="left-start"
      >
        <Button
          variant="contained"
          onClick={() => setOpenConfirmDialog(true)}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            backgroundColor:
              formik.values.bidNumber.number !== undefined &&
              formik.values.bidNumber.number !== null
                ? "#604586"
                : "#BEB8D1",
            color: "white",
            "&:hover": {
              backgroundColor:
                formik.values.bidNumber.number !== undefined &&
                formik.values.bidNumber.number !== null
                  ? "#4b356a"
                  : "#BEB8D1",
            },
            "&:disabled": {
              backgroundColor: "#BEB8D1",
              color: "#FFFFFF",
            },
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
            borderRadius: "8px",
            padding: "10px 20px",
            fontWeight: "bold",
          }}
          disabled={
            formik.values.bidNumber.number === undefined ||
            formik.values.bidNumber.number === null ||
            bidDeclared
          } // Updated condition to check for undefined or null
        >
          Declare Bid
        </Button>
      </Tooltip> */}
      {/* Confirmation Dialog */}
      {/* <Modal
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle sx={{ color: "#636b74" }}>
            <WarningRoundedIcon />
            Confirmation
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Typography variant="body1">
              Are you sure you want to declare the bid number{" "}
              <strong>{selectedBid?.number}</strong> with amount{" "}
              <strong>{selectedBid?.amount}</strong>?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="solid" color="danger" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="plain" color="neutral" onClick={handleConfirm}>
              Confirm
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal> */}
=======
>>>>>>> 9cbca005a124c5fe173c878800d2fb34d112b328
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
