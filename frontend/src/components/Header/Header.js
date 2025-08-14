import React from 'react';
import { Stack, IconButton, Container, Tooltip, Typography } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Navigation from '../Navigation/Navigation';
import logo from '../../assets/white_snb_text.png'
import './Header.css';

const Header = () => {
  return (
    <Container className="header" width='100%'>
      <Stack 
        direction="row" 
        alignItems="center" 
        justifyContent="space-between" 
        className='header-text'
        spacing={3}
      >
        {/* Left Icon */}
        <img
          src={logo}
          alt="Logo"
          style={{
            height: window.innerWidth <= 600 ? 50 : 100, // 50px for phones, 100px otherwise
            padding: 1
          }}
        />

        {/* Center Navigation (placeholder, replace with actual nav) */}
        <Navigation />

        {/* Right Question Mark Icon with Tooltip */}
        <Tooltip title={
          <Typography variant="subtitle">
            How did you find this icon? This is super super early MVP.
          </Typography>
        }>
          <IconButton edge="end" color="inherit" aria-label="help">
            <HelpOutlineIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Container>
  );
};

export default Header;
