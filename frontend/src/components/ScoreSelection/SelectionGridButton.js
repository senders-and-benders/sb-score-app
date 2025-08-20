import React from 'react';
import { Typography, Button } from '@mui/material';

const SelectionGridButton = ({ display, selected, onClick, colorScheme }) => {
  const colors = {
    blue: { bg: '#e3f2fd', border: '#2196f3' },
    green: { bg: '#e8f5e8', border: '#4caf50' },
    orange: { bg: '#fff3e0', border: '#ff9800' },
    purple: { bg: '#f3e5f5', border: '#9c27b0ff' }
  };
  const scheme = colors[colorScheme] || colors.blue;

  return (
    <Button
      variant={selected ? 'contained' : 'outlined'}
      onClick={onClick}
      sx={{
        padding: '1rem',
        textAlign: 'center',
        backgroundColor: selected ? scheme.bg : 'white',
        borderColor: selected ? scheme.border : '#ddd',
        color: '#333',
        borderRadius: '10px',
        boxShadow: selected ? 2 : 0,
        minWidth: '100px',
        transition: 'box-shadow 0.2s',
        '&:hover': {
          boxShadow: 3,
          backgroundColor: selected ? scheme.bg : '#f5f5f5',
        },
      }}
      fullWidth
    >
      <Typography 
        variant="body2" 
        sx={{ fontWeight: '500'}}
      >
        {display}
      </Typography>
    </Button>
  );
};
export default SelectionGridButton;