import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import useMediaQuery from '@mui/material/useMediaQuery';

const ClimbingLog = ({ 
  scores = [],
  showClimberName = true
}) => {
  // Detect small screens
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  // Define columns for DataGrid
  const columns = [
    { field: 'date_recorded', headerName: 'Date', type: 'date', minWidth: 120, valueGetter: (key, row) => new Date(row.date_recorded) },
    { field: 'climber_name', headerName: 'Climber', minWidth: 150, hide: !showClimberName || isSmallScreen },
    { field: 'gym_name', headerName: 'Gym', minWidth: 120, hide: false },
    { field: 'climb_type', headerName: 'Type', minWidth: 100, hide: isSmallScreen },
    { 
      field: 'wall_name', 
      headerName: 'Wall', 
      minWidth: 120,
      hide: isSmallScreen,
      valueGetter: (key, row) => `${row.wall_name} ${row.climb_type === 'Ropes' ? `(#${row.wall_number})` : ''}`,
    },
    { field: 'grade', headerName: 'Grade', minWidth: 100, hide: false },
    { field: 'attempts', headerName: 'Attempts', minWidth: 100, hide: isSmallScreen },
  ];

  const initialPagination = { pageSize: 10, page: 0 };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={scores}
        columns={columns}
        pageSizeOptions={[10, 50, 100]}
        initialState={{
          pagination: { paginationModel: initialPagination }
        }}
        disableRowSelectionOnClick
        sx={{
          border: 'none',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#000',
            color: '#fff',
          },
          '& .MuiDataGrid-row': {
            backgroundColor: '#f5f5f5',
          },
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#3b3b3bff',
            color: '#fff',
          },
          '& .MuiDataGrid-toolbar': {
            borderBottom: '1px solid',
            borderColor: 'divider',
          },
        }}
      />
    </div>
  );
};

export default ClimbingLog;
