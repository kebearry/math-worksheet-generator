import React from 'react';
import { useLocation } from 'react-router-dom';
import Worksheet from './Worksheet';
import { Box, Typography } from '@mui/material';
import { THEMES } from './WorksheetGenerator';

const StudentView = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const encodedData = searchParams.get('data');

  if (!encodedData) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Invalid worksheet link. Please ask your teacher for a new link.
        </Typography>
      </Box>
    );
  }

  try {
    const decodedData = JSON.parse(decodeURIComponent(encodedData));
    const { settings, problems } = decodedData;
    const theme = THEMES[settings.theme];

    // Generate letterToNumber mapping from problems
    const letterToNumber = {};
    problems.forEach(problem => {
      if (problem.letter && problem.answer) {
        letterToNumber[problem.letter] = problem.answer;
      }
    });

    return (
      <Worksheet
        title={settings.title}
        problems={problems}
        letterToNumber={letterToNumber}
        settings={settings}
        theme={theme}
        isStudentView={true}
      />
    );
  } catch (error) {
    console.error('Error decoding worksheet:', error);
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Error loading worksheet. Please ask your teacher for a new link.
        </Typography>
      </Box>
    );
  }
};

export default StudentView; 