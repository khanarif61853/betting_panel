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
import CasinoIcon from "@mui/icons-material/Casino";

const AndarBaharWinner = () => {
  const { abData, loading, setSelectedDateAB } = useContextProvider();
  const theme = useTheme();

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "game", headerName: "Game", flex: 1 },
    { field: "andar", headerName: "Andar", flex: 1 },
    { field: "bahar", headerName: "Bahar", flex: 1 },
    { field: "finalBidNumber", headerName: "Open Number", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },
    { field: "winningAmount", headerName: "Winning Amount", flex: 1 },
    { field: "createdAt", headerName: "Created At", flex: 1 },
  ];

  const rows = (abData || []).map((item, i) => {
    const andarAmount = (item.insideNumbers || []).reduce(
      (sum, n) => sum + (Number(n.amount) || 0),
      0
    );
    const baharAmount = (item.outsideNumbers || []).reduce(
      (sum, n) => sum + (Number(n.amount) || 0),
      0
    );

    const andarNumbers =
      (item.insideNumbers || [])
        .map((n) => n.number)
        .filter(Boolean)
        .join(", ") || "N/A";

    const baharNumbers =
      (item.outsideNumbers || [])
        .map((n) => n.number)
        .filter(Boolean)
        .join(", ") || "N/A";

    return {
      id: i + 1,
      name: item.Customer?.name || "N/A",
      game: item.Game?.name || "N/A",
      amount: andarAmount + baharAmount || "N/A",
      winningAmount: item?.winningAmount || "N/A",
      andar: andarNumbers,
      bahar: baharNumbers,
      finalBidNumber: item?.Game?.finalBidNumber || "N/A",
      createdAt: item?.createdAt
        ? moment(item.createdAt).format("YYYY-MM-DD")
        : "N/A",
    };
  });

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        backgroundColor: "#f9fafc",
        width: "100%",
      }}
    >
      <Box
        mb={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box display="flex" alignItems="center" gap={1}>
          <CasinoIcon color="primary" />
          <Typography variant="h5" fontWeight={600}>
            Andar Bahar Winners
          </Typography>
        </Box>
        <TextField
          label="Filter by Date"
          type="date"
          size="small"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => setSelectedDateAB(e.target.value)}
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
          rows={rows}
          columns={columns}
          loading={loading}
          disableSelectionOnClick
          getRowHeight={() => "auto"}
        />
      </Box>
    </Paper>
  );
};

export default AndarBaharWinner;
