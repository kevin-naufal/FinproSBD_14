// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import FixturesPage from './components/FixturesPage';
import TransferPage from './components/TransferPage';
import PlayerDetailPage from './components/PlayerDetailPage';
import ClubDetailPage from './components/ClubDetailPage';
import LeaguePage from './components/LeaguePage';
import { Header } from './Header'; // Import Header component
import LeagueDetailPage from './components/LeagueDetailPage';
import FixtureAdminPage from './admin/FixtureAdminPage';
import StarterAdminPage from './admin/StarterAdminPage';
import PlayerStatsAdminPage from './admin/PlayerStatsAdminPage';
import BenchAdminPage from './admin/BenchAdminPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<FixturesPage />} />
        <Route path="/transfers" element={<TransferPage />} />
        <Route path="/player/:id" element={<PlayerDetailPage />} />
        <Route path="/club/:id" element={<ClubDetailPage />} />
        <Route path="/leagues" element={<LeaguePage />} />
        <Route path="/leagues/:league_id" element={<LeagueDetailPage />} />
        <Route path="/admin/fixture" element={<FixtureAdminPage />} />
        <Route path="/admin/starter" element={<StarterAdminPage />} />
        <Route path="/admin/playerStats" element={<PlayerStatsAdminPage />} />
        <Route path="/admin/bench" element={<BenchAdminPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
