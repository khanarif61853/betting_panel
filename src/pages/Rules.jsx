import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    Typography,
    TextField,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Card,
    CardContent,
    CardMedia,
    CardActions,
    IconButton,
    Grid
} from '@mui/material';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {BASE_URL} from '../costants';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomSnackbar from '../component/CustomSnackbar';

const theme = createTheme({
    palette: {
        primary: {main: '#1976d2'},
        secondary: {main: '#d32f2f'},
        success: {main: '#2e7d32'},
    },
    typography: {
        fontFamily: 'Arial, sans-serif',
    },
});

const Rules = () => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [saving, setSaving] = useState(false);  // State for save button loading
    const [editingRule, setEditingRule] = useState(null);  // State for editing a specific rule

    // Fetch the rules data from the API
    const fetchRules = async () => {
        setLoading(true); // Set loading to true when fetching data
        try {
            const {data} = await axios.get(`${BASE_URL}/api/web/retrieve/rules`, {
                headers: {
                    "Authorization": localStorage.getItem('token')
                }
            });
            if (data.type === "success" && data.data) {
                setRules(data.data); // Set the rules data received from the API
            } else {
                setRules([]); // If no rules data exists, set rules to empty array
            }
        } catch (err) {
            console.error('Error fetching rules:', err);
        } finally {
            setLoading(false); // Set loading to false once the fetch is complete
        }
    };

    useEffect(() => {
        fetchRules();
    }, []);

    const handleAddEditClick = (rule = null) => {
        setEditingRule(rule);  // Set the rule being edited
        setDescription(rule ? rule.description : '');  // Set description if editing
        setImage(null);  // Reset image input
        setOpenDialog(true);  // Open dialog to add or edit rule
    };

    const handleSaveRule = async () => {
        setSaving(true);  // Set saving state to true
        try {
            const formData = new FormData();
            formData.append('description', description);
            if (image) {
                formData.append('image', image);
            }

            const url = editingRule
                ? `${BASE_URL}/api/web/create/rules/${editingRule.id}`
                : `${BASE_URL}/api/web/create/rules`;
            const method = editingRule ? 'put' : 'post';

            const {data} = await axios({
                method, url, data: formData, headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": localStorage.getItem('token')
                }
            });

            if (data.type === "success") {
                setOpenDialog(false);
                setDescription('');
                setImage(null);
                setEditingRule(null);
                fetchRules();  // Re-fetch rules data to update the UI
                // Optionally show success message in snackbar
            } else {
                // Optionally handle unsuccessful response (e.g., show an error message in snackbar)
            }
        } catch (err) {
            console.error('Error saving rule:', err);
            // Optionally show an error message in snackbar
        } finally {
            setSaving(false);  // Set saving state to false once the request is complete
        }
    };

    const handleDeleteRule = async (ruleId) => {
        setLoading(true); // Show loading indicator during deletion
        try {
            const {data} = await axios.delete(`${BASE_URL}/api/web/delete/rule/${ruleId}`,{
                headers:{
                    "Authorization":localStorage.getItem("token")
                }
            });
            if (data.type === "success") {
                fetchRules();  // Re-fetch rules data to update the UI
                // Optionally show success message in snackbar
            } else {
                // Optionally handle unsuccessful response (e.g., show an error message in snackbar)
            }
        } catch (err) {
            console.error('Error deleting rule:', err);
            // Optionally show an error message in snackbar
        } finally {
            setLoading(false);  // Hide loading indicator after deletion
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box p={2}>
                <Typography variant="h4" my={2} textAlign="center" fontWeight="bold">
                    Rules
                </Typography>

                <Box textAlign="center" mb={3}>
                    <Button variant="contained" color="primary" onClick={() => handleAddEditClick()}>
                        Add Rule
                    </Button>
                </Box>

                {loading ? (
                    <CircularProgress/>
                ) : (
                    <Grid container spacing={3}>
                        {rules.length > 0 ? (
                            rules.map((rule) => (
                                <Grid item key={rule.id} xs={12} sm={6} md={4}>
                                    <Card sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                                        <CardMedia
                                            component="img"
                                            sx={{height: 200, objectFit: 'contain'}}
                                            image={`${BASE_URL}/img/rules/${rule.image}`}
                                            alt="Rule"
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {rule.description}
                                            </Typography>
                                        </CardContent>
                                        <CardActions sx={{justifyContent: 'space-between'}}>
                                            <IconButton onClick={() => handleAddEditClick(rule)}>
                                                <EditIcon color="primary"/>
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteRule(rule.id)}>
                                                <DeleteIcon color="secondary"/>
                                            </IconButton>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Box textAlign="center" width="100%">
                                <Typography variant="h6" gutterBottom>
                                    No rules found.
                                </Typography>
                            </Box>
                        )}
                    </Grid>
                )}

                {/* Dialog for Adding or Editing the Rule */}
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>{editingRule ? 'Edit Rule' : 'Add Rule'}</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Rule Description"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <Box mt={2}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSaveRule} color="primary" disabled={saving}>
                            {saving ? <CircularProgress size={24}/> : 'Save'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </ThemeProvider>
    );
};

export default Rules;
