import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for making HTTP requests
import "./style/header.css"; // Import the CSS file

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    players: [],
    clubs: [],
  });

  // Function to handle logout
  const handleLogoutClick = async () => {
    try {
      // Call the logout API to update is_logged_in to false
      await axios.post("http://localhost:5000/api/login/logout");
      // Update the state to reflect logout
      setIsLoggedIn(false);
      // Optionally, you can redirect to the login page or perform other actions after logout
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      // Handle error if needed
    }
  };

  // Function to handle login
  const handleLoginClick = () => {
    navigate("/login");
  };

  // Function to handle search action
  const handleSearch = async (event) => {
    // Check if the Enter key is pressed (key code 13)
    if (event.keyCode === 13) {
      // Prevent default form submission
      event.preventDefault();
      // Navigate to the search page
      navigate(`/search?term=${searchQuery}`);
    }
  };

  const handlePlayerClick = (playerId) => {
    navigate(`/player/${playerId}`);
  };

  const handleClubClick = (clubId) => {
    navigate(`/club/${clubId}`);
  };

  // Function to handle FantasyFC button click
  const handleFantasyFCClick = () => {
    navigate("/fantasyfc");
  };

  useEffect(() => {
    // Fetch the latest login session status
    const fetchLoginStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/login/latest-login-session"
        );
        // Check if login session is found
        if (response.data.length > 0) {
          const isLoggedIn = response.data[0].is_logged_in;
          // Set the state accordingly
          setIsLoggedIn(isLoggedIn);
        }
      } catch (error) {
        console.error("Error fetching login status:", error);
        // Handle error if needed
      }
    };

    fetchLoginStatus(); // Call the function to fetch login status
  }, []);

  useEffect(() => {
    // Fetch players and clubs based on the search query
    const fetchSearchResults = async () => {
      try {
        if (searchQuery.length >= 3) {
          const playersResponse = await axios.get(
            `http://localhost:5000/api/players/search?term=${searchQuery}&limit=3`
          );
          const clubsResponse = await axios.get(
            `http://localhost:5000/api/clubs/search?term=${searchQuery}&limit=3`
          );

          const players = playersResponse.data;
          const clubs = clubsResponse.data;

          setSearchResults({ players, clubs });
        } else {
          setSearchResults({ players: [], clubs: [] });
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        // Handle error if needed
      }
    };

    fetchSearchResults(); // Call the function to fetch search results
  }, [searchQuery]);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        background: "#333",
        color: "#fff",
        padding: "30px 20px",
        textAlign: "center",
        zIndex: 999,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", gap: "10px" }}>
        <a href="/" style={{ color: "#fff", cursor: "pointer" }}>
          ScoreStatsFC
        </a>
        <button
          onClick={handleFantasyFCClick}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            fontSize: "16px",
            paddingLeft: "40px",
          }}
        >
          FantasyFC
        </button>
      </div>
      <form onSubmit={handleSearch} style={{ position: "relative" }}>
        <input
          id="searchInput"
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          onKeyDown={handleSearch} // Listen for key down event
          style={{
            padding: "5px 10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            marginRight: "10px",
            width: "200px",
            color: "#000", // Set the color to black
          }}
        />
        {searchQuery.length >= 3 && (
          <div
            className="search-results"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              zIndex: 999,
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "5px",
              width: "200px",
              marginTop: "20px",
            }}
          >
            {searchResults.players.length > 0 && (
              <div>
                <h3
                  style={{
                    color: "#000",
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  Players
                </h3>
                <ul>
                  {searchResults.players.slice(0, 3).map((player) => (
                    <li key={player.id}>
                      <button onClick={() => handlePlayerClick(player.id)}>
                        {player.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {searchResults.clubs.length > 0 && (
              <div>
                <h3
                  style={{
                    color: "#000",
                    fontWeight: "bold",
                    marginBottom: "10px",
                    marginTop: "10px",
                  }}
                >
                  Clubs
                </h3>
                <ul>
                  {searchResults.clubs.slice(0, 3).map((club) => (
                    <li key={club.id}>
                      <button onClick={() => handleClubClick(club.id)}>
                        {club.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </form>
      {isLoggedIn ? (
        <button
          onClick={handleLogoutClick}
          style={{
            background: "#555",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      ) : (
        <button
          onClick={handleLoginClick}
          style={{
            background: "#555",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Log In
        </button>
      )}
    </header>
  );
};

const PageContent = ({ children }) => {
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = document.querySelector("header");

    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
  }, []);

  return (
    <div style={{ paddingTop: headerHeight + 10, minHeight: "100vh" }}>
      {children}
    </div>
  );
};

export { Header, PageContent };
