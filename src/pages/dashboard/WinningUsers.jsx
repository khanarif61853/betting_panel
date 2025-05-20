import { Box, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const WinningUsers = () => {
  return (
    <>
      <Box style={{ width: "100%", display: "flex" }}>
        <Box style={{ height: 450, width: "50%" }} p={2}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography sx={{ textAlign: "center" }} variant="h5">
              Winning Users
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
