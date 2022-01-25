import { createTheme } from '@mui/material';
import { red } from '@mui/material/colors';
import { Component } from 'react';
import { ThemeProvider } from 'styled-components';
import { darkScrollbar } from '@mui/material';

export default createTheme({
  spacing: 8,
  palette: {
    primary: {
      main: '#dbd315',
      contrastText: '#fcfbf2'
    },
    background: {
      default: '#f5f5f5',
      paper: '#fff'
    },
    text: {
      primary: '#444',
    },
    info: {
      main: '#34ebdb'
    },
    error: {
      main: '#eb103c'
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f5f5f5'
        },
        a: {
          textDecoration: 'none',
          color: '#34ebdb'
        }
      }
    }
  }
});
