import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Alert } from '@mui/material';
import StudentView from './StudentView';

const StudentViewWrapper = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const encodedData = searchParams.get('data');

  if (!encodedData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          No worksheet data provided
        </Alert>
      </Box>
    );
  }

  try {
    const data = JSON.parse(atob(encodedData));
    return <StudentView data={data} />;
  } catch (error) {
    console.error('Error decoding worksheet data:', error);
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error loading worksheet. The link might be invalid or corrupted.
        </Alert>
      </Box>
    );
  }
};

export default StudentViewWrapper; 