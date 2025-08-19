import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// App components
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import AnalyticsTracker from './components/AnalyticsTracker';

// Pages
import Landing from './pages/Landing/Landing';
import Climbers from './pages/Climbers/Climbers';
import SelfScoring from './pages/SelfScoring/SelfScoring';
import ClimberProfile from './pages/ClimberProfile';
import PageNotFound from './pages/PageNotFound/PageNotFound';
import './App.css';

import { Container } from '@mui/material';

function App() {
  return (
    <Router>
        <Header />
        <AnalyticsTracker />
        <Container>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/climbers" element={<Climbers />} />
            <Route path="/self-scoring" element={<SelfScoring />} />
            <Route path="/self-scoring/:climberId" element={<SelfScoring />} />
            <Route path="/climber-profile/:climberId" element={<ClimberProfile />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
          <Footer />
        </Container>
    </Router>
  );
}

export default App;
