import * as React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  CardActionArea, 
  Avatar ,
  Stack
} from '@mui/material';

const ClimberProfileCard = ({
  climber,
  onClick
}) => {

  const stringAvatar = (name) => {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}`,
    };
  };

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
  
  return (
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
};

export default ClimberProfileCard;


