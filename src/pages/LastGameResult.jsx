import { Box, Typography, Paper, useTheme, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useContextProvider } from "../context/ContextProvider";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const LastGameResult = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const {
    games,
    loading,
    gamesDate,
    setGamesDate,
    fetchGames
  } = useContextProvider();


  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "game", headerName: "Game", flex: 1 },
    { field: "finalBidNumber", headerName: "Result Number", flex: 1 },
  ];

  const rows = (games || []).map((val, i) => ({
    id: i + 1,
    game: val?.name || "N/A",
    finalBidNumber: val?.finalBidNumber || "N/A",
  }));


  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between",mb:2 }}>
        <ArrowBackIcon
          style={{ cursor: "pointer", marginBottom: 16 }}
          onClick={() => navigate("/home")}
        />
        <TextField
          label="Filter by Date"
          type="date"
          size="small"
          value={gamesDate}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => setGamesDate(e.target.value)}
        />
      </Box>
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
                Last Game Result
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
    </>
  );
};

export default LastGameResult;
