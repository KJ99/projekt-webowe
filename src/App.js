import { CssBaseline, ThemeProvider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import theme from './theme';
import firebaseConfig from './firebase.config';
import { initializeApp } from 'firebase/app';
import { getDatabase, get, ref } from 'firebase/database';
import AppRouter from './routing/Router';
import { UserProvider } from './context/UserContext';
import { SnackbarProvider } from 'notistack';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <SnackbarProvider>
          <UserProvider>
            <AppRouter />
          </UserProvider>
        </SnackbarProvider>
      </CssBaseline>
    </ThemeProvider>
  );
};

export default App;
