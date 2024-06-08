import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { PageContent } from '../Header'; // Import PageContent from Header
import '../style/SearchPage.css'; // Import CSS for styling
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const searchTerm = new URLSearchParams(location.search).get('term');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const playersResponse = await axios.get(`http://localhost:5000/api/players/search?term=${searchTerm}`);
        const clubsResponse = await axios.get(`http://localhost:5000/api/clubs/search?term=${searchTerm}`);
        
        const players = playersResponse.data;
        const clubs = clubsResponse.data;

        setSearchResults({ players, clubs });
      } catch (error) {
        console.error('Error fetching search results:', error);
        // Handle error if needed
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  const handlePlayerClick = (playerId) => {
    navigate(`/player/${playerId}`);
  };

  const handleClubClick = (clubId) => {
    navigate(`/club/${clubId}`);
  };

  return (
    <PageContent>
      <div className="search-results">
        <h1 className="search-results-header">Search Results for <strong>'{searchTerm}'</strong></h1>
        <div className="results-container players-container border-2 border-black bg-[#609966]">
          <h2>Players</h2>
          <ul>
            {searchResults.players && searchResults.players.map(player => (
              <li key={player.id}>
                <button onClick={() => handlePlayerClick(player.id)}>{player.name}</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="results-container clubs-container border-2 border-black bg-[#9DC08B]">
          <h2>Clubs</h2>
          <ul>
            {searchResults.clubs && searchResults.clubs.map(club => (
              <li key={club.id}>
                <button onClick={() => handleClubClick(club.id)}>{club.name}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageContent>
  );
};

export default SearchPage;
