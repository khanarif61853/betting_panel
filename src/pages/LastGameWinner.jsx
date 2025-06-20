import { Box, Typography, Paper, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { useContextProvider } from "../context/ContextProvider";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const LastGameWinner = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { lastGameWinners, loading } =
    useContextProvider();
  const todayDate = dayjs().format("YYYY-MM-DD");

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "customerName", headerName: "Customer", flex: 1 },
    { field: "game", headerName: "Game", flex: 1 },
    { field: "finalBidNumber", headerName: "Bid Number", flex: 1 },
    { field: "matchedNumbers", headerName: "Bid Number", flex: 1 },
    { field: "winningAmount", headerName: "Winning Amount", flex: 1 },
    // { field: "gameCategory", headerName: "Game Category", flex: 1 },
  ];

  const rows = (lastGameWinners.winners || []).map((winner, i) => ({
    id: i + 1,
    customerName: winner?.customer?.name || "N/A",
    game: winner?.Game?.name || "N/A",
    finalBidNumber: winner?.Game?.finalBidNumber || "N/A",
    matchedNumbers: winner?.matchedNumbers || "N/A",
    winningAmount: winner?.winningAmount || "0",
    gameCategory: winner?.remark || "N/A",
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
          <Box display="flex" flexDirection="column" gap={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <EmojiEventsIcon color="primary" />
              <Typography variant="h5" fontWeight={600}>
                Last Game Winners: {lastGameWinners.count}
              </Typography>
            </Box>
          </Box>
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
            height: 450,
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            autoHeight={false}
            density="comfortable"
            hideFooterPagination
          />
        </Box>
      </Paper>
    </>
  );
};

export default LastGameWinner;
