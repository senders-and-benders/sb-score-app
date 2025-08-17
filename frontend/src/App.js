import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// App components
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

// Pages
import Dashboard from './pages/Dashboard/Dashboard';
import Climbers from './pages/Climbers/Climbers';
import SelfScoring from './pages/SelfScoring/SelfScoring';
import ClimberProfile from './pages/ClimberProfile';
import PageNotFound from './pages/PageNotFound/PageNotFound';
import './App.css';

import { Container } from '@mui/material';

function App() {
  return (
    <Router>
      {/* <div className="App"> */}
        <Header />
        <Container>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/climbers" element={<Climbers />} />
            <Route path="/self-scoring" element={<SelfScoring />} />
            <Route path="/self-scoring/:climberId" element={<SelfScoring />} />
            <Route path="/climber-profile/:climberId" element={<ClimberProfile />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
          <Footer />
        </Container>
      {/* </div> */}
    </Router>
  );
}

export default App;
