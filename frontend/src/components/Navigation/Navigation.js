import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Stack, Divider } from '@mui/material';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();

  return (
    <Container className="nav">
      <Stack 
        direction="row" 
        spacing={2} 
        justifyContent="center"
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          Dashboard
        </Link>
        <Link to="/climbers" className={location.pathname === '/climbers' ? 'active' : ''}>
          Climbers
        </Link>
        <Link to="/self-scoring" className={location.pathname === '/self-scoring' ? 'active' : ''}>
          Self Scoring
        </Link>
      </Stack>
    </Container>
  );
};

export default Navigation;