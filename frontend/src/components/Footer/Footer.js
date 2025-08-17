import React from "react";
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  Stack,
  Divider,
  IconButton
} from '@mui/material';
import { 
  Home as HomeIcon,
  Store as StoreIcon
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        backgroundColor: 'grey.100', 
        borderTop: 1, 
        borderColor: 'divider',
        py: 6
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{xs:12, sm:6}}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <Typography 
                variant="h5" 
                component="span" 
                sx={{ fontWeight: 'medium', color: 'primary.main' }}
              >
                S&B Scoring App
              </Typography>
            </Stack>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ mb: 3, maxWidth: 400 }}
            >
              A scoring app to bring a bit of petty and friendly competition to you.
              Built by vibes for the vibes.
            </Typography>
            <Stack direction="row" spacing={2}>
              <IconButton 
                component="a" 
                href="https://sendersandbenders.com" 
                color="inherit"
                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
              >
                <HomeIcon />
              </IconButton>
              <IconButton 
                component="a" 
                href="https://store.sendersandbenders.com" 
                color="inherit"
                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
              >
                <StoreIcon />
              </IconButton>
            </Stack>
          </Grid>
          
          <Grid size={{xs:12, sm:3}}>
            <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 2 }}>
              Features
            </Typography>
            <Stack spacing={1}>
              <Link href="/self-scoring" color="text.secondary" underline="hover" sx={{ '&:hover': { color: 'primary.main' } }}>
                Self Scoring
              </Link>
              <Link href="/climbers" color="text.secondary" underline="hover" sx={{ '&:hover': { color: 'primary.main' } }}>
                Climber Progress and Analytics
              </Link>
            </Stack>
          </Grid>
          
          <Grid size={{xs:12, sm:3}}>
            <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 2 }}>
              Support
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Want a chat? Send an email to <br />
                sendersandbenders2018@gmail.com or ask Mark.
              </Typography>
            </Stack>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        <Box textAlign="center">
          <Typography variant="body2" color="text.secondary">
            &copy; 2025 S&B Scoring App. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
};

export default Footer;