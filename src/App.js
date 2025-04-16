import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import WorksheetGenerator from './components/WorksheetGenerator';
import StudentView from './components/StudentView';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<WorksheetGenerator isStudentView={false} />} />
          <Route path="/student" element={<StudentView />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
