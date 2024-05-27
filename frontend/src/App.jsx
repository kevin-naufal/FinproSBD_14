import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/LoginPage';
import DetailedFixturePage from './components/DetailedFixturePage';
import SignUpPage from './components/SignUpPage';
import FixturesPage from './components/FixturesPage';
import TransferPage from './components/TransferPage';
import PlayerDetailPage from './components/PlayerDetailPage';
import ClubDetailPage from './components/ClubDetailPage';
import { Header } from './Header'; // Import Header component

const App = () => {
  return (
    <BrowserRouter>
      <Header /> {/* Render the Header component */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/fixture/:id" element={<DetailedFixturePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<FixturesPage />} />
        <Route path="/transfers" element={<TransferPage />} />
        <Route path="/player/:id" element={<PlayerDetailPage />} />
        <Route path="/club/:id" element={<ClubDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
