import React from 'react';
import { Typography } from '@mui/material';
import SelectionGridButton from './SelectionGridButton';

const SelectionGrid = ({ title, items, onSelect, selectedValue, keyField, displayField, colorScheme, minWidth = '120px' }) => (
  <div style={{ marginTop: '2rem' }}>
    <Typography variant="h4">{title}</Typography>
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}, 1fr))`,
      gap: '10px',
      marginTop: '1rem'
    }}>
      {items.map(item => (
        <SelectionGridButton
          key={item[keyField]}
          display={item[displayField]}
          selected={selectedValue === item[keyField]}
          onClick={() => onSelect(item[keyField], item)}
          colorScheme={colorScheme}
        />
      ))}
    </div>
  </div>
);

export default SelectionGrid;