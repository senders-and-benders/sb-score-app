import React from 'react';
import { useLocation } from 'react-router-dom';
import { Link, Stack, Divider } from '@mui/material';

const Navigation = () => {
  const location = useLocation();

  return (
    <Stack 
      direction="row" 
      spacing={2} 
      justifyContent="center"
      alignContent="center"
      divider={<Divider orientation="vertical" flexItem />}
    >
      <Link 
      href="/" 
      color="inherit" 
      underline={location.pathname === '/dashboard' ? 'always' : 'hover'}
      variant='subtitle1'
      >
        Dashboard
      </Link>
      <Link 
        href="/climbers" 
        color="inherit" 
        underline={location.pathname === '/climbers' ? 'always' : 'hover'}
        variant='subtitle1'
      >
        Climbers
      </Link>
      <Link 
        href="/self-scoring" 
        color="inherit" 
        underline={location.pathname === '/self-scoring' ? 'always' : 'hover'}
        variant='subtitle1'
      >
        Self Scoring
      </Link>
    </Stack>
  );
};

export default Navigation;