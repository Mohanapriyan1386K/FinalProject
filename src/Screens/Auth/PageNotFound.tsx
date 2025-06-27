import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      textAlign="center"
      bgcolor="#f8f9fa"
    >
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" color="textSecondary" mb={3}>
        Oops! The page you are looking for does not exist.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/")}>
        go to  Back
      </Button>
    </Box>
  );
};

export default PageNotFound;
