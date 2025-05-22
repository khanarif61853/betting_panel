import {createTheme, ThemeProvider} from '@mui/material/styles';
import Box from '@mui/material/Box';
import {DataGrid} from '@mui/x-data-grid';
import axios from 'axios';
import CustomSnackbar from '../component/CustomSnackbar';
import {Select, MenuItem, FormControl, InputLabel, Chip, Grid, Typography} from '@mui/material';
import {
    Switch,
    IconButton,
    Avatar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    TextField,
    Fab,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {useFormik} from 'formik';
import {useNavigate} from 'react-router-dom';
import gamesSchema from '../schema/gamesSchema';
import {useEffect, useState} from 'react';
import {BASE_URL} from '../costants';
import moment from 'moment';
import {usePagination} from '../hooks/usePagination';
import {DemoContainer} from '@mui/x-date-pickers/internals/demo';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, } from '@mui/x-date-pickers';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { render } from 'react-dom';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
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
                },
            },
        },
    },
});


const Games = () => {

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [existingGames, setExistingGames] = useState([]);
    const [date, setDate] = useState(dayjs());

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [editingGame, setEditingGame] = useState(null); // State for editing game
    const {page, limit, total, changePage, changeLimit, changeTotal} = usePagination();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/web/retrieve/gamesName`, {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                        'ngrok-skip-browser-warning': true,
                    },
                });
                // if (response.data.type == "error") {
                //     console.log("sdjsaj")
                //     setError(response.data.message);
                // }
                setExistingGames(response.data.data); // Adjust based on the actual response structure
            } catch (err) {
                if (err.response) {
                    console.error('Error fetching data', err.response.data.message);
                    setError(err.response.data.message);
                } else {
                    console.error('Error fetching data', err.message);

                }
            }
        };

        fetchGames();
        const fetchData = async (page, limit) => {
            setLoading(true);
            try {
                const response = await axios.get(`${BASE_URL}/api/web/retrieve/games`, {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                        'ngrok-skip-browser-warning': true,
                    },
                    params: {
                        page,
                        limit,
                        startDateTime:date,

                    },
                });
                const games = response.data.data.games?.map((game) => ({
                    id: game.id,
                    name: game.name,
                    startDateTime: moment(game.startDateTime).utc().format('YYYY-MM-DD HH:mm:ss'),
                    endDateTime: moment(game.endDateTime).utc().format('YYYY-MM-DD HH:mm:ss'),
                    resultDateTime: moment(game.resultDateTime).utc().format('YYYY-MM-DD HH:mm:ss'),
                    image: game.image,
                    status: game.status,
                    finalBidNumber: game.finalBidNumber,
                }));
                setRows(games);
                changeTotal(response.data.data.total); // Assuming the API returns the total number of items
            } catch (err) {
                console.error('Error fetching data', err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData(page, limit);
    }, [page, limit, date]);
    const handlePageSizeChange = (newPageSize) => {
        changeLimit(newPageSize);
    };

    const handleStatusChange = async (id) => {
        setLoading(true);
        try {
            await axios.post(
                `${BASE_URL}/api/web/status/game`,
                {
                    status: !rows.find((row) => row.id === id).status,
                    id: id,
                },
                {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                        'ngrok-skip-browser-warning': true,
                    },
                }
            );
            setRows(rows?.map((row) => (row.id === id ? {...row, status: !row.status} : row)));
            setSuccess("Game status updated successfully");
        } catch (error) {
            console.error('Error updating game status', error.response.data.message);
            setError(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setError(null);
        setSuccess(null);
    };

    const handleEdit = (id) => {
        const gameToEdit = rows.find(row => row.id === id);
        setEditingGame(gameToEdit);
        formik.setValues({
            name: gameToEdit.name,
            startDateTime: gameToEdit.startDateTime,
            endDateTime: gameToEdit.endDateTime,
            resultDateTime: gameToEdit.resultDateTime,
            image: null,
        });
        setOpenAddDialog(true);
    };

    const handleDelete = async () => {
        if (deleteId === null) return;
        setLoading(true);
        try {
            let response = await axios.delete(`${BASE_URL}/api/web/delete/game`, {
                params: {id: deleteId},
                headers: {
                    Authorization: localStorage.getItem('token'),
                    'ngrok-skip-browser-warning': true,
                },
            });
            if (response.data.type == "error") {
                // setRows(rows.filter((row) => row.id !== deleteId));
                setError(response.data.message);
                return
            }
            setRows(rows.filter((row) => row.id !== deleteId));
            setSuccess("Game deleted successfully");
        } catch (error) {
            console.error('Error deleting game', error.response.data.message);
            setError(error.response.data.message);
        } finally {
            setLoading(false);
            setOpenDialog(false);
            setDeleteId(null);
        }
    };

    const handleOpenDialog = (id) => {
        setDeleteId(id);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setDeleteId(null);
    };

    const handleAddOrEditGame = async (values) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('startDateTime', values.startDateTime);
        formData.append('endDateTime', values.endDateTime);
        formData.append('resultDateTime', values.resultDateTime);
        if (values.image) formData.append('image', values.image);
        setOpenAddDialog(false);

        try {
            if (editingGame){
                try {
                    await axios.put(`${BASE_URL}/api/web/update/game`, formData, {
                        params: {id: editingGame.id},
                        headers: {
                            "Authorization": localStorage.getItem('token'),
                            'ngrok-skip-browser-warning': true,
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    setRows(rows?.map((row) => (row.id === editingGame.id ? {...row, ...values} : row)));
                    setSuccess("Game updated successfully");
                } catch (err) {
                    return setError(err.message)
                }
            } else {
                const response = await axios.post(`${BASE_URL}/api/web/create/game`, formData, {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                        'ngrok-skip-browser-warning': true,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                if (response.data.type == "success") {
                    // console.log(rows,"-----------------------rows")
                    // console.log(response.data.data)
                    setRows([response.data.data, ...rows]);
                    setError(null)
                    setSuccess("Game added successfully");
                } else {
                    setError(response.data.message)
                }
            }
        } catch (error) {
            console.error('Error adding/updating game', error.response.data.message);
            setError(error.response.data.message);
        } finally {
            setLoading(false);
            setEditingGame(null);
        }
    };
    // const formatDateTimeLocal = (dateString) => {
    //     const date = new Date(dateString);
    //     const pad = (num) => (num < 10 ? '0' : '') + num;
    //     return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    // };

    const formik = useFormik({
        initialValues: {
            name: editingGame ? editingGame.name : '',
            startDateTime: editingGame ? moment(editingGame.startDateTime).format('YYYY-MM-DD HH:mm:ss') : '',
            endDateTime: editingGame ? moment(editingGame.endDateTime).format('YYYY-MM-DD HH:mm:ss') : '',
            resultDateTime: editingGame ? moment(editingGame.resultDateTime).format('YYYY-MM-DD HH:mm:ss') : '',
            image: null,
        },
        validationSchema: gamesSchema,
        onSubmit: (values) => {
            handleAddOrEditGame(values);
        },
        enableReinitialize: true, // Reinitialize form when editingGame changes
    });


    const handleAddDialogClose = () => {
        setOpenAddDialog(false);
        formik.resetForm();
        setEditingGame(null);
    };

    const columns = [
        {field: 'id', headerName: 'ID', width: 90},
        {field: 'name', headerName: 'Name', width: 150},
        {field: 'startDateTime', headerName: 'Start Date Time', width: 200},
        {field: 'endDateTime', headerName: 'End Date Time', width: 200},
        {field: 'resultDateTime', headerName: 'Result Date Time', width: 200},
        {
            field: 'image',
            headerName: 'Image',
            width: 150,
            renderCell: ({row}) => (
                <Avatar src={`${BASE_URL}/img/game/` + row.image} variant="rounded">
                    {row.name[0]}
                </Avatar>
            ),
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: ({row}) => (
                <Switch
                    size="small"
                    checked={Boolean(row.status)}
                    color="warning"
                    onChange={() => handleStatusChange(row.id)}
                    onClick={(e) => {
                        e.stopPropagation()
                    }}
                    inputProps={{'aria-label': 'controlled'}}
                />
            ),
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 130,
            renderCell: ({row}) => (
                <div>
                    <IconButton color="primary" sx={{color: "purple"}} onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(row.id);
                    }} aria-label="edit">
                        <EditIcon/>
                    </IconButton>
                    <IconButton color="secondary" onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDialog(row.id);
                    }} aria-label="delete">
                        <DeleteIcon/>
                    </IconButton>
                    <IconButton sx={{color: "#4389A2"}} onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/game/?id=${row.id}`);
                    }} aria-label="send">
                        <SendIcon/>
                    </IconButton>
                </div>
            ),
        },
        {
            field: 'finaljantri',
            headerName: 'Final Jantri',
            width: 150,
            textAlign: "center",
            renderCell: ({row}) => ( 
            <div>
                <Chip label={"Click"} sx={{textAlign:"center",marginLeft:2,cursor:"pointer"}} color="primary" onClick={()=> navigate("/final-jantri")}/>
            </div>
            )
        },
         {
            field: 'result',
            headerName: 'Result',
            width: 150,
            textAlign: "center",
            renderCell: ({row}) => (
                <div>
                    {/* {console.log(row)} */}
                    {row.finalBidNumber != null ?
                        <Chip label={row.finalBidNumber} sx={{bgcolor: "#ff1744", color: "white"}}/> :
                        <Chip label={"Not Declared"} color="primary"/>}
                </div>
            ),
        },
    ];

    const CustomDataGrid = ({rows}) => {
        const [filter, setFilter] = useState('all');

        const handleFilterChange = (event) => {
            setFilter(event.target.value);
        };

        const filteredRows = rows.filter(row => {
            if (filter === 'all') return true;
            if (filter === 'declared') return row.finalBidNumber !== null;
            if (filter === 'notDeclared') return row.finalBidNumber === null;
        });
        // console.log(filteredRows)

        const handleDateChange = (newDate) => {
            setDate(newDate);
            console.log(newDate.$d); // Log the JavaScript Date object
        };
        return (
            <>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid container alignItems={"center"} mb={2} justifyContent={"flex-between"}>
                        <Grid item  xs={5} display={"flex"} alignItems={"center"}>
                            <Typography variant="h6" paddingX={1}>
                                Result:
                            </Typography>
                            <Select value={filter} onChange={handleFilterChange}>
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="declared">Declared</MenuItem>
                                <MenuItem value="notDeclared">Not Declared</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={5}display={"flex"} alignItems={"center"}>
                            <Typography variant="h6" paddingX={1}>
                                Start Date:
                            </Typography>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker
                                    // minDate={dayjs()}
                                    label="Basic date picker"
                                    value={date}
                                    onChange={handleDateChange}
                                />
                            </DemoContainer>
                        </Grid>



                    </Grid>
                    <Grid container alignItems={"center"} mb={2}>

                    </Grid>
                    <div style={{height: 450, width: '100%'}}> {/* Set the height and width of the DataGrid */}

                        <DataGrid
                            rows={filteredRows}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: {pageSize: limit, page},
                                },
                            }}
                            paginationMode='server'
                            rowCount={total}
                            pageSize={limit}
                            checkboxSelection
                            onPaginationModelChange={(value) => {
                                if (value.pageSize != limit) {
                                    // console.log(value.page, value.pageSize)
                                    changeLimit(value.pageSize)
                                    return changePage(0)
                                }
                                changePage(value.page)
                                changeLimit(value.pageSize)
                            }}
                            disableSelectionOnClick
                            loading={loading}
                        />
                    </div>
                </LocalizationProvider>

            </>
        );
    };


    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
                minHeight: 550,
                width: '100%',
                backgroundColor: '#f0f4f7',
                borderRadius: '8px',
                padding: '16px',
                position: 'relative'
            }}>
                <CustomDataGrid rows={rows}/>

                {/* <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 25, page: 0 },
                        },
                    }}
                    autosizeOptions={{
                        columns: ['name',],
                        includeOutliers: true,
                        includeHeaders: true,
                    }}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    disableSelectionOnClick
                    loading={loading}
                /> */}
                {/* {loading && (
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute' }}
                        open={loading}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                )} */}
                <CustomSnackbar
                    open={!!error || !!success}
                    handleClose={handleCloseSnackbar}
                    message={error || success}
                    severity={error ? "error" : "success"}
                />
            </Box>
            <Fab aria-label="add" color={"primary"} onClick={() => setOpenAddDialog(true)}
                 sx={{background: "#614385", color: "white", position: 'fixed', bottom: 16, right: 16}}>
                <AddIcon/>
            </Fab>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{"Confirm Deletion"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this game?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="secondary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openAddDialog} onClose={handleAddDialogClose}>
                <DialogTitle>{editingGame ? 'Edit Game' : 'Add New Game'}</DialogTitle>
                <DialogContent>
                    <form onSubmit={formik.handleSubmit}>
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Select Game</InputLabel>
                            <Select
                                label="Select Game"
                                value={formik.values.name}
                                onChange={(event) => {
                                    formik.setFieldValue('name', event.target.value);
                                }}
                            >
                                {existingGames?.map((game, index) => (
                                    <MenuItem key={index} value={game.name}>
                                        {game.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            margin="dense"
                            label="Or Enter New Game Name"
                            name='name'
                            type="text"
                            fullWidth
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                        <TextField
                            margin="dense"
                            name='startDateTime'
                            label="Start Date Time"
                            type="datetime-local"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={formik.values.startDateTime}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.startDateTime && Boolean(formik.errors.startDateTime)}
                            helperText={formik.touched.startDateTime && formik.errors.startDateTime}
                        />
                        <TextField
                            margin="dense"
                            label="End Date Time"
                            name='endDateTime'
                            type="datetime-local"
                            fullWidth
                            value={formik.values.endDateTime}
                            onChange={formik.handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onBlur={formik.handleBlur}
                            error={formik.touched.endDateTime && Boolean(formik.errors.endDateTime)}
                            helperText={formik.touched.endDateTime && formik.errors.endDateTime}
                        />
                        <TextField
                            margin="dense"
                            label="Result Date Time"
                            name='resultDateTime'
                            type="datetime-local"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={formik.values.resultDateTime}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.resultDateTime && Boolean(formik.errors.resultDateTime)}
                            helperText={formik.touched.resultDateTime && formik.errors.resultDateTime}
                        />
                        <TextField
                            margin="dense"
                            label="Image"
                            name='image'
                            type="file"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={(event) => formik.setFieldValue('image', event.currentTarget.files[0])}
                            error={formik.touched.image && Boolean(formik.errors.image)}
                            helperText={formik.touched.image && formik.errors.image}
                        />
                        <DialogActions>
                            <Button onClick={handleAddDialogClose} color="primary">
                                Cancel
                            </Button>
                            <Button type="submit" color="secondary">
                                {editingGame ? 'Update Game' : 'Add Game'}
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </ThemeProvider>
    );
};

export default Games;


/*
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import CustomSnackbar from '../component/CustomSnackbar';
import {
    Switch,
    CircularProgress,
    IconButton,
    Avatar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    TextField,
    Fab,
    Backdrop
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import gamesSchema from '../schema/gamesSchema';
import * as Yup from 'yup';
import { debounce } from 'lodash';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
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
                },
            },
        },
    },
});

const Games = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [editingGame, setEditingGame] = useState(null);
    const [formValues, setFormValues] = useState({
        name: '',
        startDateTime: '',
        endDateTime: '',
        resultDateTime: '',
        image: null,
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:3000/api/web/retrieve/games', {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                        'ngrok-skip-browser-warning': true,
                    },
                });
                const games = response.data.data?.map((game) => ({
                    id: game.id,
                    name: game.name,
                    startDateTime: game.startDateTime,
                    endDateTime: game.endDateTime,
                    resultDateTime: game.resultDateTime,
                    image: game.image,
                    status: game.status,
                }));
                setRows(games);
            } catch (error) {
                console.error('Error fetching data', error.response.data.message);
                setError(error.response.data.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleStatusChange = useCallback(async (id) => {
        setLoading(true);
        try {
            await axios.post(
                `http://localhost:3000/api/web/status/game`,
                {
                    status: !rows.find((row) => row.id === id).status,
                    id: id,
                },
                {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                        'ngrok-skip-browser-warning': true,
                    },
                }
            );
            setRows((prevRows) =>
                prevRows?.map((row) => (row.id === id ? { ...row, status: !row.status } : row))
            );
            setSuccess("Game status updated successfully");
        } catch (error) {
            console.error('Error updating game status', error.response.data.message);
            setError(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }, [rows]);

    const handleCloseSnackbar = useCallback(() => {
        setError(null);
        setSuccess(null);
    }, []);

    const handleEdit = useCallback((id) => {
        const gameToEdit = rows.find(row => row.id === id);
        setEditingGame(gameToEdit);
        setFormValues({
            name: gameToEdit.name,
            startDateTime: formatDateTimeLocal(gameToEdit.startDateTime),
            endDateTime: formatDateTimeLocal(gameToEdit.endDateTime),
            resultDateTime: formatDateTimeLocal(gameToEdit.resultDateTime),
            image: null,
        });
        setOpenAddDialog(true);
    }, [rows]);

    const handleDelete = useCallback(async () => {
        if (deleteId === null) return;
        setLoading(true);
        try {
            await axios.delete(`http://localhost:3000/api/web/delete/game`, {
                params: { id: deleteId },
                headers: {
                    Authorization: localStorage.getItem('token'),
                    'ngrok-skip-browser-warning': true,
                },
            });
            setRows((prevRows) => prevRows.filter((row) => row.id !== deleteId));
            setSuccess("Game deleted successfully");
        } catch (error) {
            console.error('Error deleting game', error.response.data.message);
            setError(error.response.data.message);
        } finally {
            setLoading(false);
            setOpenDialog(false);
            setDeleteId(null);
        }
    }, [deleteId]);

    const handleOpenDialog = useCallback((id) => {
        setDeleteId(id);
        setOpenDialog(true);
    }, []);

    const handleCloseDialog = useCallback(() => {
        setOpenDialog(false);
        setDeleteId(null);
    }, []);

    const handleAddOrEditGame = useCallback(async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('name', formValues.name);
        formData.append('startDateTime', formValues.startDateTime);
        formData.append('endDateTime', formValues.endDateTime);
        formData.append('resultDateTime', formValues.resultDateTime);
        if (formValues.image) formData.append('image', formValues.image);
        setOpenAddDialog(false);

        try {
            if (editingGame) {
                await axios.put(`/${editingGame.id}`, formData, {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                        'ngrok-skip-browser-warning': true,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setRows((prevRows) =>
                    prevRows?.map((row) => (row.id === editingGame.id ? { ...row, ...formValues } : row))
                );
                setSuccess("Game updated successfully");
            } else {
                const response = await axios.post(`http://localhost:3000/api/web/create/game`, formData, {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                        'ngrok-skip-browser-warning': true,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                if (response.data.message === "success") {
                    setRows((prevRows) => [...prevRows, response.data.data]);
                    setError(null);
                    setSuccess("Game added successfully");
                } else {
                    setError(response.data.message);
                }
            }
        } catch (error) {
            console.error('Error adding/updating game', error.response.data.message);
            setError(error.response.data.message);
        } finally {
            setLoading(false);
            setEditingGame(null);
        }
    }, [formValues, editingGame]);

    const formatDateTimeLocal = (dateString) => {
        const date = new Date(dateString);
        const pad = (num) => (num < 10 ? '0' : '') + num;
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    const handleAddDialogClose = useCallback(() => {
        setOpenAddDialog(false);
        setFormValues({
            name: '',
            startDateTime: '',
            endDateTime: '',
            resultDateTime: '',
            image: null,
        });
        setEditingGame(null);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const { name } = e.target;
        const file = e.target.files[0];
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: file,
        }));
    };

    const columns = useMemo(() => [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'startDateTime', headerName: 'Start Date Time', width: 200 },
        { field: 'endDateTime', headerName: 'End Date Time', width: 200 },
        { field: 'resultDateTime', headerName: 'Result Date Time', width: 200 },
        {
            field: 'image',
            headerName: 'Image',
            width: 200,
            renderCell: ({ row }) => (
                <Box display="flex" justifyContent="center" alignItems="center" width="100%">
                    <Avatar alt={row.name} src={`http://localhost:3000/img/game/` + row.image}>
                        {row.name[0]}
                    </Avatar>
                </Box>
            ),
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: ({ row }) => (
                <Switch
                    checked={Boolean(row.status)}
                    onChange={() => handleStatusChange(row.id)}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            ),
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 200,
            renderCell: ({ row }) => (
                <div>
                    <IconButton color="primary" onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(row.id);
                    }} aria-label="edit">
                        <EditIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDialog(row.id);
                    }} aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                    <IconButton color="success" onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/game/?id=${row.id}`);
                    }} aria-label="send">
                        <SendIcon />
                    </IconButton>
                </div>
            ),
        },
    ], [rows, handleEdit, handleOpenDialog, handleStatusChange, navigate]);

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ height: 550, width: '100%', backgroundColor: '#f0f4f7', borderRadius: '8px', padding: '16px', position: 'relative' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 25, page: 0 },
                        },
                    }}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    disableSelectionOnClick
                />
                {loading && (
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute' }}
                        open={loading}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                )}
                <CustomSnackbar
                    open={!!error || !!success}
                    handleClose={handleCloseSnackbar}
                    message={error || success}
                    severity={error ? "error" : "success"}
                />
            </Box>
            <Fab aria-label="add" color={"primary"} onClick={() => setOpenAddDialog(true)} sx={{ background: "#614385", color: "white", position: 'absolute', bottom: 16, right: 16 }}>
                <AddIcon />
            </Fab>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{"Confirm Deletion"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this game?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="secondary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openAddDialog} onClose={handleAddDialogClose}>
                <DialogTitle>{editingGame ? 'Edit Game' : 'Add New Game'}</DialogTitle>
                <DialogContent>
                    <form onSubmit={(e) => { e.preventDefault(); handleAddOrEditGame(); }}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Name"
                            name='name'
                            type="text"
                            fullWidth
                            value={formValues.name}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="dense"
                            name='startDateTime'
                            label="Start Date Time"
                            type="datetime-local"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={formValues.startDateTime}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="dense"
                            label="End Date Time"
                            name='endDateTime'
                            type="datetime-local"
                            fullWidth
                            value={formValues.endDateTime}
                            onChange={handleInputChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            margin="dense"
                            label="Result Date Time"
                            name='resultDateTime'
                            type="datetime-local"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={formValues.resultDateTime}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="dense"
                            label="Image"
                            name='image'
                            type="file"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={handleFileChange}
                        />
                        <DialogActions>
                            <Button onClick={handleAddDialogClose} color="primary">
                                Cancel
                            </Button>
                            <Button type="submit" color="secondary">
                                {editingGame ? 'Update Game' : 'Add Game'}
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </ThemeProvider>
    );
};

export default Games;


*/
// import React, { useEffect, useState } from 'react';
// import { Box, Typography, Button, Pagination, Grid, Dialog, DialogActions, DialogContent, DialogTitle, TextField, CircularProgress, IconButton, Snackbar, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
// import axios from 'axios';
// import { useFormik } from 'formik';
// import GameCard from '../component/GameCard'; // Adjust path as needed
// import CustomSnackbar from '../component/CustomSnackbar';
// import gamesSchema from '../schema/gamesSchema';
// import moment from 'moment';
// import CloseIcon from '@mui/icons-material/Close';
// import { BASE_URL } from '../costants';

// const Games = () => {
//     const [games, setGames] = useState([]);
//     const [filteredGames, setFilteredGames] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [gamesPerPage] = useState(6);
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(null);
//     const [openDialog, setOpenDialog] = useState(false);
//     const [deleteId, setDeleteId] = useState(null);
//     const [openAddDialog, setOpenAddDialog] = useState(false);
//     const [editingGame, setEditingGame] = useState(null);
//     const [filterDate, setFilterDate] = useState({ start: '', end: '' });
//     const [filterResult, setFilterResult] = useState('');

//     const fetchGames = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get(`${BASE_URL}/api/web/retrieve/games`, {
//                 headers: {
//                     Authorization: localStorage.getItem('token'),
//                     'ngrok-skip-browser-warning': true,
//                 },
//             });
//             const games = response.data.data?.map((game) => ({
//                 id: game.id,
//                 name: game.name,
//                 startDateTime: moment(game.startDateTime).format('YYYY-MM-DD HH:mm:ss'),
//                 endDateTime: moment(game.endDateTime).format('YYYY-MM-DD HH:mm:ss'),
//                 resultDateTime: moment(game.resultDateTime).format('YYYY-MM-DD HH:mm:ss'),
//                 image: game.image,
//                 status: game.status,
//                 finalBidNumber: game.finalBidNumber,
//             }));
//             setGames(games);
//             setFilteredGames(games);
//         } catch (err) {
//             console.error('Error fetching data', err.response?.data?.message || err.message);
//             setError(err.response?.data?.message || err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchGames();
//     }, []);

//     useEffect(() => {
//         applyFilters();
//     }, [filterDate, filterResult, games]);

//     const applyFilters = () => {
//         let filtered = [...games];
//         if (filterDate.start && filterDate.end) {
//             filtered = filtered.filter(game =>
//                 moment(game.startDateTime).isBetween(filterDate.start, filterDate.end, null, '[]')
//             );
//         }
//         if (filterResult) {
//             filtered = filtered.filter(game => (filterResult === 'declared' ? game.finalBidNumber : !game.finalBidNumber));
//         }
//         setFilteredGames(filtered);
//     };

//     const handleEdit = (id) => {
//         const gameToEdit = games.find(game => game.id === id);
//         setEditingGame(gameToEdit);
//         formik.setValues({
//             name: gameToEdit.name,
//             startDateTime: gameToEdit.startDateTime,
//             endDateTime: gameToEdit.endDateTime,
//             resultDateTime: gameToEdit.resultDateTime,
//             image: null,
//         });
//         setOpenAddDialog(true);
//     };

//     const handleDelete = async () => {
//         if (deleteId === null) return;
//         setLoading(true);
//         try {
//             await axios.delete(`${BASE_URL}/api/web/delete/game`, {
//                 params: { id: deleteId },
//                 headers: {
//                     Authorization: localStorage.getItem('token'),
//                     'ngrok-skip-browser-warning': true,
//                 },
//             });
//             setGames(games.filter((game) => game.id !== deleteId));
//             setSuccess("Game deleted successfully");
//         } catch (error) {
//             console.error('Error deleting game', error.response?.data?.message || error.message);
//             setError(error.response?.data?.message || error.message);
//         } finally {
//             setLoading(false);
//             setOpenDialog(false);
//             setDeleteId(null);
//         }
//     };

//     const handleAddOrEditGame = async (values) => {
//         setLoading(true);
//         const formData = new FormData();
//         formData.append('name', values.name);
//         formData.append('startDateTime', values.startDateTime);
//         formData.append('endDateTime', values.endDateTime);
//         formData.append('resultDateTime', values.resultDateTime);
//         if (values.image) formData.append('image', values.image);
//         setOpenAddDialog(false);

//         try {
//             if (editingGame) {
//                 await axios.put(`${BASE_URL}/api/web/update/game`, formData, {
//                     params: { id: editingGame.id },
//                     headers: {
//                         Authorization: localStorage.getItem('token'),
//                         'ngrok-skip-browser-warning': true,
//                         'Content-Type': 'multipart/form-data',
//                     },
//                 });
//                 setGames(games.map((game) => (game.id === editingGame.id ? { ...game, ...values } : game)));
//                 setSuccess("Game updated successfully");
//             } else {
//                 const response = await axios.post(`${BASE_URL}/api/web/create/game`, formData, {
//                     headers: {
//                         Authorization: localStorage.getItem('token'),
//                         'ngrok-skip-browser-warning': true,
//                         'Content-Type': 'multipart/form-data',
//                     },
//                 });
//                 setGames([...games, response.data.data]);
//                 setSuccess("Game added successfully");
//             }
//         } catch (error) {
//             console.error('Error adding/updating game', error.response?.data?.message || error.message);
//             setError(error.response?.data?.message || error.message);
//         } finally {
//             setLoading(false);
//             setEditingGame(null);
//         }
//     };

//     const handlePageChange = (event, newPage) => {
//         setCurrentPage(newPage);
//     };

//     const indexOfLastGame = currentPage * gamesPerPage;
//     const indexOfFirstGame = indexOfLastGame - gamesPerPage;
//     const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);

//     const formik = useFormik({
//         initialValues: {
//             name: '',
//             startDateTime: '',
//             endDateTime: '',
//             resultDateTime: '',
//             image: null,
//         },
//         validationSchema: gamesSchema,
//         onSubmit: (values) => {
//             handleAddOrEditGame(values);
//         },
//     });

//     const handleOpenDialog = (id) => {
//         setDeleteId(id);
//         setOpenDialog(true);
//     };

//     const handleCloseDialog = () => {
//         setOpenDialog(false);
//         setDeleteId(null);
//     };

//     const handleFileChange = (event) => {
//         formik.setFieldValue('image', event.currentTarget.files[0]);
//     };

//     return (
//         <Box sx={{ padding: 2, backgroundColor: '#f0f4f7' }}>
//             {loading ? (
//                 <CircularProgress />
//             ) : (
//                 <>
//                     <Box sx={{ marginBottom: 2 }}>
//                         <FormControl fullWidth>
//                             <InputLabel>Filter by Result</InputLabel>
//                             <Select
//                                 value={filterResult}
//                                 onChange={(e) => setFilterResult(e.target.value)}
//                                 label="Filter by Result"
//                             >
//                                 <MenuItem value="">All</MenuItem>
//                                 <MenuItem value="declared">Declared</MenuItem>
//                                 <MenuItem value="notDeclared">Not Declared</MenuItem>
//                             </Select>
//                         </FormControl>
//                         <TextField
//                             fullWidth
//                             margin="normal"
//                             type="date"
//                             label="Start Date"
//                             InputLabelProps={{ shrink: true }}
//                             value={filterDate.start}
//                             onChange={(e) => setFilterDate(prev => ({ ...prev, start: e.target.value }))}
//                             sx={{ marginRight: 1 }}
//                         />
//                         <TextField
//                             fullWidth
//                             margin="normal"
//                             type="date"
//                             label="End Date"
//                             InputLabelProps={{ shrink: true }}
//                             value={filterDate.end}
//                             onChange={(e) => setFilterDate(prev => ({ ...prev, end: e.target.value }))}
//                         />
//                     </Box>
//                     <Grid container spacing={2}>
//                         {currentGames.map(game => (
//                             <Grid item xs={12} sm={6} md={4} lg={3} key={game.id}>
//                                 <GameCard
//                                     game={game}
//                                     onEdit={handleEdit}
//                                     onDelete={handleOpenDialog}
//                                     onView={(id) => console.log(`View game ${id}`)} // Adjust view functionality as needed
//                                 />
//                             </Grid>
//                         ))}
//                     </Grid>
//                     <Pagination
//                         count={Math.ceil(filteredGames.length / gamesPerPage)}
//                         page={currentPage}
//                         onChange={handlePageChange}
//                         sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
//                     />
//                 </>
//             )}
//             <Dialog open={openDialog} onClose={handleCloseDialog}>
//                 <DialogTitle>Confirm Deletion</DialogTitle>
//                 <DialogActions>
//                     <Button onClick={handleCloseDialog}>Cancel</Button>
//                     <Button onClick={handleDelete} color="error">Delete</Button>
//                 </DialogActions>
//             </Dialog>
//             <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
//                 <DialogTitle>{editingGame ? 'Edit Game' : 'Add Game'}</DialogTitle>
//                 <DialogContent>
//                     <form onSubmit={formik.handleSubmit}>
//                         <TextField
//                             fullWidth
//                             margin="normal"
//                             id="name"
//                             name="name"
//                             label="Game Name"
//                             value={formik.values.name}
//                             onChange={formik.handleChange}
//                             error={formik.touched.name && Boolean(formik.errors.name)}
//                             helperText={formik.touched.name && formik.errors.name}
//                         />
//                         <TextField
//                             fullWidth
//                             margin="normal"
//                             id="startDateTime"
//                             name="startDateTime"
//                             label="Start DateTime"
//                             type="datetime-local"
//                             InputLabelProps={{ shrink: true }}
//                             value={formik.values.startDateTime}
//                             onChange={formik.handleChange}
//                             error={formik.touched.startDateTime && Boolean(formik.errors.startDateTime)}
//                             helperText={formik.touched.startDateTime && formik.errors.startDateTime}
//                         />
//                         <TextField
//                             fullWidth
//                             margin="normal"
//                             id="endDateTime"
//                             name="endDateTime"
//                             label="End DateTime"
//                             type="datetime-local"
//                             InputLabelProps={{ shrink: true }}
//                             value={formik.values.endDateTime}
//                             onChange={formik.handleChange}
//                             error={formik.touched.endDateTime && Boolean(formik.errors.endDateTime)}
//                             helperText={formik.touched.endDateTime && formik.errors.endDateTime}
//                         />
//                         <TextField
//                             fullWidth
//                             margin="normal"
//                             id="resultDateTime"
//                             name="resultDateTime"
//                             label="Result DateTime"
//                             type="datetime-local"
//                             InputLabelProps={{ shrink: true }}
//                             value={formik.values.resultDateTime}
//                             onChange={formik.handleChange}
//                             error={formik.touched.resultDateTime && Boolean(formik.errors.resultDateTime)}
//                             helperText={formik.touched.resultDateTime && formik.errors.resultDateTime}
//                         />
//                         <Button
//                             variant="contained"
//                             component="label"
//                             sx={{ marginTop: 2 }}
//                         >
//                             Upload Image
//                             <input
//                                 type="file"
//                                 hidden
//                                 onChange={handleFileChange}
//                             />
//                         </Button>
//                         <DialogActions>
//                             <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
//                             <Button type="submit" color="primary">
//                                 {editingGame ? 'Update Game' : 'Add Game'}
//                             </Button>
//                         </DialogActions>
//                     </form>
//                 </DialogContent>
//             </Dialog>
//             <CustomSnackbar open={Boolean(error)} message={error} severity="error" />
//             <CustomSnackbar open={Boolean(success)} message={success} severity="success" />
//         </Box>
//     );
// };

// export default Games;
