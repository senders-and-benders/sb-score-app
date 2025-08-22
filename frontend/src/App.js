import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// App components
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import AnalyticsTracker from './components/AnalyticsTracker';

// Pages
import Landing from './pages/Landing/Landing';
import Climbers from './pages/Climbers/Climbers';
import ClimberSelection from './pages/SelfScoring/ClimberSelection';
import ScoringForm from './pages/SelfScoring/ScoringForm';
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
            <Route path="/climber-profile/:climberId" element={<ClimberProfile />} />
            <Route path="/self-scoring" element={<ClimberSelection />} />
            <Route path="/self-scoring/:climberId" element={<ScoringForm />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
          <Footer />
        </Container>
    </Router>
  );
}

export default App;
