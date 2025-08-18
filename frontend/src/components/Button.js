import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button as MuiButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Typography 
} from '@mui/material';

const Button = ({
  colour,
  icon: Icon,
  label,
  variant = 'contained',
  size = 'medium',
  path,
  ...otherProps
}) => {
  // Handle navigation logic in parent
  const navigate = useNavigate();
  const handleClick = (event) => {
    // If there's a path, navigate
    if (path) {
      navigate(path);
    }
    
    // If there's an onClick prop, call it
    if (otherProps.onClick) {
      otherProps.onClick(event);
    }
  };
  return (
    <MuiButton
      variant={variant}
      size={size}
      onClick={handleClick}
      startIcon={Icon ? <Icon /> : null}
      sx={{
        backgroundColor: colour,
        minwidth: 150,
        height: 40,
        '&:hover': {
          backgroundColor: colour,
          filter: 'brightness(0.9)',
        },
        textTransform: 'none',
        borderRadius: '10px',
        ...otherProps.sx
      }}
      {...otherProps}
    >
      {label}
    </MuiButton>
  );
};

export default Button;