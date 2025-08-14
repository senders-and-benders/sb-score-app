import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const ClimbingLog = ({
  scores = [],
  showClimberName = false
}) => {
  // Determine phone breakpoint
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs')) ? false : true; // Reverse it as i will use it in the columnvisible prop
  
  // Define columns for DataGrid
  const columns = [
    {
      field: 'date_recorded',
      headerName: 'Date',
      type: 'date',
      minWidth: 120,
      flex: 1,
      valueGetter: (value, row) => new Date(row.date_recorded)
    },
    { 
      field: 'climb_type', 
      headerName: 'Type', 
      minWidth: 100,
      flex: 1
    },
    { 
      field: 'climber_name', 
      headerName: 'Climber', 
      minWidth: 150, 
      flex: 1
    },
    { 
      field: 'gym_name', 
      headerName: 'Gym', 
      minWidth: 150, 
      flex: 1
    },
    {
      field: 'wall_name',
      headerName: 'Wall',
      minWidth: 150,
      flex: 1,
      valueGetter: (value, row) => `${row.wall_name} ${row.climb_type === 'Ropes' ? `(#${row.wall_number})` : ''}`,
    },
    { 
      field: 'grade', 
      headerName: 'Grade', 
      minWidth: 100,
      flex: 1
    },
    { 
      field: 'attempts', 
      headerName: 'Attempts', 
      minWidth: 100,
      flex: 1
    },
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
        showToolbar
        sx={{
          border: 'none',
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#3b3b3bff',
            color: '#fff',
            textAlign: 'center',
          },
          '& .MuiDataGrid-cell': {
            textAlign: 'center',
            backgroundColor: '#f5f5f5',
          },
          '& .MuiDataGrid-toolbar': {
            borderBottom: '1px solid',
            borderColor: 'divider',
          },
        }}
        columnVisibilityModel={{
          climber_name: showClimberName,
          climb_type: isXs,
          attempts: isXs
        }}
      />
    </div>
  );
};

export default ClimbingLog;
