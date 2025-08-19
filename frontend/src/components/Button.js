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
import { trackEvent } from '../utils/analytics';

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
    console.log("🔘 Button clicked:", label); // Debug log
    
    // If there's a path, navigate
    if (path) {
      navigate(path);
      trackEvent(
        "button_click", {
          button_label: label,
          button_type: 'navigate',
          path: path
        });
    }
    
    // If there's an onClick prop, call it
    if (otherProps.onClick) {
      otherProps.onClick(event);
      trackEvent(
        "button_click", {
          button_label: label,
          button_type: 'action'
        });
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