import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import ideallyLogo from './ideally32-white.svg';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      // This is pink
      main: '#6FCFEB',
    },
    secondary: {
      // This is pink
      main: '#6FCFEB',
    },
  },
});

export default function PrimarySearchAppBar() {

  return (
    <Box sx={{ flexGrow: 1 }}>
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <div className = "logo">
            <img src={ideallyLogo} alt="Ideally Logo" width="128px"/>
          </div>
          </Typography>
        </Toolbar>
      </AppBar>
      </ThemeProvider>
    </Box>
  );
}

