import * as React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  CardActionArea, 
  Avatar ,
  Stack ,
  Box
} from '@mui/material';
import { BorderAllOutlined } from '@mui/icons-material';

const stringToColor = (string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
};

const stringAvatar = (name, size) => {
  return {
    children: `${name.split(' ')[0][0]}`,
    sx: {
      bgcolor: stringToColor(name),
      width: size,
      height: size
    },
  };
};

// Common Parts 

// Export stuff
export const ClimberSelectCard = ({
  climber,
  onClick
}) => (
  <Card 
    key={climber.id}
    sx={{
      transition: 'box-shadow 0.2s',
      '&:hover': {
        boxShadow: 3
      },
      width: 150,
      height: 150,
      justifyContent: 'center',
      alignContent: 'center'
    }}
  >
    <CardActionArea 
      onClick={onClick}
      sx={{ height: '100%' }}
    >
      <CardContent>
        <Stack sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
          <Avatar {...stringAvatar(climber.name)} />
          <Typography variant="body1" align='center'>{climber.name}</Typography>
          <Typography variant="caption" color="text.secondary" align='center'>{climber.nickname}</Typography>
        </Stack>
      </CardContent>
    </CardActionArea>
  </Card>
);

export const ClimberHeaderCard = ({
  climber
}) => (
  <Box 
    key={climber.id}
    sx={{
      border: 1,
      borderColor: 'divider',
      width: '100%',
      height: 100,
      alignContent: 'center'
    }}
  >
    <Box p={2}>
      <Stack direction="row" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar
          {...stringAvatar(climber.name, 50)}
        />
        <Stack 
          direction="column" 
          sx={{ gap: 1 }}
        >
          <Typography variant="body1">{climber.name}</Typography>
          {climber.nickname && <Typography variant="body2" color="text.secondary">Nickname: {climber.nickname}</Typography>}
        </Stack>
      </Stack>
    </Box>
  </Box>
);







