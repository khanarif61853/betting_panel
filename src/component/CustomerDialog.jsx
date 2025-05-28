import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
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
                case 'fetchCustomerDetails':
                    endpoint = `${BASE_URL}/api/web/retrieve/bid-history`;
                    break;
                case 'withdrawalHistory':
                    endpoint = `${BASE_URL}/api/web/retrieve/withdrawal-history`;
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
                setTotalDeposits(response?.data?.data?.totalDeposits);
                setTotalWinning(response?.data?.data?.totalWinning);
                setWithdrawableAmount(response?.data?.data?.withdrawableAmount);
                changeTotal(totalItems);
            } else if (type === 'bankDetails') {
                setData(response?.data?.data);
            } else if (type === 'withdrawalHistory') {
                const withdrawalData = response?.data?.data?.data || [];
                const totalItems = response?.data?.data?.count || 0;
                
                if (withdrawalData.length === 0) {
                    setData([]);
                } else {
                    const formattedData = withdrawalData.map((item) => ({
                        id: item.id,
                        amount: parseFloat(item.amount).toFixed(2),
                        status: item.status,
                        upiId: item.upiId || 'N/A',
                        customerName: item.Customer?.name || 'N/A',
                        customerMobile: item.Customer?.mobile || 'N/A',
                        createdAt: item.createdAt,
                        updatedAt: item.updatedAt
                    }));
                    setData(formattedData);
                }
                changeTotal(totalItems);
            } else if (type === 'fetchCustomerDetails') {
                const gameData = response?.data?.data || [];
                console.log('Game Data:', gameData); // For debugging
                const formattedData = [];
                
                // Process each game's data
                gameData.forEach((item) => {
                    // Process Jantri Bids
                    if (item.jantriBids && item.jantriBids.length > 0) {
                        formattedData.push({
                            id: `${item.gameId}-jantri`,
                            gameName: item.Game.name,
                            gameType: 'Jantri',
                            totalAmountSpentOnBid: item.totalAmountSpentOnBid,
                            finalBidNumber: item.Game.finalBidNumber,
                            startDateTime: moment(item.Game.startDateTime).format("DD/MM/YYYY HH:mm"),
                            endDateTime: moment(item.Game.endDateTime).format("DD/MM/YYYY HH:mm"),
                            bidDetails: item.jantriBids.map(bid => ({
                                bidNumbers: JSON.parse(bid.bidNumbers || '[]'),
                                insideNumbers: JSON.parse(bid.insideNumbers || '[]'),
                                outsideNumbers: JSON.parse(bid.outsideNumbers || '[]'),
                                bidAmount: bid.bidAmount,
                                winningAmount: bid.winningAmount,
                                createdAt: moment(bid.createdAt).format("DD/MM/YYYY HH:mm")
                            }))
                        });
                    }

                    // Process Cross Bids
                    if (item.crossBids && item.crossBids.length > 0) {
                        formattedData.push({
                            id: `${item.gameId}-cross`,
                            gameName: item.Game.name,
                            gameType: 'Cross',
                            totalAmountSpentOnBid: item.totalAmountSpentOnBid,
                            finalBidNumber: item.Game.finalBidNumber,
                            startDateTime: moment(item.Game.startDateTime).format("DD/MM/YYYY HH:mm"),
                            endDateTime: moment(item.Game.endDateTime).format("DD/MM/YYYY HH:mm"),
                            bidDetails: item.crossBids.map(bid => ({
                                bidNumbers: JSON.parse(bid.bidNumbers || '[]'),
                                insideNumbers: JSON.parse(bid.insideNumbers || '[]'),
                                outsideNumbers: JSON.parse(bid.outsideNumbers || '[]'),
                                bidAmount: bid.bidAmount,
                                winningAmount: bid.winningAmount,
                                createdAt: moment(bid.createdAt).format("DD/MM/YYYY HH:mm")
                            }))
                        });
                    }

                    // Process Openplay Bids
                    if (item.openplayBids && item.openplayBids.length > 0) {
                        formattedData.push({
                            id: `${item.gameId}-openplay`,
                            gameName: item.Game.name,
                            gameType: 'Openplay',
                            totalAmountSpentOnBid: item.totalAmountSpentOnBid,
                            finalBidNumber: item.Game.finalBidNumber,
                            startDateTime: moment(item.Game.startDateTime).format("DD/MM/YYYY HH:mm"),
                            endDateTime: moment(item.Game.endDateTime).format("DD/MM/YYYY HH:mm"),
                            bidDetails: item.openplayBids.map(bid => ({
                                bidNumbers: JSON.parse(bid.bidNumbers || '[]'),
                                insideNumbers: JSON.parse(bid.insideNumbers || '[]'),
                                outsideNumbers: JSON.parse(bid.outsideNumbers || '[]'),
                                bidAmount: bid.bidAmount,
                                winningAmount: bid.winningAmount,
                                createdAt: moment(bid.createdAt).format("DD/MM/YYYY HH:mm")
                            }))
                        });
                    }
                });

                console.log('Formatted Data:', formattedData); // For debugging
                setData(formattedData);
                changeTotal(formattedData.length);
            }

        } catch (error) {
            console.error(`Error fetching ${type}:`, error);
            setData([]);
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
                            <DialogContentText>No Bank Details found</DialogContentText>
                        )}
                    </>
                );

            case 'withdrawalHistory':
                return (
                    <>
                        {data.length > 0 ? (
                            <Box style={{ height: 450, width: '100%', overflow: 'auto' }} p={2}>
                                <DataGrid
                                    rows={data}
                                    columns={[
                                        {
                                            field: 'amount',
                                            headerName: 'Amount',
                                            width: 120,
                                            renderCell: (params) => (
                                                <strong style={{ color: 'green' }}>
                                                    ₹{params.value}
                                                </strong>
                                            )
                                        },
                                        {
                                            field: 'upiId',
                                            headerName: 'UPI ID',
                                            width: 200,
                                        },
                                        {
                                            field: 'customerName',
                                            headerName: 'Name',
                                            width: 150,
                                        },
                                        {
                                            field: 'customerMobile',
                                            headerName: 'Mobile',
                                            width: 150,
                                        },
                                        {
                                            field: 'status',
                                            headerName: 'Status',
                                            width: 130,
                                            renderCell: (params) => (
                                                <Chip
                                                    label={params.value}
                                                    color={params.value === 'Completed' ? 'success' : 
                                                           params.value === 'Pending' ? 'warning' : 'error'}
                                                    variant="filled"
                                                />
                                            )
                                        },
                                        {
                                            field: 'createdAt',
                                            headerName: 'Requested On',
                                            width: 180,
                                            valueFormatter: (params) => 
                                                moment(params.value).format("DD/MM/YYYY HH:mm")
                                        },
                                        {
                                            field: 'updatedAt',
                                            headerName: 'Last Updated',
                                            width: 180,
                                            valueFormatter: (params) => 
                                                moment(params.value).format("DD/MM/YYYY HH:mm")
                                        }
                                    ]}
                                    initialState={{
                                        pagination: {
                                            paginationModel: { pageSize: limit, page },
                                        },
                                    }}
                                    paginationMode="server"
                                    rowCount={total}
                                    pageSize={limit}
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
                                        }
                                    }}
                                />
                            </Box>
                        ) : (
                            <Box p={3} textAlign="center">
                                <Typography variant="h6" color="textSecondary">
                                    No Withdrawal History Found
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    This customer hasn't made any withdrawal requests yet.
                                </Typography>
                            </Box>
                        )}
                    </>
                );

            case 'fetchCustomerDetails':
                return (
                    <>
                        {data.length > 0 ? (
                            <Box style={{ height: 450, width: '100%', overflow: 'auto' }} p={2}>
                                <DataGrid
                                    rows={data}
                                    columns={[
                                        {
                                            field: 'gameName',
                                            headerName: 'Game Name',
                                            width: 120
                                        },
                                        {
                                            field: 'gameType',
                                            headerName: 'Game Type',
                                            width: 100
                                        },
                                        {
                                            field: 'startDateTime',
                                            headerName: 'Start Time',
                                            width: 160
                                        },
                                        {
                                            field: 'endDateTime',
                                            headerName: 'End Time',
                                            width: 160
                                        },
                                        {
                                            field: 'totalAmountSpentOnBid',
                                            headerName: 'Amount Spent',
                                            width: 120,
                                            renderCell: (params) => (
                                                <strong style={{ color: params.value < 0 ? 'red' : 'green' }}>
                                                    {Math.abs(params.value)}
                                                </strong>
                                            )
                                        },
                                        {
                                            field: 'finalBidNumber',
                                            headerName: 'Result',
                                            width: 100,
                                            renderCell: (params) => (
                                                <strong>{params.value || 'Pending'}</strong>
                                            )
                                        },
                                        {
                                            field: 'bidDetails',
                                            headerName: 'Bid Details',
                                            width: 400,
                                            renderCell: (params) => (
                                                <Box>
                                                    {params.value.map((bid, index) => (
                                                        <Box key={index} sx={{ mb: 1, p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                                                            {bid.bidNumbers.length > 0 && (
                                                                <Typography variant="body2">
                                                                    <strong>Numbers:</strong> {bid.bidNumbers.map(n => `${n.number}(₹${n.amount})`).join(', ')}
                                                                </Typography>
                                                            )}
                                                            {bid.insideNumbers.length > 0 && (
                                                                <Typography variant="body2">
                                                                    <strong>Inside:</strong> {bid.insideNumbers.map(n => `${n.number}(₹${n.amount})`).join(', ')}
                                                                </Typography>
                                                            )}
                                                            {bid.outsideNumbers.length > 0 && (
                                                                <Typography variant="body2">
                                                                    <strong>Outside:</strong> {bid.outsideNumbers.map(n => `${n.number}(₹${n.amount})`).join(', ')}
                                                                </Typography>
                                                            )}
                                                            <Typography variant="body2">
                                                                <strong>Bid:</strong> ₹{bid.bidAmount},
                                                                <strong> Win:</strong> {bid.winningAmount ? `₹${bid.winningAmount}` : 'N/A'}
                                                            </Typography>
                                                            <Typography variant="caption" color="textSecondary">
                                                                {bid.createdAt}
                                                            </Typography>
                                                        </Box>
                                                    ))}
                                                </Box>
                                            )
                                        }
                                    ]}
                                    pageSize={limit}
                                    components={{ Toolbar: GridToolbar }}
                                    disableRowSelectionOnClick
                                    loading={loading}
                                    sx={{
                                        '& .MuiDataGrid-cell': {
                                            borderBottom: '1px solid #ddd',
                                        },
                                        '& .MuiDataGrid-columnHeaders': {
                                            backgroundColor: '#f5f5f5',
                                            borderBottom: '2px solid #ddd',
                                        }
                                    }}
                                />
                            </Box>
                        ) : (
                            <Box p={3} textAlign="center">
                                <Typography variant="h6" color="textSecondary">
                                    No Game History Found
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    This customer hasn't played any games yet.
                                </Typography>
                            </Box>
                        )}
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            fullWidth 
            maxWidth={type === "walletStatement" || type === "fetchCustomerDetails" || type === "withdrawalHistory" ? "xl" : "sm"}
        >
            <DialogTitle>
                {type === 'bankDetails' ? 'Bank Details' : 
                 type === 'walletStatement' ? 'Wallet Statement' : 
                 type === 'withdrawalHistory' ? 'Withdrawal History' :
                 'Customer Game Details'}
            </DialogTitle>
            <DialogContent>{loading ? 'Loading...' : renderContent()}</DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

CustomerDialog.propTypes = {
    type: PropTypes.oneOf(['bankDetails', 'walletStatement', 'fetchCustomerDetails', 'withdrawalHistory']).isRequired,
    customerId: PropTypes.number.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default CustomerDialog;
