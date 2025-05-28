import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Chip, Typography } from '@mui/material';
import { usePagination } from '../hooks/usePagination';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import moment from 'moment';
import CustomSnackbar from '../component/CustomSnackbar';
import { BASE_URL } from '../costants';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5a508b',
    },
    secondary: {
      main: '#d32f2f',
    },
    success: {
      main: '#2e7d32',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          backgroundColor: '#f4f6f8',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#1976d2',
            fontSize: '1.1rem',
          },
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'pre-line', // Maintain line breaks in text
          },
        },
      },
    },
  },
});

const WithdrawalApprovedList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { page, limit, total, changePage, changeLimit, changeTotal } = usePagination();

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchRequests();
  }, [page, limit]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/web/retrieve/withdrawal-requests`, {
        params: { 
          limit, 
          page,
          status: 'Approved'
        },
        headers:{
          "Authorization":localStorage.getItem("token")
        }
      });
      setRequests(response.data.data.requests);
      changeTotal(response.data.data.count);
      setSnackbarSeverity('success');
      setSnackbarMessage(`Retrieved successfully`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage("Error fetching requests");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'customerName', headerName: 'Customer Name', width: 150 },
    { field: 'mobile', headerName: 'Mobile', width: 110 },
    { field: 'amount', headerName: 'Amount', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: () => (
        <Chip label="Approved" size="small" sx={{ background: "#2e7d32", color: "white",mt:1,mb:1 }}   />
      ),
    },
    {
      field: 'accountDetails',
      headerName: 'Account details',
      width: 300,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'pre-line' }}>
          {params.value}
        </div>
      ),
    },
    { field: 'createdAt', headerName: 'Created At', width: 200 },
  ];

  const rows = requests?.map((request) => {
    let accountDetails = '';
    if (request.accountDetails) {
      try {
        const parsedDetails = JSON.parse(request.accountDetails);
        accountDetails = `Account Holder Name: ${parsedDetails?.accountHolderName || ''}\nAccount Number: ${parsedDetails?.accountNumber || ''}\nIFSC Code: ${parsedDetails?.ifscCode || ''}`;
      } catch (error) {
        console.error('Error parsing account details:', error);
        accountDetails = 'Invalid account details';
      }
    } else if (request.upiId) {
      accountDetails = `UPI ID: ${request.upiId}`;
    }
    return {
      id: request.id,
      customerName: request?.Customer?.name,
      mobile: request?.Customer?.mobile,
      amount: request?.amount,
      status: request?.status,
      createdAt: moment(request.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      accountDetails,
    };
  });

  return (
    <ThemeProvider theme={theme}>
      <Typography variant={"h4"} my={2} textAlign={"center"} fontWeight={"bold"}>Withdrawal Approved List</Typography>
      <Box style={{ height: 450, width: '100%' }} p={2}>
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
          onPaginationModelChange={(value) => {
            if (value.pageSize !== limit) {
              changeLimit(value.pageSize);
              return changePage(0);
            }
            changePage(value.page);
            changeLimit(value.pageSize);
          }}
          loading={loading}
          getRowHeight={() => 'auto'}
        />
      </Box>

      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
    </ThemeProvider>
  );
};

export default WithdrawalApprovedList;
