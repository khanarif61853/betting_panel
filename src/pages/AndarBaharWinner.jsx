import { Box, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { BASE_URL } from "../costants";
import { usePagination } from "../hooks/usePagination";
import axios from "axios";
import moment from "moment";

const AndarBaharWinner = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [abData, setAbData] = useState([]);
  const { page, limit, total, changePage, changeLimit, changeTotal } =
    usePagination();

  const abWinner = async () => {
  setLoading(true);
  const {
    data: { data },
  } = await axios.get(`${BASE_URL}/api/web/retrieve/ander-bahar-winner`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    params: { page, limit, date: selectedDate },
  });

  const allRows = data.flatMap((item) => {
    const andarRows = (item.insideNumbers || []).map((item) => ({
      ...item,
      remark: "Andar",
      customer: entry.Customer,
      game: entry.Game,
      finalBidNumber: entry.Game?.finalBidNumber,
      createdAt: entry.createdAt,
    }));

    const baharRows = (item.outsideNumbers || []).map((item) => ({
      ...item,
      remark: "Bahar",
      customer: entry.Customer,
      game: entry.Game,
      finalBidNumber: entry.Game?.finalBidNumber,
      createdAt: entry.createdAt,
    }));

    return [...andarRows, ...baharRows];
  });

  setAbData(allRows);
  setLoading(false);
};


  const andarBaharColumns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "game", headerName: "GAME", width: 200 },
    { field: "amount", headerName: "AMOUNT", width: 200 },
    { field: "remark", headerName: "ANDAR / BAHAR", width: 200 }, 
    { field: "finalBidNumber", headerName: "BID NUMBER", width: 200 },
    { field: "createdAt", headerName: "Created At", width: 200 },
  ];

  const andarBaharRows = (abData || []).map((item, i) => ({
    id: i + 1,
    name: item.customer?.name || "N/A",
    game: item.game?.name || "N/A",
    amount: item.amount || item.total_bid || 0,
    remark: item.remark,
    finalBidNumber: item.finalBidNumber || "N/A",
    createdAt: item?.createdAt
      ? moment(item.createdAt).format("YYYY-MM-DD")
      : "N/A",
  }));

  useEffect(() => {
    abWinner();
  }, [page, limit, selectedDate]);

  return (
    <>
      <Box style={{ height: 450, width: "100%" }} p={2}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
            mt: 1,
          }}
        >
          <Typography sx={{ textAlign: "center" }} variant="h5">
            Andar Bahar Winners
          </Typography>
          <TextField
            label="Filter by Date"
            type="date"
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => {
              setSelectedDate(e.target.value);
            }}
          />
        </Box>
        <DataGrid
            rows={andarBaharRows}
          columns={andarBaharColumns}
          sx={{
            "& .MuiToolbar-root > div.MuiInputBase-root > svg": {
              display: "none !important",
            },
          }}
          loading={loading}
          getRowHeight={() => "auto"} // Adjust row height based on content
        />
      </Box>
    </>
  );
};

export default AndarBaharWinner;
