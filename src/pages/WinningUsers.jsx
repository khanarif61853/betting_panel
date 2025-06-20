import {
  Box,
  TextField,
  Typography,
  Paper,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { usePagination } from "../hooks/usePagination";
import moment from "moment";
import { useContextProvider } from "../context/ContextProvider";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const WinningUsers = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { limit, total, changePage, changeLimit } = usePagination();
  const {
    requests,
    loading,
    setSelectedDateWinningUsers,
    dashboardWinningUsers,
    selectedDateWinningUsers,
  } = useContextProvider();


  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "customerName", headerName: "Customer", flex: 1 },
    { field: "game", headerName: "Game", flex: 1 },
    { field: "finalBidNumber", headerName: "Final Bid Number", flex: 1 },
    { field: "matchedNumbers", headerName: "Bid Number", flex: 1 },
    { field: "winningAmount", headerName: "Winning Amount", flex: 1 },
    // { field: "gameCategory", headerName: "Game Category", flex: 1 },
    { field: "createdAt", headerName: "Created At", flex: 1 },
  ];

  const rows = (requests || []).map((request, i) => ({
    id: i + 1,
    customerName: request?.customer?.name || "N/A",
    game: request?.Game?.name || "N/A",
    finalBidNumber: request?.Game?.finalBidNumber || "N/A",
    matchedNumbers: request?.matchedNumbers || "N/A",
    winningAmount: request?.winningAmount || "0",
    // gameCategory: request?.remark || "N/A",
    createdAt: request?.createdAt
      ? moment(request.createdAt).format("YYYY-MM-DD HH:mm:ss")
      : "N/A",
  }));

  return (
    <>
      <ArrowBackIcon
        style={{ cursor: "pointer", marginBottom: 16 }}
        onClick={() => navigate("/home")}
      />
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          backgroundColor: "#f9fafc",
          width: "100%",
          height: "calc(100vh - 150px)",  
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          mb={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box display="flex" alignItems="center" gap={1}>
            <EmojiEventsIcon color="primary" />
            <Typography variant="h5" fontWeight={600}>
              Winning Users: {dashboardWinningUsers}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h5" fontWeight={600}>
              Jodi:J, Ander:A, Bahar:B
            </Typography>
          </Box>
          <TextField
            label="Filter by Date"
            type="date"
            size="small"
            value={selectedDateWinningUsers}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setSelectedDateWinningUsers(e.target.value)}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            "& .MuiDataGrid-root": {
              border: "none",
              fontSize: 14,
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.grey[200],
              fontWeight: "bold",
              position: "sticky",
              top: 0,
              zIndex: 1,
            },
            "& .MuiDataGrid-row:nth-of-type(odd)": {
              backgroundColor: "#f3f6f9",
            },
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            paginationMode="server"
            rowCount={total}
            pageSize={limit}
            loading={loading}
            disableRowSelectionOnClick
            onPaginationModelChange={(value) => {
              if (value.pageSize !== limit) {
                changeLimit(value.pageSize);
                return changePage(0);
              }
              changePage(value.page);
              changeLimit(value.pageSize);
            }}
            autoHeight={false}
            density="comfortable"
          />
        </Box>
      </Paper>
    </>
  );
};

export default WinningUsers;
