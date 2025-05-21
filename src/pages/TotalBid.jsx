import { Box, Typography } from "@mui/material";
import usePagination from "@mui/material/usePagination/usePagination";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { BASE_URL } from "../costants";

const TotalBid = () => {
  const [dataRequest, setDataRequest] = useState([]);
  const [selectedDate, setSelectDate] = useState("");
  const [loading, setLoading] = useState(true);
  const { page, limit, total, changePage, changeLimit, changeTotal } =
    usePagination();

  const allbids = async () => {
    setLoading(true);
    try {
      const {
        data: { data },
      } = await axios.get(`${BASE_URL}/api/web/retrieve/all-bids`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      console.log(data,'--datatotalbid')

      data.map((item, index) => ({
        id: index + 1,
        game: item.game_name,
        total: item?.total_bid,
        createdAt: item?.createdAt,
      }));
      setDataRequest(data);
    } catch (error) {
      console.error("Failed to fetch all bids:", error);
    }
    setLoading(false);
  };

  const bidcolumns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "game", headerName: "GAME", width: 200 },

    { field: "total", headerName: "TOTAL", width: 200 },
    { field: "createdAt", headerName: "Created At", width: 200 },
  ];
  const bidrows = (dataRequest || []).map((item, i) => ({
    id: i + 1,
    game: item.game_name || "N/A",
    total: item.total_bid || 0,
    createdAt: item?.createdAt
      ? moment(item.createdAt).format("YYYY-MM-DD")
      : "N/A",
  }));

  useEffect(() => {
    allbids();
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
            Total Bid
          </Typography>
        </Box>
        <DataGrid
          rows={bidrows}
          columns={bidcolumns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: limit, page },
            },
          }}
          paginationMode="server"
          rowCount={total}
          pageSize={limit}
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
    </>
  );
};

export default TotalBid;
