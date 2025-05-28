import {
  Box,
  TextField,
  Typography,
  Paper,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { useContextProvider } from "../context/ContextProvider";
import StackedBarChartIcon from "@mui/icons-material/StackedBarChart";

const TotalBid = () => {
  const {
    loading,
    dataRequest,
    setSelectDate,
    dashboardTotalBid,
  } = useContextProvider();

  const bidcolumns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "game", headerName: "Game", flex: 1 },
    { field: "total", headerName: "Total Bid", flex: 1 },
    { field: "createdAt", headerName: "Created At", flex: 1 },
  ];

  const bidrows = (dataRequest || []).map((item, i) => ({
    id: i + 1,
    game: item.game_name || "N/A",
    total: item.total_bid || 0,
    createdAt: item?.createdAt
      ? moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
      : "N/A",
  }));

  const theme = useTheme();

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
        <Box display="flex" alignItems="center" gap={1}>
          <StackedBarChartIcon color="primary" />
          <Typography variant="h5" fontWeight={600}>
            Total Bid: {dashboardTotalBid}
          </Typography>
        </Box>
        <TextField
          label="Filter by Date"
          type="date"
          size="small"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => setSelectDate(e.target.value)}
        />
      </Box>

      <Box
        sx={{
          height: 450,
          width: "100%",
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
          rows={bidrows}
          columns={bidcolumns}
          loading={loading}
          getRowHeight={() => "auto"}
          disableSelectionOnClick
        />
      </Box>
    </Paper>
  );
};

export default TotalBid;
