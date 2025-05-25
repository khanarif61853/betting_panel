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
} from "@mui/material";
import { usePagination } from "../hooks/usePagination";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import moment from "moment";
import CustomSnackbar from "../component/CustomSnackbar"; // Import the Snackbar component
import { BASE_URL } from "../costants";

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
            whiteSpace: "pre-line", // Maintain line breaks in text
          },
        },
      },
    },
  },
});

const AddMoney = () => {
  const [requests, setRequests] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState({ bankDetails: "" });
  const [errors, setErrors] = useState({});
  const { page, limit, total, changePage, changeLimit, changeTotal } =
    usePagination();

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    fetchRequests();
  }, [page, limit]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/web/retrieve/add-money`,
        {
          params: { limit, page },
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      console.log(response.data.data);
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

  const handleAction = async (action) => {
    try {
      await axios.post(`${BASE_URL}/api/web/create/add-money-action`, {
        requestId: selectedRequest.id,
        action,
        bankDetails: values.bankDetails,
      });
      setOpen(false);
      fetchRequests();

      // Show Snackbar
      setSnackbarSeverity("success");
      setSnackbarMessage(`Request ${action}ed successfully`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error(`Error ${action} request:`, error);

      // Show Snackbar
      setSnackbarSeverity("error");
      setSnackbarMessage(`Failed to ${action} request`);
      setSnackbarOpen(true);
    }
  };

  const handleClickOpen = (request) => {
    setSelectedRequest(request);
    console.log(selectedRequest);
    setValues((value) => {
      return { ...value, bankDetails: request.accountDetails };
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleBlur = () => {
    const newErrors = {};
    if (!values.bankDetails) {
      newErrors.bankDetails = "Required";
    }
    setErrors(newErrors);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleBlur(); // Validate fields
    if (Object.keys(errors).length === 0) {
      handleAction("approve");
    }
  };

  const columns = [
    { field: "customerName", headerName: "Customer Name", width: 150 },
    { field: "mobile", headerName: "Mobile", width: 110 },
    { field: "amount", headerName: "Amount", width: 120 },
    {
      field: "amount_screenshot",
      headerName: "Screenshot",
      width: 200,
      renderCell: ({value}) => {
        return(
        <img
        style={{
          width:100,
          height:100,
          objectFit:'contain'
        }}
        src={value}
        />
      )},
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) =>
        params.row.status === "Pending" && (
          <Chip
            label="Pending"
            sx={{ background: "#d9512c", color: "white" }}
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

  const rows = requests?.map((request) => {
    console.log(request.screenshot,'re------')
    console.log(`${BASE_URL}/img/payments/${request.screenshot}`)
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
      customerName: request.Customer?.name || 'N/A',
      mobile: request.Customer?.mobile || 'N/A',
      amount: request.amount,
      amount_screenshot:`${BASE_URL}/img/payments/${request.screenshot}`,
      status: request.status,
      // accountDetails,
      accountDetails:request.upi,
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

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Approve Withdrawal Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please review the details before approving this request.
          </DialogContentText>
          <form onSubmit={handleSubmit}>
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

export default AddMoney;

