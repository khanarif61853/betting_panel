import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid';
import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';
import {BASE_URL} from '../costants';
import upiqr from 'upiqr';

const validationSchema = Yup.object({
    platform: Yup.string().required('Platform is required'),
    payeeName: Yup.string().required('Payee Name is required'),
    upiId: Yup.string().required('UPI ID is required').email('Invalid UPI ID format'),
});

const QrCodes = () => {
    const [qrs, setQrs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [saving, setSaving] = useState(false);

    const fetchCodes = async () => {
        setLoading(true);
        try {
            const {data} = await axios.get(`${BASE_URL}/api/web/retrieve/qr-codes`, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });
            setQrs(data.type === 'success' && data.data ? data.data : []);
        } catch (err) {
            console.error('Error fetching qrs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCodes();
    }, []);

    const handleSaveQr = async (values) => {
        setSaving(true);
        try {
            const {qr} = await upiqr({
                payeeVPA: values.upiId,
                payeeName: values.payeeName,
            });
            const {data} = await axios.post(
                `${BASE_URL}/api/web/create/qr-code`,
                {platform: values.platform, payeeName: values.payeeName, upiId: values.upiId, imgBaseString: qr},
                {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                }
            );
            if (data.type === 'success') {
                setOpenDialog(false);
                fetchCodes();
            }
        } catch (err) {
            console.error('Error saving QR code:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/api/web/delete/qr-code/${id}`, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });
            fetchCodes();
        } catch (err) {
            console.error('Error deleting QR code:', err);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(
                `${BASE_URL}/api/web/status/qr-code/${id}`,
                {status: newStatus},
                {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                }
            );
            fetchCodes();
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    const columns = [
        {field: 'id', headerName: 'ID', width: 70},
        {field: 'platform', headerName: 'Platform', width: 150},
        {field: 'payeeName', headerName: 'Payee Name', width: 150},
        {
            field: 'imgBaseString', headerName: 'UPI ID', width: 200, renderCell: (params) => (
                 <img src={params.value} height={"100px"}/>
            ),
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => {
                console.log(params)
                return (
                <TextField
                    select
                    value={params.row.status}
                    onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
                    size="small"
                    fullWidth
                    sx={{
                        "& .MuiSelect-select": {
                            textAlign: "center",
                            alignSelf: "center",
                        },
                    }}
                >
                    <MenuItem value={true}>Active</MenuItem>
                    <MenuItem value={false}>Inactive</MenuItem>
                </TextField>
            )},
        },
        {field: 'upi', headerName: 'UPI ID', width: 200},

        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => handleDelete(params.row.id)}
                >
                    Delete
                </Button>
            ),
        },
    ];

    return (
        <Box p={2}>
            <Typography variant="h4" textAlign="center" mb={3}>
                QR Code Generator
            </Typography>
            <Box textAlign="center" mb={3}>
                <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
                    Add QR Code
                </Button>
            </Box>
            {loading ? (
                <CircularProgress/>
            ) : (
                <DataGrid rowHeight={ 100} rows={qrs} columns={columns} autoHeight/>
            )}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Add QR Code</DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={{platform: '', payeeName: '', upiId: ''}}
                        validationSchema={validationSchema}
                        onSubmit={(values, {resetForm}) => {
                            handleSaveQr(values);
                            resetForm();
                        }}
                    >
                        {({errors, touched, handleChange, values}) => (
                            <Form>
                                <Field
                                    as={TextField}
                                    select
                                    label="Payment Platform"
                                    fullWidth
                                    margin="dense"
                                    name="platform"
                                    value={values.platform}
                                    onChange={handleChange}
                                    error={touched.platform && Boolean(errors.platform)}
                                    helperText={touched.platform && errors.platform}
                                >
                                    <MenuItem value="BHIM">BHIM</MenuItem>
                                    <MenuItem value="Gpay">Gpay</MenuItem>
                                    <MenuItem value="PhonePay">PhonePay</MenuItem>
                                    <MenuItem value="Paytm">Paytm</MenuItem>
                                </Field>
                                <Field
                                    as={TextField}
                                    label="Payee Name"
                                    fullWidth
                                    margin="dense"
                                    name="payeeName"
                                    value={values.payeeName}
                                    onChange={handleChange}
                                    error={touched.payeeName && Boolean(errors.payeeName)}
                                    helperText={touched.payeeName && errors.payeeName}
                                />
                                <Field
                                    as={TextField}
                                    label="UPI ID"
                                    fullWidth
                                    margin="dense"
                                    name="upiId"
                                    value={values.upiId}
                                    onChange={handleChange}
                                    error={touched.upiId && Boolean(errors.upiId)}
                                    helperText={touched.upiId && errors.upiId}
                                />
                                <DialogActions>
                                    <Button onClick={() => setOpenDialog(false)} color="primary">
                                        Cancel
                                    </Button>
                                    <Button type="submit" color="primary" disabled={saving}>
                                        {saving ? <CircularProgress size={24}/> : 'Save'}
                                    </Button>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default QrCodes;
