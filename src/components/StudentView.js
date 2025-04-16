import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Worksheet from './Worksheet';
import { Box, Typography, Snackbar, Alert, Container } from '@mui/material';
import { THEMES } from './WorksheetGenerator';

const StudentView = () => {
  const [searchParams] = useSearchParams();
  const encodedData = searchParams.get('data');
  const [studentAnswers, setStudentAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({ correct: 0, total: 0 });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const checkAnswers = (answers, problems) => {
    let correct = 0;
    problems.forEach((problem, index) => {
      const studentAnswer = answers[index] ? parseInt(answers[index]) : null;
      if (studentAnswer === problem.answer) {
        correct++;
      }
    });
    return correct;
  };

  const handleAnswerChange = (index, value, problems) => {
    const newAnswers = {
      ...studentAnswers,
      [index]: value
    };
    setStudentAnswers(newAnswers);

    // Only show feedback if there's a valid number entered
    if (value && !isNaN(parseInt(value))) {
      setShowFeedback(true);
      const correct = checkAnswers(newAnswers, problems);
      setFeedback({ correct, total: problems.length });
    }
  };

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
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Worksheet
          title={settings.title}
          problems={problems}
          letterToNumber={letterToNumber}
          settings={settings}
          theme={theme}
          isStudentView={true}
          studentAnswers={studentAnswers}
          onAnswerChange={(index, value) => handleAnswerChange(index, value, problems)}
          showFeedback={showFeedback}
        />
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setSnackbarOpen(false)} 
            severity={feedback.correct === feedback.total ? "success" : "info"}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
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