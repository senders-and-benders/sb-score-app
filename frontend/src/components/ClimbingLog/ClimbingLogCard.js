import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
  Chip,
  IconButton,
  Grid
} from '@mui/material';
import {
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Terrain as MountainIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import { GRADE_COLOUR_MAPPING } from '../../context/GradeColourMap';

const ClimbingLogCard = ({ 
  score,
  onDelete
}) => {
  const avatarBackgroundColor = GRADE_COLOUR_MAPPING[score.grade];
  const avatarTextColour = ['Black', 'Purple', 'Blue'].includes(score.grade) ? 'white' : 'black';

  return (
    <Card sx={{ '&:hover': { boxShadow: 3 }, transition: 'box-shadow 0.2s' }}>
      <CardHeader
        avatar={
          <Box 
          sx={{ 
            p: 1, 
            bgcolor: avatarBackgroundColor, 
            borderRadius:1 
          }}>
            {score.climb_type === 'Bouldering' ? (
              <MountainIcon sx={{ color: avatarTextColour }} />
            ) : (
              <LinkIcon sx={{ color: avatarTextColour }} />
            )}
          </Box>
        }
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Chip
              label={score.grade}
              variant="outlined"
              size="small"
            />
            <Chip
              label={score.climb_type}
              variant="outlined"
              size="small"
            />
          </Box>
        }
        subheader={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarIcon sx={{ fontSize: 16 }} />
              <Typography variant="body2">
                {new Date(score.date_recorded).toLocaleDateString()}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationIcon sx={{ fontSize: 16 }} />
              <Typography variant="body2">
                {score.gym_name}
              </Typography>
            </Box>
          </Box>
        }
        action={
          <Box>
            <IconButton>
              <DeleteIcon onClick={() => onDelete(score.id)} />
            </IconButton>
          </Box>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        <Grid container spacing={2}>
          <Grid size={{xs: 6, md: 3}}>
            <Typography variant="body2" color="text.secondary">
              Attempts
            </Typography>
            <Typography variant="body2">
              {score.attempts}
            </Typography>
          </Grid>
          <Grid size={{xs: 6, md: 3}}>
            <Typography variant="body2" color="text.secondary">
              Area
            </Typography>
            <Typography variant="body2">
              {score.gym_area_name}
            </Typography>
          </Grid>
          <Grid size={{xs: 6, md: 3}}>
            <Typography variant="body2" color="text.secondary">
              Wall
            </Typography>
            <Typography variant="body2">
              {score.wall_name}
            </Typography>
          </Grid>
          {score.climb_type === 'Ropes' && (
            <Grid size={{xs: 6, md: 3}}>
              <Typography variant="body2" color="text.secondary">
                Rope No.
              </Typography>
              <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                #{score.wall_number}
              </Typography>
            </Grid>
          )}
          {score.notes && (
            <Grid size={{xs: 12, md: 12}}>
              <Typography variant="body2" color="text.secondary">
                Notes
              </Typography>
              <Typography variant="body2">
                {score.notes}
              </Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ClimbingLogCard;
