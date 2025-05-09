import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText, Box, Typography, Chip } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import { BASE_URL } from '../costants.js'; // Adjust this import according to your project structure
import { usePagination } from '../hooks/usePagination';
import moment from 'moment';

const CustomerDialog = ({ type, customerId, open, onClose }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState(0);
    const [totalProfit, setTotalProfit] = useState(0);
    const [totalCredit, setTotalCredit] = useState(0);
    const [totalDebit, setTotalDebit] = useState(0);
    const [totalDeposits, setTotalDeposits] = useState(0);
    const [totalWinning, setTotalWinning] = useState(0);
    const [withdrawableAmount, setWithdrawableAmount] = useState(0);

    const { page, limit, total, changePage, changeLimit, changeTotal } = usePagination();

    const fetchData = async () => {
        setLoading(true);
        try {
            let endpoint = '';

            switch (type) {
                case 'bankDetails':
                    endpoint = `${BASE_URL}/api/web/retrieve/bank-details`;
                    break;
                case 'walletStatement':
                    endpoint = `${BASE_URL}/api/web/retrieve/statement`;
                    break;
                default:
                    throw new Error(`Unknown type: ${type}`);
            }

            // Make API call
            const response = await axios.get(endpoint, {
                params: { customerId, page: page, limit },
                headers: { "Authorization": localStorage.getItem("token") },
            });

            if (type === 'walletStatement') {
                const walletData = response?.data?.data?.transactions;
                const totalItems =  response?.data?.data?.count;

                const formattedData = walletData.map((item) => ({
                    id: item.id,
                    customerId: item.customerId,
                    gameId: item.gameId,
                    walletAmount: item.walletAmount ? item.walletAmount :0,
                    addMoneyBonus: item.addMoneyBonus ? parseFloat(item.addMoneyBonus) : "NA",
                    type: item.type,
                    referredId: item.referredId,
                    createdAt: moment(item.createdAt).format("DD/MM/YYYY"),
                    updatedAt: moment(item.updatedAt).format("DD/MM/YYYY"),
                }));

                setData(formattedData);
                setBalance(response?.data?.data?.balance);
                setTotalProfit(response?.data?.data?.totalProfit);
                setTotalCredit(response?.data?.data?.totalCredit);
                setTotalDebit(response?.data?.data?.totalDebit);
                setTotalDeposits(response?.data?.data?.totalDeposits);
                setTotalWinning(response?.data?.data?.totalWinning);
                setWithdrawableAmount(response?.data?.data?.withdrawableAmount);
                changeTotal(totalItems);
            } else if (type === 'bankDetails') {
                setData(response?.data?.data);
            }

        } catch (error) {
            console.error(`Error fetching ${type}:`, error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) fetchData(page, limit);
    }, [open, type, customerId, page, limit]);

    const handlePageChange = (newPage) => {
        changePage(newPage);
    };

    const handleLimitChange = (newLimit) => {
        changeLimit(newLimit);
        changePage(0); // Reset to first page when limit changes
    };

    const getTransactionChipColor = (type) => {
        switch (type) {
            case 'Credit':
                return 'success';
            case 'Debit':
                return 'error';
            default:
                return 'default';
        }
    };

    const renderContent = () => {
        switch (type) {
            case 'walletStatement':
                return (
                    <>
                        <Box p={2}>
                            {/* Wallet summary */}
                            <Box display="flex" flexDirection="row" justifyContent="space-around" mt={2}>
                                <Box textAlign="center">
                                    <Typography variant="subtitle1">Balance</Typography>
                                    <Typography variant="h6" color="primary">{balance ? balance : 0}</Typography>
                                </Box>
                                <Box textAlign="center">
                                    <Typography variant="subtitle1">Total Profit</Typography>
                                    <Typography variant="h6" color="primary">{totalProfit ? totalProfit : 0}</Typography>
                                </Box>
                                {/*<Box textAlign="center">*/}
                                {/*    <Typography variant="subtitle1">Total Credit</Typography>*/}
                                {/*    <Typography variant="h6" color="primary">{totalCredit ? totalCredit : 0}</Typography>*/}
                                {/*</Box>*/}
                                {/*<Box textAlign="center">*/}
                                {/*    <Typography variant="subtitle1">Total Debit</Typography>*/}
                                {/*    <Typography variant="h6" color="primary">{totalDebit ? totalDebit : 0}</Typography>*/}
                                {/*</Box>*/}
                                <Box textAlign="center">
                                    <Typography variant="subtitle1">Total Deposits (<sub>with bonus</sub>)</Typography>
                                    <Typography variant="h6" color="primary">{totalDeposits ? totalDeposits : 0}</Typography>
                                </Box>
                                <Box textAlign="center">
                                    <Typography variant="subtitle1">Total Winning</Typography>
                                    <Typography variant="h6" color="primary">{totalWinning ? totalWinning : 0}</Typography>
                                </Box>
                                <Box textAlign="center">
                                    <Typography variant="subtitle1">Withdrawable Amount</Typography>
                                    <Typography variant="h6" color="primary">{withdrawableAmount ? withdrawableAmount : 0}</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box style={{ height: 450, width: '100%', overflow: 'auto' }} p={2}>
                            <DataGrid
                                rows={data}
                                columns={[
                                    {
                                        field: 'type',
                                        headerName: 'Transaction Type',
                                        width: 200,
                                        renderCell: (params) => (
                                            <Chip
                                                label={params.value}
                                                color={getTransactionChipColor(params.value)}
                                                variant="filled"
                                            />
                                        )
                                    },
                                    {
                                        field: 'walletAmount',
                                        headerName: 'Wallet Amount',
                                        width: 150,
                                        flex: 1,
                                        renderCell: (params) => (
                                            <strong style={{ color: params.value > 0 ? 'green' : 'red' }}>
                                                {params.value}
                                            </strong>
                                        )
                                    },
                                    {
                                        field: 'addMoneyBonus',
                                        headerName: 'Add Money Bonus',
                                        width: 150,
                                        renderCell: (params) => (
                                            <span style={{ color: params.value != "NA" ? 'blue' : 'grey' }}>
                                                {params.value}
                                            </span>
                                        )
                                    },
                                    {
                                        field: 'referredId',
                                        headerName: 'Referred ID',
                                        valueFormatter: (value) => value ? value : "NA",
                                        width: 150
                                    },
                                    {
                                        field: 'gameId',
                                        headerName: 'Game ID',
                                        valueFormatter: (value) => value ? value : "NA",
                                        width: 150
                                    },
                                    {
                                        field: 'createdAt',
                                        headerName: 'Date',
                                        width: 200
                                    },
                                ]}
                                initialState={{
                                    pagination: {
                                        paginationModel: { pageSize: limit, page },
                                    },
                                }}
                                paginationMode="server"
                                rowCount={total}
                                pageSize={limit}
                                checkboxSelection
                                components={{ Toolbar: GridToolbar }}
                                onPaginationModelChange={(pagination) => {
                                    const { pageSize, page } = pagination;
                                    if (pageSize !== limit) {
                                        handleLimitChange(pageSize);
                                    } else {
                                        handlePageChange(page);
                                    }
                                }}
                                disableRowSelectionOnClick
                                loading={loading}
                                sx={{
                                    '& .MuiDataGrid-cell': {
                                        borderBottom: '1px solid #ddd',
                                    },
                                    '& .MuiDataGrid-columnHeaders': {
                                        backgroundColor: '#f5f5f5',
                                        borderBottom: '2px solid #ddd',
                                    },
                                }}
                            />
                        </Box>
                    </>
                );

            case 'bankDetails':
                return (
                    <>
                        {data?.name ? (
                            <>
                                <DialogContentText><b>Account Holder Name:</b> {data?.name}</DialogContentText>
                                <DialogContentText><b>Account Number:</b> {data?.accountNumber}</DialogContentText>
                                <DialogContentText><b>IFSC Code:</b> {data?.ifscCode}</DialogContentText>
                            </>
                        ) : (
                            <DialogContentText>No Details found</DialogContentText>
                        )}
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth={type === "walletStatement" ? "xl" : "sm"}>
            <DialogTitle>{type === 'bankDetails' ? 'Bank Details' : 'Wallet Statement'}</DialogTitle>
            <DialogContent>{loading ? 'Loading...' : renderContent()}</DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CustomerDialog;
