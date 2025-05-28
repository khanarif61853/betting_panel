import { Snackbar, Alert } from "@mui/material";
import PropTypes from 'prop-types';

const CustomSnackbar = ({ open, onClose, handleClose, message, severity }) => {
  // Use either onClose or handleClose prop
  const closeHandler = onClose || handleClose;

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={closeHandler}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      sx={{
        '& .MuiSnackbar-root': {
          top: '24px'
        }
      }}
    >
      <Alert 
        onClose={closeHandler} 
        severity={severity} 
        variant="filled"
        elevation={6}
        sx={{ 
          width: '100%',
          minWidth: '300px',
          '& .MuiAlert-message': {
            fontSize: '0.95rem',
            fontWeight: 500
          },
          '& .MuiAlert-icon': {
            fontSize: '1.5rem'
          }
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

CustomSnackbar.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  handleClose: PropTypes.func,
  message: PropTypes.string,
  severity: PropTypes.oneOf(['error', 'warning', 'info', 'success']).isRequired
};

// Ensure at least one of onClose or handleClose is provided
CustomSnackbar.defaultProps = {
  onClose: undefined,
  handleClose: undefined,
  message: ''
};

export default CustomSnackbar;
