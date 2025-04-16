import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Worksheet from './Worksheet';
import { Box, Typography } from '@mui/material';
import { THEMES } from './WorksheetGenerator';

const StudentView = () => {
  const [searchParams] = useSearchParams();
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
    const worksheetData = JSON.parse(atob(encodedData));
    const { settings, problems, letterToNumber } = worksheetData;
    const theme = THEMES[settings.theme];

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
    console.error('Error parsing worksheet data:', error);
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Invalid worksheet data. Please ask your teacher for a new link.
        </Typography>
      </Box>
    );
  }
};

export default StudentView; 