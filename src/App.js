import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WorksheetGenerator from './components/WorksheetGenerator';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WorksheetGenerator />} />
          <Route path="/student/:id" element={<WorksheetGenerator isStudentView={true} />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
