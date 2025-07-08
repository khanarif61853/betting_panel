import React, { useEffect, useState } from "react";
import axios from "axios";
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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputBase,
  IconButton,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";
import CustomSnackbar from "../component/CustomSnackbar"; 
import { BASE_URL } from "../costants";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

const AddMoney = () => {
  // Left: Add Money Requests
  const [addMoneyRequests, setAddMoneyRequests] = useState([]);
  const [addMoneyPage, setAddMoneyPage] = useState(0);
  const [addMoneyRowsPerPage, setAddMoneyRowsPerPage] = useState(5);
  const [addMoneyLoading, setAddMoneyLoading] = useState(true);
  const [addMoneySearch, setAddMoneySearch] = useState("");
  const [softDeletedIds, setSoftDeletedIds] = useState([]);

  // Right: Approved/Rejected List
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [approvedPage, setApprovedPage] = useState(0);
  const [approvedRowsPerPage, setApprovedRowsPerPage] = useState(5);
  const [approvedTotal, setApprovedTotal] = useState(0);
  const [approvedLoading, setApprovedLoading] = useState(true);
  const [type, setType] = useState("Approved");
  const [gamesDate, setGamesDate] = useState(dayjs());
  const [softDeletedApprovedIds, setSoftDeletedApprovedIds] = useState([]);

  // Dialog state
  const [open, setOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [values, setValues] = useState({ bankDetails: "" });
  const [dialogAction, setDialogAction] = useState(""); // "approve" or "reject"

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Fetch Add Money Requests (left)
  useEffect(() => {
    fetchAddMoneyRequests();
  }, []);

  // Fetch Approved/Rejected List (right)
  useEffect(() => {
    fetchApprovedRequests();
  }, [approvedPage, approvedRowsPerPage, type, gamesDate]);

  // Fetch Add Money Requests
  const fetchAddMoneyRequests = async () => {
    setAddMoneyLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/web/retrieve/add-money`,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      setAddMoneyRequests(response.data.data.payment);
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Error fetching requests");
      setSnackbarOpen(true);
    } finally {
      setAddMoneyLoading(false);
    }
  };

  // Fetch Approved/Rejected List
  const fetchApprovedRequests = async () => {
    setApprovedLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/web/retrieve/add-money`,
        {
          params: {
            limit: approvedRowsPerPage,
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

  // Soft delete handler (left)
  const handleSoftDelete = (id) => {
    setSoftDeletedIds((prev) => [...prev, id]);
    setSnackbarSeverity("info");
    setSnackbarMessage("Request soft deleted (not removed from DB)");
    setSnackbarOpen(true);
  };

  // Soft delete handler (right)
  const handleSoftDeleteApproved = (id) => {
    setSoftDeletedApprovedIds((prev) => [...prev, id]);
    setSnackbarSeverity("info");
    setSnackbarMessage("Transaction soft deleted (not removed from DB)");
    setSnackbarOpen(true);
  };

  // Approve/Reject dialog
  const handleAction = async () => {
    try {
      await axios.post(`${BASE_URL}/api/web/create/add-money-action`, {
        requestId: selectedRequest.id,
        action: dialogAction,
        bankDetails: values.bankDetails,
      });
      setOpen(false);
      fetchAddMoneyRequests();
      fetchApprovedRequests();
      setSnackbarSeverity("success");
      setSnackbarMessage(`Request ${dialogAction}ed successfully`);
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage(`Failed to ${dialogAction} request`);
      setSnackbarOpen(true);
    }
  };

  const handleClickOpen = (request, action) => {
    setSelectedRequest(request);
    setDialogAction(action);
    setValues((value) => ({
      ...value,
      bankDetails: request.accountDetails,
    }));
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // Filter and paginate left table
  const filteredAddMoneyRequests = addMoneyRequests
    .filter(
      (req) =>
        !softDeletedIds.includes(req.id) &&
        (req.Customer?.name || "")
          .toLowerCase()
          .includes(addMoneySearch.trim().toLowerCase())
    );
  const paginatedAddMoneyRequests = filteredAddMoneyRequests.slice(
    addMoneyPage * addMoneyRowsPerPage,
    addMoneyPage * addMoneyRowsPerPage + addMoneyRowsPerPage
  );

  // Map for left table
  const addMoneyRows = paginatedAddMoneyRequests.map((request) => {
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
      ...request,
      customerName: request.Customer?.name || "N/A",
      mobile: request.Customer?.mobile || "N/A",
      amount_screenshot: `${BASE_URL}/img/payments/${request.screenshot}`,
      accountDetails,
      createdAt: moment(request.createdAt).format("YYYY-MM-DD HH:mm:ss"),
    };
  });

  // Map for right table
  const approvedRows = approvedRequests
    .filter((req) => !softDeletedApprovedIds.includes(req.id))
    .map((request) => ({
      ...request,
      customerName: request.Customer?.name || "N/A",
      mobile: request.Customer?.mobile || "N/A",
      createdAt: moment(request.createdAt).format("YYYY-MM-DD HH:mm:ss"),
    }));

  // Pagination handlers
  const handleAddMoneyPageChange = (event, newPage) => setAddMoneyPage(newPage);
  const handleAddMoneyRowsPerPageChange = (event) => {
    setAddMoneyRowsPerPage(parseInt(event.target.value, 10));
    setAddMoneyPage(0);
  };
  const handleApprovedPageChange = (event, newPage) => setApprovedPage(newPage);
  const handleApprovedRowsPerPageChange = (event) => {
    setApprovedRowsPerPage(parseInt(event.target.value, 10));
    setApprovedPage(0);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: 2,
        width: "100%",
        height: isMobile ? "auto" : 500,
        mt: 2,
        px: 2,
        background: "#fff",
      }}
    >
      {/* Left: Add Money Requests */}
      <Box
        sx={{
          width: isMobile ? "100%" : "60%",
          minWidth: 200,
          height: 550,
          display: "flex",
          flexDirection: "column",
          p: 2,
          background: "#fff",
          borderRadius: 2,
          boxShadow: 2,
          mb: isMobile ? 2 : 0, // add margin between stacked tables
        }}
      >
        {/* Search Bar */}
        <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
          <InputBase
            placeholder="Search User"
            value={addMoneySearch}
            onChange={(e) => setAddMoneySearch(e.target.value)}
            sx={{
              width: "100%",
              bgcolor: "#f5f5f5",
              borderRadius: 2,
              px: 2,
              py: 1,
              fontSize: 15,
            }}
          />
          <SearchIcon sx={{ ml: -4, color: "#888" }} />
        </Box>
        {/* Table */}
        <Typography variant="h6" fontWeight="bold" mb={1}>
        Add Money
      </Typography>
        <TableContainer sx={{ flex: 1, maxHeight: 340 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Screenshot</TableCell>
                <TableCell>Account Details</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Time</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {addMoneyRows.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.customerName}</TableCell>
                  <TableCell>{row.mobile}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>
                    <img
                      src={row.amount_screenshot}
                      alt="screenshot"
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: "contain",
                        borderRadius: 6,
                        border: "1px solid #eee",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: "pre-line",
                        fontSize: 13,
                        color: "#444",
                      }}
                    >
                      {row.accountDetails}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      sx={{
                        background:
                          row.status === "Pending"
                            ? "#d9512c"
                            : row.status === "Approved"
                            ? "green"
                            : "#888",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    />
                  </TableCell>
                  <TableCell>{row.createdAt}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                      {row.status === "Pending" && (
                        <>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleClickOpen(row, "approve")}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            onClick={() => handleClickOpen(row, "reject")}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      <Tooltip title="Soft Delete">
                        <IconButton
                          color="error"
                          onClick={() => handleSoftDelete(row.id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {addMoneyRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No data found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Pagination */}
        <Box sx={{ mt: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Typography sx={{ mr: 2, fontSize: 14 }}>
              Rows per page:
            </Typography>
            <Select
              value={addMoneyRowsPerPage}
              onChange={handleAddMoneyRowsPerPageChange}
              size="small"
              sx={{ width: 70, mr: 2 }}
            >
              {ROWS_PER_PAGE_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
            <Typography sx={{ fontSize: 14 }}>
              {addMoneyPage * addMoneyRowsPerPage + 1}-
              {Math.min(
                (addMoneyPage + 1) * addMoneyRowsPerPage,
                filteredAddMoneyRequests.length
              )}{" "}
              of {filteredAddMoneyRequests.length}
            </Typography>
            <IconButton
              onClick={(e) =>
                handleAddMoneyPageChange(e, Math.max(addMoneyPage - 1, 0))
              }
              disabled={addMoneyPage === 0}
              size="small"
            >
              {"<"}
            </IconButton>
            <IconButton
              onClick={(e) =>
                handleAddMoneyPageChange(
                  e,
                  addMoneyPage + 1 <
                    Math.ceil(filteredAddMoneyRequests.length / addMoneyRowsPerPage)
                    ? addMoneyPage + 1
                    : addMoneyPage
                )
              }
              disabled={
                addMoneyPage + 1 >=
                Math.ceil(filteredAddMoneyRequests.length / addMoneyRowsPerPage)
              }
              size="small"
            >
              {">"}
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Right: Approved/Rejected List */}
      <Box
        sx={{
          width: isMobile ? "100%" : "40%",
          minWidth: 200,
          height: 550,
          display: "flex",
          flexDirection: "column",
          p: 2,
          background: "#fff",
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
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
            Recent Transaction
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
        <TableContainer sx={{ flex: 1, maxHeight: 340 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Time</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {approvedRows.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.customerName}</TableCell>
                  <TableCell>{row.mobile}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      sx={{
                        background:
                          row.status === "Approved"
                            ? "green"
                            : row.status === "Rejected"
                            ? "#d9512c"
                            : "#888",
                        color: "white",
                      }}
                    />
                  </TableCell>
                  <TableCell>{row.createdAt}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Soft Delete">
                      <IconButton
                        color="error"
                        onClick={() => handleSoftDeleteApproved(row.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {approvedRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No data found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Pagination */}
        <Box sx={{ mt: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Typography sx={{ mr: 2, fontSize: 14 }}>
              Rows per page:
            </Typography>
            <Select
              value={approvedRowsPerPage}
              onChange={handleApprovedRowsPerPageChange}
              size="small"
              sx={{ width: 70, mr: 2 }}
            >
              {ROWS_PER_PAGE_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
            <Typography sx={{ fontSize: 14 }}>
              {approvedPage * approvedRowsPerPage + 1}-
              {Math.min(
                (approvedPage + 1) * approvedRowsPerPage,
                approvedTotal
              )}{" "}
              of {approvedTotal}
            </Typography>
            <IconButton
              onClick={(e) =>
                handleApprovedPageChange(e, Math.max(approvedPage - 1, 0))
              }
              disabled={approvedPage === 0}
              size="small"
            >
              {"<"}
            </IconButton>
            <IconButton
              onClick={(e) =>
                handleApprovedPageChange(
                  e,
                  approvedPage + 1 <
                    Math.ceil(approvedTotal / approvedRowsPerPage)
                    ? approvedPage + 1
                    : approvedPage
                )
              }
              disabled={
                approvedPage + 1 >=
                Math.ceil(approvedTotal / approvedRowsPerPage)
              }
              size="small"
            >
              {">"}
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {dialogAction === "approve"
            ? "Approve Withdrawal Request"
            : "Reject Withdrawal Request"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please review the details before {dialogAction}ing this request.
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
          <Button onClick={handleAction} color="primary">
            {dialogAction === "approve" ? "Approve" : "Reject"}
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
    </Box>
  );
};

export default AddMoney;

