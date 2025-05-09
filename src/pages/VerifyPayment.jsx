import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { BASE_URL } from '../costants';
import { usePagination } from "../hooks/usePagination.jsx";

const QrCodes = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openApprovalDialog, setOpenApprovalDialog] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [saving, setSaving] = useState(false);
    const { page, limit, total, changePage, changeLimit } = usePagination();

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${BASE_URL}/api/web/retrieve/payments`, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });
            setPayments(data.type === 'success' && data.data ? data.data : []);
        } catch (err) {
            console.error('Error fetching payments:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const formik = useFormik({
        initialValues: {
            upiId: '',
            status: 'Approved',
        },
        validationSchema: Yup.object({
            upiId: Yup.string()
                .test(
                    'upi-validation', // Unique test name
                    'UPI ID is required for Approved status and must be a valid UPI ID', // Error message
                    function (value) {
                        const { status } = this.parent; // Access other fields using `this.parent`
                        if (status === 'Approved') {
                            // Perform validation only if status is 'Approved'
                            const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/; // Example UPI format regex
                            return value && upiRegex.test(value);
                        }
                        return true; // Pass validation for other statuses
                    }
                ),
        }),
        onSubmit: async (values) => {
            setSaving(true);
            console.log("pppp")
            try {
                const { data } = await axios.put(
                    `${BASE_URL}/api/web/update/approve-payment/${selectedPayment.id}`,
                    { upiId: values.upiId, status: values.status },
                    {
                        headers: {
                            Authorization: localStorage.getItem('token'),
                        },
                    }
                );
                if (data.type === 'success') {
                    setOpenApprovalDialog(false);
                    fetchPayments();
                }
            } catch (err) {
                console.error('Error approving/rejecting payment:', err);
            } finally {
                setSaving(false);
            }
        },
    });

    const columns = [
        { field: 'id', headerName: 'ID', width: 150 },
        { field: 'amount', headerName: 'Amount Paid', width: 150 },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    sx={{ background: params.value === "Pending" || params.value === "Rejected" ? "red" : "green", color: "white" }}
                />
            ),
        },
        { field: 'utr', headerName: 'UTR/Ref No.', width: 200 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => {
                        setSelectedPayment(params.row);
                        setOpenApprovalDialog(true);
                    }}
                >
                    Approve/Reject
                </Button>
            ),
        },
    ];

    return (
        <Box p={2}>
            <Typography variant="h4" textAlign="center" mb={3}>
                Approve or Reject Payments
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : (
                <Container maxWidth="md">
                    <DataGrid
                        rows={payments}
                        columns={columns}
                        paginationMode="server"
                        rowCount={total}
                        pageSize={limit}
                        onPaginationModelChange={(model) => {
                            changePage(model.page);
                            changeLimit(model.pageSize);
                        }}
                        loading={loading}
                        checkboxSelection={false}
                        disableSelectionOnClick
                        disableRowSelectionOnClick
                    />
                </Container>
            )}

            {/* Approval/Reject Dialog */}
            <Dialog open={openApprovalDialog} onClose={() => setOpenApprovalDialog(false)}>
                <DialogTitle>Approve or Reject Payment</DialogTitle>
                <DialogContent>
                    <form onSubmit={formik.handleSubmit}>
                        {formik.values.status === 'Approved' && (
                            <TextField
                                label="Confirm UPI ID"
                                fullWidth
                                margin="dense"
                                name="upiId"
                                value={formik.values.upiId}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.upiId && Boolean(formik.errors.upiId)}
                                helperText={formik.touched.upiId && formik.errors.upiId}
                            />
                        )}
                        <TextField
                            select
                            label="Status"
                            fullWidth
                            margin="dense"
                            name="status"
                            value={formik.values.status}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        >
                            <MenuItem value="Approved">Approve</MenuItem>
                            <MenuItem value="Rejected">Reject</MenuItem>
                        </TextField>
                        <DialogActions>
                            <Button onClick={() => setOpenApprovalDialog(false)} color="primary">
                                Cancel
                            </Button>
                            <Button type="submit" color="primary" disabled={saving}>
                                {saving ? <CircularProgress size={24} /> : 'Submit'}
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default QrCodes;
