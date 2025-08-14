import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Box, Card, CardContent, Typography, CardActionArea, Avatar } from '@mui/material';


function stringToColor(string) {
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

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}`,
  };
};

const ClimberProfileCard = ({
  climber
}) => {
  const [selectedCard, setSelectedCard] = React.useState(0);
  const navigate = useNavigate();

  const climberInitial = climber.name ? climber.name.charAt(0) : '';

  return (
    <Card key={climber.id}>
      <CardActionArea
        onClick={() => navigate(`/climber-profile/${climber.id}`)}
        sx={{
          height: '100%',
          '&[data-active]': {
            backgroundColor: 'action.selected',
            '&:hover': {
              backgroundColor: 'action.selectedHover',
            },
          },
        }}
      >
        <CardContent sx={{ height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
            <Avatar {...stringAvatar(climber.name)} />
            <Typography variant="h5" component="div">
              {climber.name}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {climber.nickname}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ClimberProfileCard;
