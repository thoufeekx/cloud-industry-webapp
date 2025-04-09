import React from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import PredictionForm from './components/PredictionForm';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <PredictionForm />
      </Container>
    </ThemeProvider>
  );
}

export default App;
