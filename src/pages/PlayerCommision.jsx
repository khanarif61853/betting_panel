import {
    Box,
    Typography,
    Paper,
    useTheme,
  } from "@mui/material";
  import { DataGrid } from "@mui/x-data-grid";
  import moment from "moment";
  import { useContextProvider } from "../context/ContextProvider";
  import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
  
  const PlayerCommision = () => {
    const theme = useTheme();
    const { lastGameWinners, loading } = useContextProvider();
  
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
                Player Commision: {lastGameWinners.count}
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
    );
  };
  
  export default PlayerCommision;