import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { usePagination } from "../hooks/usePagination";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import moment from "moment";
import CustomSnackbar from "../component/CustomSnackbar";
import { BASE_URL } from "../costants";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const theme = createTheme({
  palette: {
    primary: {
      main: "#5a508b",
    },
    secondary: {
      main: "#d32f2f",
    },
    success: {
      main: "#2e7d32",
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
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

const AddMoneyApprovedList = () => {
  const [requests, setRequests] = useState([]);
  const [type, setType] = useState("Approved");
  const [gamesDate, setGamesDate] = useState(dayjs());
  const [loading, setLoading] = useState(true);
  const { page, limit, total, changePage, changeLimit, changeTotal } =
    usePagination();

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    fetchRequests();
  }, [page, limit, type, gamesDate]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/web/retrieve/add-money`,
        {
          params: { limit, page, type, date: gamesDate },
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setRequests(response.data.data.payment);
      changeTotal(response.data.data.count);
      setSnackbarSeverity("success");
      setSnackbarMessage(`Retrieved successfully`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Error fetching requests");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setType(event.target.value);
  };
  const handleDateChange = (newDate) => {
    setGamesDate(newDate);
  };

  const columns = [
    { field: "customerName", headerName: "Customer Name", width: 150 },
    { field: "mobile", headerName: "Mobile", width: 110 },
    { field: "amount", headerName: "Amount", width: 120 },
    {
      field: "amount_screenshot",
      headerName: "Screenshot",
      width: 200,
      renderCell: ({ value }) => {
        return (
          <img
            style={{
              width: 100,
              height: 100,
              objectFit: "contain",
            }}
            src={value}
          />
        );
      },
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

  const rows = requests?.map((request) => {
    // console.log(first)
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
        console.error("Error parsing account details:", error);
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
      // accountDetails,
      accountDetails: request.upi,
      createdAt: moment(request.createdAt).format("YYYY-MM-DD HH:mm:ss"),
    };
  });

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h5"
          align="center"
          color="black"
          sx={{
            fontWeight: 700,
            // flexGrow: 1,
            textAlign: "center",
          }}
        >
          Add Money List
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              slotProps={{
                textField: { size: "small" },
              }}
              label="Date picker"
              value={gamesDate}
              onChange={handleDateChange}
            />
          </DemoContainer>
          <FormControl
            sx={{
              minWidth: 160,
              // ml:1
            }}
          >
            <InputLabel id="demo-simple-select-label">Select</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={type}
              label="Type"
              onChange={handleChange}
            >
              <MenuItem value={"Approved"}>Approved</MenuItem>
              <MenuItem value={"Rejected"}>Rejected</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box style={{ height: 450, width: "100%" }} p={2}>
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
          checkboxSelection
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

      {/* Render Snackbar */}
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
    </ThemeProvider>
  );
};

export default AddMoneyApprovedList;
