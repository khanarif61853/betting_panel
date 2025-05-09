import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Dialog, TextField, Avatar, IconButton, Menu, MenuItem, Switch, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { usePagination } from '../hooks/usePagination';
import CustomSnackbar from '../component/CustomSnackbar';
import CustomerDialog from '../component/CustomerDialog';
import { BASE_URL } from '../costants';

const theme = createTheme({
    palette: {
        primary: { main: '#1976d2' },
        secondary: { main: '#d32f2f' },
        success: { main: '#2e7d32' },
    },
    typography: {
        fontFamily: 'Arial, sans-serif',
    },
});

const Customer = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState('');
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const { page, limit, total, changePage, changeLimit, changeTotal } = usePagination();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [anchorEl, setAnchorEl] = useState(null); // For Menu control
    const [menuCustomerId, setMenuCustomerId] = useState(null); // For storing selected customer ID in menu

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/web/retrieve/customers`, {
                params: { limit, page },
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            setCustomers(response.data.data.customers);
            setFilteredCustomers(response.data.data.customers);
            changeTotal(response.data.data.count);
        } catch (error) {
            console.error('Error fetching customers:', error);
            setSnackbarMessage('Failed to fetch customers');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, [page, limit]);

    useEffect(() => {
        const filtered = search
            ? customers.filter(customer => customer.mobile.includes(search))
            : customers;
        setFilteredCustomers(filtered);
    }, [search, customers]);

    const handleOpenDialog = (type, customerId) => {
        setDialogType(type);
        setSelectedCustomerId(customerId);
        setDialogOpen(true);
        handleCloseMenu();
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setDialogType('');
        setSelectedCustomerId(null);
    };

    const handleMenuOpen = (event, customerId) => {
        setAnchorEl(event.currentTarget);
        setMenuCustomerId(customerId);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setMenuCustomerId(null);
    };
    const handleStatusChange = async (customerId, currentStatus) => {
        try {
            // Toggle the status (true -> false, false -> true)
            const updatedStatus = !currentStatus;
    
            // Make an API call to update the customer's status
            await axios.put(`${BASE_URL}/api/web/status/customer`, {
                customerId,
                status: updatedStatus
            }, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
    
            // Update the local state to reflect the new status
            setCustomers(prevCustomers =>
                prevCustomers.map(customer =>
                    customer.id === customerId ? { ...customer, status: updatedStatus } : customer
                )
            );
    
            setSnackbarMessage('Status updated successfully');
            setSnackbarSeverity('success');
        } catch (error) {
            console.error('Error updating status:', error);
            setSnackbarMessage('Failed to update status');
            setSnackbarSeverity('error');
        } finally {
            setSnackbarOpen(true);
        }
    };
    
    const columns = [
        { field: 'name', headerName: 'Name', flex: 1 },
        {
            field: 'mobile',
            headerName: 'Mobile',
            flex: 1,
            renderCell: (params) => (
                <Button variant="text" color="primary" onClick={() => handleOpenDialog('viewDetails', params.row.id)}>
                    {params.value}
                </Button>
            )
        },
        {
            field: 'image',
            headerName: 'Image',
            flex: 1,
            renderCell: (params) => <Avatar src={params.value} alt={params.row.name} />
        },
        { field: 'walletAmount', headerName: 'Wallet Amount', flex: 1 },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            renderCell: (params) => (
                <Switch
                    size="small"
                    color="warning"
                    checked={Boolean(params.row.status)}
                    onChange={() => handleStatusChange(params.row.id, params.row.status)}
                />
            )
        },
        
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: (params) => (
                <IconButton onClick={(e) => handleMenuOpen(e, params.row.id)}>
                    <MoreVertIcon />
                </IconButton>
            )
        }
    ];

    const rows = filteredCustomers.map(customer => ({
        id: customer.id,
        name: customer.name,
        mobile: customer.mobile,
        image: customer.image,
        walletAmount: parseFloat(customer.totalWalletAmount).toFixed(2),
        status: customer.status,
    }));

    return (
        <ThemeProvider theme={theme}>
            <Box p={2}>
                <Typography variant="h4" my={2} textAlign="center" fontWeight="bold">
                    Customers
                </Typography>
                <Box display="flex" alignItems="center" mb={2}>
                    <TextField
                        label="Search by Mobile Number"
                        variant="outlined"
                        type="number"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ marginLeft: 16 }}
                    />
                    {/* <Button variant="contained" color="primary" onClick={fetchCustomers}>
                        Search
                    </Button> */}
                </Box>
                <Box style={{ height: 450, width: '100%', overflow: 'auto' }} p={2}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        paginationMode="server"
                        rowCount={total}
                        pageSize={limit}
                        onPaginationModelChange={(model) => {
                            changePage(model.page);
                            changeLimit(model.pageSize);
                        }}
                        loading={loading}
                        checkboxSelection
                        disableSelectionOnClick
                            disableRowSelectionOnClick
                    />
                </Box>
            </Box>
            <CustomSnackbar
                open={snackbarOpen}
                handleClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                severity={snackbarSeverity}
            />
            <CustomerDialog
                type={dialogType}
                customerId={selectedCustomerId}
                open={dialogOpen}
                onClose={handleCloseDialog}
            />
            {/* Menu for actions */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
            >
                <MenuItem onClick={() => handleOpenDialog('walletStatement', menuCustomerId)}>
                    Wallet Statement
                </MenuItem>
                <MenuItem onClick={() => handleOpenDialog('bankDetails', menuCustomerId)}>
                    Bank Details
                </MenuItem>
            </Menu>
        </ThemeProvider>
    );
};

export default Customer;
