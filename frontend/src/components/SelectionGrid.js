import React from 'react';
import { Typography } from '@mui/material';

// Reusable Selection Component
const SelectionGrid = ({ title, items, onSelect, selectedValue, keyField, displayField, colorScheme, minWidth = '120px' }) => {
  const colors = {
    blue: { bg: '#e3f2fd', border: '#2196f3' },
    green: { bg: '#e8f5e8', border: '#4caf50' },
    orange: { bg: '#fff3e0', border: '#ff9800' },
    purple: { bg: '#f3e5f5', border: '#9c27b0ff' }
  };
  
  const scheme = colors[colorScheme] || colors.blue;

  return (
    <div style={{ marginTop: '2rem' }}>
      <Typography variant="h4">{title}</Typography>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}, 1fr))`,
        gap: '10px',
        marginTop: '1rem'
      }}>
        {items.map(item => {
          const key = item[keyField];
          const display = item[displayField];
          const isSelected = selectedValue === key;

        return (
          <button
          key={key}
          className="btn"
          onClick={() => onSelect(key, item)}
          style={{
            padding: '1rem',
            textAlign: 'center',
            backgroundColor: isSelected ? scheme.bg : 'white',
            border: isSelected ? `2px solid ${scheme.border}` : '2px solid #ddd',
            color: '#333',
            borderRadius: '8px'
          }}
          >
          <Typography variant="body2">{display}</Typography>
          </button>
        );
        })}
      </div>
    </div>
  );
};

export default SelectionGrid;
