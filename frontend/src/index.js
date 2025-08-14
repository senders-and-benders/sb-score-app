import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Create a custom theme for the climbing app
const theme = createTheme({
  palette: {
    primary: {
      main: '#2c3e50', // Dark blue-gray
    },
    secondary: {
      main: '#e67e22', // Orange for climbing grades
    },
    success: {
      main: '#27ae60', // Green for successful climbs
    },
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 300
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 300
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 300
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 300
    },
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
