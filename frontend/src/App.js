import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/pages/Header';
import Navigation from './components/pages/Navigation';
import Dashboard from './components/pages/Dashboard';
import Climbers from './components/pages/Climbers';
import SelfScoring from './components/pages/SelfScoring';
import ClimberProfile from './components/pages/ClimberProfile';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Navigation />
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/climbers" element={<Climbers />} />
            <Route path="/self-scoring" element={<SelfScoring />} />
            <Route path="/climber-profile/:climberId" element={<ClimberProfile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
