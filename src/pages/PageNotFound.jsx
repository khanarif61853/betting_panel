import { Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography variant="h1" component="div" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Sorry, the page you're looking for doesn't exist.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')}>
        Go to Homepage
      </Button>
    </Container>
  );
};

export default PageNotFound;
