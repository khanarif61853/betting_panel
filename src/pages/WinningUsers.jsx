import { Box, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { BASE_URL } from "../costants";
import { useEffect, useState } from "react";
import { usePagination } from "../hooks/usePagination";
import axios from "axios";
import moment from "moment";
import { useContextProvider } from "../context/ContextProvider";

const WinningUsers = () => {
  const { page, limit, total, changePage, changeLimit, changeTotal } =
    usePagination();
    const {requests,loading,setSelectedDateWinningUsers,dashboardWinningUsers} = useContextProvider();

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "customerName", headerName: "CUSTOMER NAME", width: 200 },
    { field: "game", headerName: "GAME", width: 200 },
    { field: "finalBidNumber", headerName: "BID NUMBER", width: 200 },
    { field: "winningAmount", headerName: "WINNING AMOUNT", width: 200 },
    { field: "gameCategory", headerName: "GAME CATEGORY", width: 200 },
    { field: "createdAt", headerName: "Created At", width: 200 },
  ];

  const rows = (requests || []).map((request, i) => ({
    id: i + 1,
    customerName: request?.customer?.name || "N/A",
    game: request?.Game?.name || "N/A",
    finalBidNumber: request?.Game?.finalBidNumber || "N/A",
    winningAmount: request?.winningAmount || "0",
    gameCategory: request?.remark || "N/A",
    createdAt: request?.createdAt
      ? moment(request.createdAt).format("YYYY-MM-DD")
      : "N/A",
  }));

  return (
    <>
      <Box style={{ width: "100%", display: "flex" }}>
        <Box style={{ height: 450, width: "100%" }} p={2}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography sx={{ textAlign: "center" }} variant="h5">
              Winning Users : {dashboardWinningUsers}
            </Typography>
            <TextField
              label="Filter by Date"
              type="date"
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => {
                setSelectedDateWinningUsers(e.target.value);
              }}
            />
          </Box>
          <DataGrid
            rows={rows}
            columns={columns}
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
      </Box>
    </>
  );
};

export default WinningUsers;
