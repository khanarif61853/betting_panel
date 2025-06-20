import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, TextField, Typography, Chip, Stack } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import HistoryIcon from "@mui/icons-material/History";
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { usePagination } from "../hooks/usePagination";
import CustomSnackbar from "../component/CustomSnackbar";
import CustomerDialog from "../component/CustomerDialog";
import { BASE_URL } from "../costants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import TransactionModal from "../component/TransactionModal";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#d32f2f" },
    success: { main: "#2e7d32" },
    black: { main: "#e0e0e0" },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
});

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("bankDetails");
  const [selectedCustomerId, setSelectedCustomerId] = useState(0);
  const [search, setSearch] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("credit");
  const [customerId, setCustomerId] = useState(null);
  const { page, limit, total, changePage, changeLimit, changeTotal } =
    usePagination();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/web/retrieve/customers`,
        {
          params: { limit, page },
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setCustomers(response.data.data.customers);
      setFilteredCustomers(response.data.data.customers);
      changeTotal(response.data.data.count);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setSnackbarMessage("Failed to fetch customers");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (t, id) => {
    setType(t);
    setOpen(true);
    setCustomerId(id);
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, limit, open]);

  useEffect(() => {
    const filtered = customers.filter(
      (customer) =>
        customer.mobile.includes(search) &&
        customer.name.toLowerCase().includes(nameSearch.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [search, nameSearch, customers]);

  const handleOpenDialog = (type, customerId) => {
    setDialogType(type);
    setSelectedCustomerId(customerId);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogType("bankDetails");
    setSelectedCustomerId(null);
  };

  const handleStatusChange = async (customerId, currentStatus) => {
    try {
      // Toggle the status (true -> false, false -> true)
      const updatedStatus = !currentStatus;

      // Make an API call to update the customer's status
      await axios.put(
        `${BASE_URL}/api/web/status/customer`,
        {
          customerId,
          status: updatedStatus,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      setSnackbarMessage("Status updated successfully");
      // Update the local state to reflect the new status
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.id === customerId
            ? { ...customer, status: updatedStatus }
            : customer
        )
      );

      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Error updating status:", error);
      setSnackbarMessage("Failed to update status");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "mobile",
      headerName: "Mobile",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="text"
          color="primary"
          onClick={() => handleOpenDialog("viewDetails", params.row.id)}
        >
          {params.value}
        </Button>
      ),
    },
    {
      field: "referralCode",
      headerName: "Referral Code",
      flex: 1,
    },
    { field: "walletAmount", headerName: "Wallet Amount", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color={params.row.status ? "success" : "error"}
          size="small"
          onClick={() => handleStatusChange(params.row.id, params.row.status)}
        >
          {params.row.status ? "Active" : "Banned"}
        </Button>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 2,
      minWidth: 480,
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={0.5}
          flexWrap="wrap"
          gap={0.5}
          sx={{
            py: 1,
            width: "100%",
            justifyContent: "flex-start",
          }}
        >
          <Chip
            label="Games"
            size="small"
            color="primary"
            icon={<AccountBoxIcon />}
            onClick={() =>
              handleOpenDialog("fetchCustomerDetails", params.row.id)
            }
            sx={{ cursor: "pointer" }}
          />
          <Chip
            label="Wallet"
            size="small"
            color="secondary"
            icon={<AccountBalanceWalletIcon />}
            onClick={() => handleOpenDialog("walletStatement", params.row.id)}
            sx={{ cursor: "pointer" }}
          />
          <Chip
            label="Credit"
            size="small"
            color="success"
            icon={<CurrencyRupeeIcon />}
            onClick={() => openModal("credit", params.row.id)}
            sx={{ cursor: "pointer" }}
          />
          <Chip
            label="Debit"
            size="small"
            color="secondary"
            icon={<DoDisturbOnIcon />}
            onClick={() => openModal("debit", params.row.id)}
            sx={{ cursor: "pointer" }}
          />

          <Chip
            label="Commission"
            size="small"
            color="warning"
            icon={<HistoryIcon />}
            onClick={() => handleOpenDialog("commission", params.row.id)}
            sx={{ cursor: "pointer" }}
          />
        </Stack>
      ),
    },
  ];

  const rows = filteredCustomers.map((customer) => ({
    id: customer.id,
    name: customer.name,
    mobile: customer.mobile,
    referralCode: customer.referralCode,
    walletAmount: parseFloat(customer.totalWalletAmount).toFixed(2),
    status: customer.status,
  }));

  return (
    <ThemeProvider theme={theme}>
      <Box p={2}>
        <Typography variant="h4" my={2} textAlign="center" fontWeight="bold">
          All Players
        </Typography>
        <ArrowBackIcon
          style={{ cursor: "pointer", marginBottom: 16 }}
          onClick={() => navigate("/home")}
        />
        <Box
          display="flex"
          alignItems="center"
          mb={2}
          flexWrap="wrap"
          gap={2}
          ml={1}
        >
          <TextField
            label="Search by Mobile Number"
            variant="outlined"
            type="number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <TextField
            label="Search by Name"
            variant="outlined"
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
          />
          {/* <Button variant="contained" color="primary" onClick={fetchCustomers}>
                        Search
                    </Button> */}
        </Box>
        <Box style={{ height: 450, width: "100%", overflow: "auto" }} p={2}>
          <DataGrid
            rows={rows}
            columns={columns}
            paginationMode="server"
            rowCount={total}
            pageSize={limit}
            onPaginationModelChange={(model) => {
              changePage(model.page);
              changeLimit(model.pageSize);
            }}
            loading={loading}
            checkboxSelection
            disableSelectionOnClick
            disableRowSelectionOnClick
          />
        </Box>
      </Box>
      <CustomSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
      <CustomerDialog
        type={dialogType || "bankDetails"}
        customerId={selectedCustomerId}
        open={dialogOpen}
        onClose={handleCloseDialog}
      />
      <TransactionModal
        setSnackbarSeverity={setSnackbarSeverity}
        setSnackbarMessage={setSnackbarMessage}
        setSnackbarOpen={setSnackbarOpen}
        open={open}
        handleClose={() => setOpen(false)}
        type={type}
        id={customerId}
      />
    </ThemeProvider>
  );
};

export default Customer;
