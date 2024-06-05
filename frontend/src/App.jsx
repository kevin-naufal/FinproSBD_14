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
import FixtureDetailPage from './components/FixtureDetailPage';
import SearchPage from './components/SearchPage';
import FantasyFCpage from './components/FantasyFCpage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        {/* Routes with Header */}
        <Route path="/" element={<WithHeader><FixturesPage /></WithHeader>} />
        <Route path="/transfers" element={<WithHeader><TransferPage /></WithHeader>} />
        <Route path="/player/:id" element={<WithHeader><PlayerDetailPage /></WithHeader>} />
        <Route path="/club/:id" element={<WithHeader><ClubDetailPage /></WithHeader>} />
        <Route path="/leagues" element={<WithHeader><LeaguePage /></WithHeader>} />
        <Route path="/leagues/:league_id" element={<WithHeader><LeagueDetailPage /></WithHeader>} />
        <Route path="/fixture/:fixture_id" element={<WithHeader><FixtureDetailPage /></WithHeader>} />
        <Route path="/search" element={<WithHeader><SearchPage /></WithHeader>} />
        <Route path="/fantasyfc" element={<WithHeader><FantasyFCpage /></WithHeader>} />
        {/* Routes without Header */}
        <Route path="/admin/fixture" element={<FixtureAdminPage />} />
        <Route path="/admin/starter" element={<StarterAdminPage />} />
        <Route path="/admin/playerStats" element={<PlayerStatsAdminPage />} />
        <Route path="/admin/bench" element={<BenchAdminPage />} />
      </Routes>
    </BrowserRouter>
    
  );
};

// Component to wrap routes with Header
const WithHeader = ({ children }) => (
  <>
    <Header />
    {children}
  </>
);

export default App;
