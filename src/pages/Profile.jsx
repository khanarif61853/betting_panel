import React, { useState } from 'react';
import { TextField, Button, Grid, Paper, Typography, Box, IconButton, Avatar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

// Profile Page Component
const Profile = () => {
  const [editingField, setEditingField] = useState(null);
  const [fields, setFields] = useState({
    name: 'John Doe',
    mobile: '123-456-7890',
    email: 'john.doe@example.com',
    password: '********',
  });
  const [originalFields, setOriginalFields] = useState(fields);

  const handleEdit = (field) => {
    setEditingField(field);
  };

  const handleChange = (event) => {
    setFields({
      ...fields,
      [event.target.name]: event.target.value,
    });
  };

  const handleSave = () => {
    // Call update API
    console.log('Updated fields:', fields);
    setOriginalFields(fields);
    setEditingField(null);
  };

  const handleResetPassword = () => {
    // Call reset password API
    console.log('Resetting password...');
  };

  const handleCancel = () => {
    setFields(originalFields);
    setEditingField(null);
  };

  const isEditable = (field) => editingField === field;

  return (
    <Paper sx={{ padding: 3, maxWidth: 900, margin: 'auto', backgroundColor: '#f5f5f5', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Profile Page
      </Typography>
      <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
        <Box sx={{ position: 'relative', '&:hover .edit-button': { display: 'block' } }}>
          <Avatar src="https://via.placeholder.com/120" sx={{ width: 120, height: 120, fontSize: 48 }} />
          <IconButton className="edit-button" sx={{
            position: 'absolute',
            bottom: 1,
            right: 1,
            backgroundColor: '#ffffff',
            display: 'none',
            '&:hover': { backgroundColor: '#e0e0e0' }
          }}>
            <EditIcon />
          </IconButton>
        </Box>
      </Box>
      <Grid container spacing={2}>
        {Object.keys(fields).map((key) => (
          <Grid item xs={12} key={key}>
            <TextField
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              name={key}
              value={fields[key]}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              margin="normal"
              InputProps={{
                readOnly: !isEditable(key),
              }}
              disabled={key === 'password' && !isEditable(key)}
            />
            {key !== 'password' && (
              <Button
                variant="outlined"
                onClick={() => handleEdit(key)}
                disabled={isEditable(key)}
              >
                Edit
              </Button>
            )}
          </Grid>
        ))}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            {editingField && (
              <>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  sx={{ backgroundColor: '#516395', color: '#fff', '&:hover': { backgroundColor: '#405a75' } }}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </>
            )}
            <Button
              variant="contained"
              onClick={handleResetPassword}
              sx={{ backgroundColor: '#604485', color: '#fff', '&:hover': { backgroundColor: '#4b3c6d' } }}
            >
              Reset Password
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Profile;
