import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import moment from "moment";
import CustomSnackbar from "../component/CustomSnackbar";
import { BASE_URL } from "../costants";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const theme = createTheme({
  palette: {
    primary: { main: "#5a508b" },
    secondary: { main: "#d32f2f" },
    success: { main: "#2e7d32" },
  },
  typography: { fontFamily: "Arial, sans-serif" },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          backgroundColor: "#f4f6f8",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#1976d2",
            fontSize: "1.1rem",
          },
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
            whiteSpace: "pre-line",
          },
        },
      },
    },
  },
});

const AddMoney = () => {
  // Left Table: Add Money Requests
  const [addMoneyRequests, setAddMoneyRequests] = useState([]);
  const [addMoneyPage, setAddMoneyPage] = useState(0);
  const [addMoneyLimit, setAddMoneyLimit] = useState(5);
  const [addMoneyTotal, setAddMoneyTotal] = useState(0);
  const [addMoneyLoading, setAddMoneyLoading] = useState(true);

  // Right Table: Approved/Rejected List
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [approvedPage, setApprovedPage] = useState(0);
  const [approvedLimit, setApprovedLimit] = useState(5);
  const [approvedTotal, setApprovedTotal] = useState(0);
  const [approvedLoading, setApprovedLoading] = useState(true);
  const [type, setType] = useState("Approved");
  const [gamesDate, setGamesDate] = useState(dayjs());

  // Dialog state
  const [open, setOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [values, setValues] = useState({ bankDetails: "" });

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Fetch Add Money Requests (left)
  useEffect(() => {
    fetchAddMoneyRequests();
  }, [addMoneyPage, addMoneyLimit]);

  // Fetch Approved/Rejected List (right)
  useEffect(() => {
    fetchApprovedRequests();
  }, [approvedPage, approvedLimit, type, gamesDate]);

  const fetchAddMoneyRequests = async () => {
    setAddMoneyLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/web/retrieve/add-money`,
        {
          params: { limit: addMoneyLimit, page: addMoneyPage },
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      setAddMoneyRequests(response.data.data.payment);
      setAddMoneyTotal(response.data.data.count);
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Error fetching requests");
      setSnackbarOpen(true);
    } finally {
      setAddMoneyLoading(false);
    }
  };

  const fetchApprovedRequests = async () => {
    setApprovedLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/web/retrieve/add-money`,
        {
          params: {
            limit: approvedLimit,
            page: approvedPage,
            type,
            date: gamesDate,
          },
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      setApprovedRequests(response.data.data.payment);
      setApprovedTotal(response.data.data.count);
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Error fetching approved requests");
      setSnackbarOpen(true);
    } finally {
      setApprovedLoading(false);
    }
  };

  const handleAction = async (action) => {
    try {
      await axios.post(`${BASE_URL}/api/web/create/add-money-action`, {
        requestId: selectedRequest.id,
        action,
        bankDetails: values.bankDetails,
      });
      setOpen(false);
      fetchAddMoneyRequests();
      fetchApprovedRequests();
      setSnackbarSeverity("success");
      setSnackbarMessage(`Request ${action}ed successfully`);
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage(`Failed to ${action} request`);
      setSnackbarOpen(true);
    }
  };

  const handleClickOpen = (request) => {
    setSelectedRequest(request);
    setValues((value) => ({
      ...value,
      bankDetails: request.accountDetails,
    }));
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // Columns for both tables
  const addMoneyColumns = [
    { field: "customerName", headerName: "Customer Name", width: 150 },
    { field: "mobile", headerName: "Mobile", width: 110 },
    { field: "amount", headerName: "Amount", width: 120 },
    {
      field: "amount_screenshot",
      headerName: "Screenshot",
      width: 200,
      renderCell: ({ value }) => (
        <img
          style={{ width: 100, height: 100, objectFit: "contain" }}
          src={value}
          alt="screenshot"
        />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) =>
        params.row.status === "Pending" ? (
          <Chip label="Pending" sx={{ background: "#d9512c", color: "white" }} />
        ) : (
          <Chip
            label={params.row.status}
            sx={{ background: "#2e7d32", color: "white" }}
          />
        ),
    },
    {
      field: "accountDetails",
      headerName: "Account details",
      width: 300,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line" }}>{params.value}</div>
      ),
    },
    { field: "createdAt", headerName: "Created At", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) =>
        params.row.status === "Pending" && (
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleClickOpen(params.row);
            }}
          >
            Approve
          </Button>
        ),
    },
  ];

  const approvedColumns = [
    { field: "customerName", headerName: "Customer Name", width: 150 },
    { field: "mobile", headerName: "Mobile", width: 110 },
    { field: "amount", headerName: "Amount", width: 120 },
    {
      field: "amount_screenshot",
      headerName: "Screenshot",
      width: 200,
      renderCell: ({ value }) => (
        <img
          style={{ width: 100, height: 100, objectFit: "contain" }}
          src={value}
          alt="screenshot"
        />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.row.status}
          sx={{
            background: params.row.status === "Approved" ? "green" : "#d9512c",
            color: "white",
          }}
        />
      ),
    },
    {
      field: "accountDetails",
      headerName: "Account details",
      width: 200,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line" }}>{params.value}</div>
      ),
    },
    { field: "createdAt", headerName: "Created At", width: 200 },
  ];

  // Map data for both tables
  const addMoneyRows = addMoneyRequests?.map((request) => {
    let accountDetails = "";
    if (request.accountDetails) {
      try {
        const parsedDetails = JSON.parse(request.accountDetails);
        accountDetails = `Account Holder Name: ${
          parsedDetails.accountHolderName || ""
        }\nAccount Number: ${parsedDetails.accountNumber || ""}\nIFSC Code: ${
          parsedDetails.ifscCode || ""
        }`;
      } catch (error) {
        accountDetails = "Invalid account details";
      }
    } else if (request.upiId) {
      accountDetails = `UPI ID: ${request.upiId}`;
    }
    return {
      id: request.id,
      customerName: request.Customer?.name || "N/A",
      mobile: request.Customer?.mobile || "N/A",
      amount: request.amount,
      amount_screenshot: `${BASE_URL}/img/payments/${request.screenshot}`,
      status: request.status,
      accountDetails: request.upi,
      createdAt: moment(request.createdAt).format("YYYY-MM-DD HH:mm:ss"),
    };
  });

  const approvedRows = approvedRequests?.map((request) => {
    let accountDetails = "";
    if (request.accountDetails) {
      try {
        const parsedDetails = JSON.parse(request.accountDetails);
        accountDetails = `Account Holder Name: ${
          parsedDetails.accountHolderName || ""
        }\nAccount Number: ${parsedDetails.accountNumber || ""}\nIFSC Code: ${
          parsedDetails.ifscCode || ""
        }`;
      } catch (error) {
        accountDetails = "Invalid account details";
      }
    } else if (request.upiId) {
      accountDetails = `UPI ID: ${request.upiId}`;
    }
    return {
      id: request.id,
      customerName: request.Customer?.name || "N/A",
      mobile: request.Customer?.mobile || "N/A",
      amount: request.amount,
      amount_screenshot: `${BASE_URL}/img/payments/${request.screenshot}`,
      status: request.status,
      accountDetails: request.upi,
      createdAt: moment(request.createdAt).format("YYYY-MM-DD HH:mm:ss"),
    };
  });

  return (
    <ThemeProvider theme={theme}>
      <Typography
        variant={"h4"}
        my={2}
        textAlign={"center"}
        fontWeight={"bold"}
      >
        Add Money
      </Typography>
      <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
        {/* Left: Add Money Requests (60%) */}
        <Box sx={{ width: "60%" }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Add Money Requests
          </Typography>
          <DataGrid
            rows={addMoneyRows}
            columns={addMoneyColumns}
            pagination
            paginationMode="server"
            rowCount={addMoneyTotal}
            page={addMoneyPage}
            pageSize={addMoneyLimit}
            onPageChange={(newPage) => setAddMoneyPage(newPage)}
            onPageSizeChange={(newPageSize) => {
              setAddMoneyLimit(newPageSize);
              setAddMoneyPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            loading={addMoneyLoading}
            autoHeight
            disableSelectionOnClick
            getRowHeight={() => "auto"}
          />
        </Box>
        {/* Right: Approved List (40%) */}
        <Box sx={{ width: "40%" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Approved/Rejected List
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <DatePicker
                slotProps={{
                  textField: { size: "small" },
                }}
                label="Date picker"
                value={gamesDate}
                onChange={(newDate) => setGamesDate(newDate)}
              />
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="type-select-label">Select</InputLabel>
                <Select
                  labelId="type-select-label"
                  id="type-select"
                  value={type}
                  label="Type"
                  onChange={(e) => setType(e.target.value)}
                >
                  <MenuItem value={"Approved"}>Approved</MenuItem>
                  <MenuItem value={"Rejected"}>Rejected</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          <DataGrid
            rows={approvedRows}
            columns={approvedColumns}
            pagination
            paginationMode="server"
            rowCount={approvedTotal}
            page={approvedPage}
            pageSize={approvedLimit}
            onPageChange={(newPage) => setApprovedPage(newPage)}
            onPageSizeChange={(newPageSize) => {
              setApprovedLimit(newPageSize);
              setApprovedPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            loading={approvedLoading}
            autoHeight
            disableSelectionOnClick
            getRowHeight={() => "auto"}
          />
        </Box>
      </Box>

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Approve Withdrawal Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please review the details before approving this request.
          </DialogContentText>
          <form>
            <div>
              <Typography
                variant="body1"
                style={{ whiteSpace: "pre-line", marginTop: "16px" }}
              >
                {values.bankDetails}
              </Typography>
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={() => handleAction("approve")} color="primary">
            Approve
          </Button>
          <Button onClick={() => handleAction("reject")} color="primary">
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
    </ThemeProvider>
  );
};

export default AddMoney;




