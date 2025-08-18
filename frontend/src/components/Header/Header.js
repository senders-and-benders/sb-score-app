import React from 'react';
import { Stack, Container , Box, Tooltip, Typography } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Navigation from '../Navigation';
import logo from '../../assets/white_snb_text.png'
import './Header.css';

const Header = () => {
  return (
    <Box className="header" width='100%'>
      <Container>
        <Stack 
          direction="row" 
          alignItems="center" 
          justifyContent="space-between" 
          className='header-text'
          spacing={3}
        >
          {/* Left Icon */}
          <a href="/">
            <img
              src={logo}
              alt="Logo"
              style={{
                height: 75, // 50px for phones, 100px otherwise
                padding: 1
              }}
            />
          </a>

          {/* Right Navigation */}
          <Navigation />
        </Stack>
      </Container>
    </Box>
  );
};

export default Header;
