import { useEffect, useState } from "react";
import { Box, Typography, Grid, Select, MenuItem } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { BASE_URL } from "../costants";
import { useFormik } from "formik";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Modal from "@mui/joy/Modal";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ModalDialog from "@mui/joy/ModalDialog";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import CustomSnackbar from "../component/CustomSnackbar";

const Game = () => {
  const navigate = useNavigate();
  const [bids, setBids] = useState([]);
  const [insideNumbers, setInsideNumbers] = useState([]);
  const [outsideNumbers, setOutsideNumbers] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [resultDate] = useState(new Date());
  const [bidDeclared, setBidDeclared] = useState(false);
  const [savedBid, setSavedBid] = useState(null);
  const [collectedAmount, setCollectedAmount] = useState();
  const [games, setGames] = useState([]);

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };
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
          params: { id: searchParams.get("id") },
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

          setBids(bids);
          response?.data?.data?.prevGame?.id
            ? setSearchParams({
              id: response?.data?.data?.prevGame?.id,
              name: response?.data?.data?.prevGame?.name,
            })
            : null;
          response?.data?.data?.prevGame?.finalBidNumber
            ? setBidDeclared(response?.data?.data?.prevGame?.finalBidNumber)
            : setBidDeclared(false);
          const parsedInside = JSON.parse(inside || "[]");
          const parsedOutside = JSON.parse(outside || "[]");
          setInsideNumbers(parsedInside);
          setOutsideNumbers(parsedOutside);

          // Calculate Top 10 Max and Min Bids (multiply by 90)
          bids = Array.isArray(bids) ? bids : [];
          const sortedBids = [...bids]?.sort((a, b) => b.amount - a.amount);
          const topMax = sortedBids.slice(0, 10).map((bid) => ({
            ...bid,
            amountMultiplied: bid.amount * 90,
          }));

          const sortedMinBids = [...bids]?.sort((a, b) => a.amount - b.amount);
          const topMin = sortedMinBids.slice(0, 10).map((bid) => ({
            ...bid,
            amountMultiplied: bid.amount * 90,
          }));

          setTopMaxBids(topMax);
          setTopMinBids(topMin);
        }
      } catch (error) {
        console.error("Error fetching bids:", error);
        setBids([]);
        setInsideNumbers([]);
        setOutsideNumbers([]);
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

  const bidMap = (bids || []).reduce((acc, bid) => {
    const key = bid.number === 0 ? "00" : bid.number;
    acc[key] = bid.amount;
    return acc;
  }, {});

  const minInsideBidAmount =
    insideNumbers?.length > 0
      ? Math.min(...insideNumbers.map((bid) => bid.amount))
      : 0;
  const minOutsideBidAmount =
    outsideNumbers?.length > 0
      ? Math.min(...outsideNumbers.map((bid) => bid.amount))
      : 0;

  const insideOutsideRow = Array.from({ length: 10 }, (_, i) => i);
  const insideBidMap = insideNumbers?.reduce((acc, bid) => {
    acc[parseInt(bid.number, 10)] = bid.amount;
    return acc;
  }, {});
  const outsideBidMap = outsideNumbers?.reduce((acc, bid) => {
    acc[parseInt(bid.number, 10)] = bid.amount;
    return acc;
  }, {});

  const formik = useFormik({
    initialValues: {
      bidNumber: {},
      insideBidNumber: {},
      outsideBidNumber: {},
    },
    onSubmit: () => {
      // no-op
    },
  });

  const handleBidNumberClick = (number) => {
    if (bidDeclared) return;

    let insideBidNumber = { number: 0, amount: 0 };
    let outsideBidNumber = { number, amount: bidMap[number] || 0 };

    if (number < 10) {
      insideBidNumber = { number: 0, amount: insideBidMap[0] || 0 };
      outsideBidNumber = { number, amount: bidMap[number] || 0 };
    } else {
      const numberStr = number.toString();
      const insideNumber = parseInt(numberStr[0], 10);
      const outsideNumber = parseInt(numberStr[numberStr.length - 1], 10);

      insideBidNumber = {
        number: insideNumber,
        amount: insideBidMap[insideNumber] || 0,
      };
      outsideBidNumber = {
        number: outsideNumber,
        amount: outsideBidMap[outsideNumber] || 0,
      };
    }

    formik.setFieldValue("bidNumber", { number, amount: bidMap[number] || 0 });
    formik.setFieldValue("insideBidNumber", insideBidNumber);
    formik.setFieldValue("outsideBidNumber", outsideBidNumber);

    setSelectedBid({ number, amount: bidMap[number] || 0 });
  };

  const handleConfirm = async () => {
    try {
      const apiBidNumber =
        formik.values.bidNumber.number === "00"
          ? 0
          : formik.values.bidNumber.number;
      const response = await axios.put(
        `${BASE_URL}/api/web/update/gameResult`,
        {
          bidNumber: apiBidNumber,
          bidAmount: formik.values.bidNumber.amount,
        },
        {
          params: { id: searchParams.get("id"), gameName: games },
          headers: {
            Authorization: localStorage.getItem("token"),
            "ngrok-skip-browser-warning": true,
          },
        }
      );
      if (response.data.type == "error") {
        setError(response.data.message);
      } else {
        setBidDeclared(response.data.data.finalBidNumber);
        setSuccess("Bid declared successfully");
        localStorage.removeItem("savedBid");
      }
      // Close the dialog and reset form or handle success
      setOpenConfirmDialog(false);
      formik.resetForm();
    } catch (error) {
      console.error("Error declaring bid:", error);
    }
  };

  const handleCancel = () => {
    setOpenConfirmDialog(false);
  };

  useEffect(() => {
    const saved = localStorage.getItem("savedBid");
    if (saved) {
      const parsedBid = JSON.parse(saved);
      setSavedBid(parsedBid);
      setSelectedBid(parsedBid);
      formik.setFieldValue("bidNumber", parsedBid);
    }
  }, []);

  const handleSaveBid = () => {
    if (selectedBid) {
      localStorage.setItem("savedBid", JSON.stringify(selectedBid));
      setSavedBid(selectedBid);
      setSuccess("Bid saved successfully");
    }
  };

  const handleEditSavedBid = () => {
    localStorage.removeItem("savedBid");
    setSavedBid(null);
    setSuccess("You can now select a new bid");
  };

  const displayTopMaxBids = topMaxBids.map((bid) => ({
    ...bid,
    number: bid.number === 0 ? "00" : bid.number,
  }));
  const displayTopMinBids = topMinBids.map((bid) => ({
    ...bid,
    number: bid.number === 0 ? "00" : bid.number,
  }));

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

  return (
    <Box padding={1}>
      <ArrowBackIcon
        style={{ cursor: "pointer" }}
        onClick={() => {
          navigate("/games");
        }}
      />

      <Grid
        container
        alignItems={"center"}
        // spacing={2}
        justifyContent={"space-between"}
      >
        <Grid item>
          <Box mt={2}>
            <Typography
              variant="h6"
              fontFamily={"Alegreya Sans SC, sans-serif"}
              fontWeight={500}
            >
              Name: {searchParams.get("name")}
            </Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box mt={2} display={"flex"}>
            <Typography
              variant="h6"
              fontFamily={"Alegreya Sans SC, sans-serif"}
              fontWeight={500}
            >
              Total collection:{" "}
              <span style={{ color: "#28a745" }}>
                {collectedAmount ? "+" + -collectedAmount : 0}
              </span>
            </Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box mt={2}>
            <Typography
              fontFamily={"Alegreya Sans SC, sans-serif"}
              fontWeight={500}
            >
              Top 10 Maximum Bid Amount
            </Typography>
            <Select sx={{ mt: 1, minWidth: 150, height: 32, fontSize: 12, '.MuiSelect-select': { padding: '4px 8px', fontSize: 12 }}} displayEmpty defaultValue="">
              <MenuItem value="" disabled>
                Select a maximum bid
              </MenuItem>
              {displayTopMaxBids.map((bid) => (
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
              fontFamily={"Alegreya Sans SC, sans-serif"}
              fontWeight={500}
            >
              Top 10 Minimum Bid Amounts
            </Typography>
            <Select sx={{ mt: 1, minWidth: 150, height: 32, fontSize: 12, '.MuiSelect-select': { padding: '4px 8px', fontSize: 12 }}} displayEmpty defaultValue="" >
              <MenuItem value="" disabled>
                Select a minimum bid
              </MenuItem>
              {displayTopMinBids.map((bid) => (
                <MenuItem key={bid.number} value={bid.number}>
                  {`Bid Number: ${bid.number}, Amount: ₹${bid.amount}, Multiplied Amount: ₹${bid.amountMultiplied}`}
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
          fontFamily={"Alegreya Sans SC, sans-serif"}
          fontWeight={500}
        >
          Bid Numbers {savedBid && `(Saved: ${savedBid.number})`}
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          {/* Show total bid amount here */}
          <Typography
            fontFamily={"Alegreya Sans SC, sans-serif"}
            fontWeight={700}
            color="#604586"
            sx={{ fontSize: { xs: 15, sm: 18 } }}
          >
            Total: ₹{Object.values(bidMap).reduce((acc, val) => acc + (Number(val) || 0), 0)}
          </Typography>
          {savedBid && (
            <Typography
              fontFamily={"Alegreya Sans SC, sans-serif"}
              backgroundColor="#4CAF50"
              borderRadius={"10px"}
              color={"white"}
              p={1}
              fontWeight={500}
            >
              Saved: {savedBid.number}
            </Typography>
          )}
          {bidDeclared && (
            <Typography
              variant="h5"
              fontFamily={"Alegreya Sans SC, sans-serif"}
              backgroundColor="red"
              borderRadius={"10px"}
              color={"white"}
              p={1}
              fontWeight={500}
            >
              {bidDeclared}
            </Typography>
          )}
        </Box>
      </Box>
      {/* bid Numbers */}
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
                        onClick={() => handleBidNumberClick(numberStr)}
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
                          cursor: bidDeclared ? "not-allowed" : "pointer",
                          transition: "background 0.2s",
                          "&:hover": {
                            background: "#f0e9f7",
                          },
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
      {/* Display Inside Numbers */}
      <Box mt={1}>
        <Typography
          fontFamily={"Alegreya Sans SC, sans-serif"}
          fontWeight={500}
        >
          Andar
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(10, 1fr)",
            width: "100%",
            gap: { xs: 0.5, sm: 1 },
            overflowX: "auto",
          }}
        >
          {insideOutsideRow?.map((number) => (
            <Box
              key={number}
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid lightgray",
                cursor: "not-allowed",
                minWidth: { xs: 28, sm: 38 },
                minHeight: { xs: 24, sm: 32 },
              }}
            >
              <Box
                sx={{
                  padding: { xs: 0.1, sm: 0.2, md: 0.2, lg: 0.5 },
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
                  fontSize: { xs: 8, sm: 10 },
                }}
              >
                <Typography
                  variant="body2"
                  fontSize={{ xs: 8, sm: 10 }}
                >
                  {number}
                </Typography>
              </Box>
              <Box>
                <Box
                  sx={{
                    padding: { xs: 0.1, sm: 0.2, md: 0.2, lg: 0.5 },
                    width: "100%",
                    display: "flex",
                    color: "black",
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={"bold"}
                    fontSize={{ xs: 8, sm: 10 }}
                    sx={{ flexGrow: 1, textAlign: "center" }}
                  >
                    {insideBidMap
                      ? insideBidMap[number] !== undefined
                        ? `₹${insideBidMap[number]}`
                        : ""
                      : ""}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      {/* Display Outside Numbers */}
      <Box mt={1}>
        <Typography
          fontFamily={"Alegreya Sans SC, sans-serif"}
          fontWeight={500}
        >
          Bahar
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(10, 1fr)",
            width: "100%",
            gap: { xs: 0.5, sm: 1 },
            overflowX: "auto",
          }}
        >
          {insideOutsideRow.map((number) => (
            <Box
              key={number}
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid lightgray",
                cursor: "not-allowed",
                minWidth: { xs: 28, sm: 38 },
                minHeight: { xs: 24, sm: 32 },
              }}
            >
              <Box
                sx={{
                  padding: { xs: 0.1, sm: 0.2, md: 0.2, lg: 0.5 },
                  backgroundColor: bidDeclared
                    ? "gray"
                    : formik.values.bidNumber.number === "00" && number === 0
                    ? "green"
                    : outsideBidMap[number] === minOutsideBidAmount
                    ? "#ffa500"
                    : formik.values.outsideBidNumber.number === number
                    ? "green"
                    : "#6f6bb7",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  fontSize: { xs: 8, sm: 10 },
                }}
              >
                <Typography
                  variant="body2"
                  fontSize={{ xs: 8, sm: 10 }}
                >
                  {number}
                </Typography>
              </Box>
              <Box>
                <Box
                  sx={{
                    width: "100%",
                    padding: { xs: 0.1, sm: 0.2, md: 0.2, lg: 0.5 },
                    display: "flex",
                    color: "black",
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={"bold"}
                    fontSize={{ xs: 8, sm: 10 }}
                    sx={{ flexGrow: 1, textAlign: "center" }}
                  >
                    {outsideBidMap
                      ? outsideBidMap[number] !== undefined
                        ? outsideBidMap[number]
                        : ""
                      : ""}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          display: "flex",
          gap: 2,
        }}
      >
        {!savedBid ? (
          <Button
            variant="contained"
            onClick={handleSaveBid}
            sx={{
              backgroundColor:
                formik.values.bidNumber.number !== undefined
                  ? "#4CAF50"
                  : "#BEB8D1",
              color: "white",
              "&:hover": {
                backgroundColor:
                  formik.values.bidNumber.number !== undefined
                    ? "#45a049"
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
            disabled={!formik.values.bidNumber.number || bidDeclared}
          >
            Save Bid
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleEditSavedBid}
            sx={{
              backgroundColor: "#FF9800",
              color: "white",
              "&:hover": {
                backgroundColor: "#F57C00",
              },
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
              borderRadius: "8px",
              padding: "10px 20px",
              fontWeight: "bold",
            }}
            disabled={Boolean(bidDeclared)}
          >
            Edit Bid
          </Button>
        )}

        <Button
          variant="contained"
          onClick={() => setOpenConfirmDialog(true)}
          sx={{
            backgroundColor: savedBid ? "#604586" : "#BEB8D1",
            color: "white",
            "&:hover": {
              backgroundColor: savedBid ? "#4b356a" : "#BEB8D1",
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
          disabled={!savedBid || bidDeclared}
        >
          Declare Bid
        </Button>
      </Box>

      {/* Confirmation Dialog */}
      <Modal
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
      </Modal>

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

export default Game;
