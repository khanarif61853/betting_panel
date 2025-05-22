import { Box, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { useContextProvider } from "../context/ContextProvider";

const TotalBid = () => {
  const {
    loading,
    setLoading,
    dataRequest,
    setDataRequest,
    setSelectDate,
    dashboardTotalBid,
  } = useContextProvider();

  const allbids = async () => {
    setLoading(true);
    try {
      dataRequest.map((item, index) => ({
        id: index + 1,
        game: item.game_name,
        total: item?.total_bid,
        createdAt: item?.createdAt,
      }));
      setDataRequest(dataRequest);
      setLoading(false);
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
            Total Bid : {dashboardTotalBid}
          </Typography>
          <TextField
            label="Filter by Date"
            type="date"
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => {
              setSelectDate(e.target.value);
            }}
          />
        </Box>
        <DataGrid
          rows={bidrows}
          columns={bidcolumns}
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

export default TotalBid;
