import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Climbers from './pages/Climbers';
import SelfScoring from './pages/SelfScoring';
import ClimberProfile from './pages/ClimberProfile';
import PageNotFound from './pages/PageNotFound';
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
            <Route path="/self-scoring/:climberId" element={<SelfScoring />} />
            <Route path="/climber-profile/:climberId" element={<ClimberProfile />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
