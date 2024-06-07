import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import '../style/admin.css'

const AdminHomePage = () => {
    const [redirect, setRedirect] = useState(false);
    const [redirectData, setRedirectData] = useState({});
  
    const handleButtonClick = (entity) => {
      setRedirectData({ entity });
      setRedirect(true);
    };
  
    if (redirect) {
      return <Navigate to={`/admin/${redirectData.entity}`} state={redirectData} />;
    }
  
    return (
      <div className="admin-home-page">
        <h1>Admin Home Page</h1>
        <div className="button-container">
          <button className="action-button" onClick={() => handleButtonClick('fixture')}>
            Fixture
          </button>
          <button className="action-button" onClick={() => handleButtonClick('playerStats')}>
            Player Stats
          </button>
          <button className="action-button" onClick={() => handleButtonClick('player')}>
            Player
          </button>
          <button className="action-button" onClick={() => handleButtonClick('club')}>
            Club
          </button>
          <button className="action-button" onClick={() => handleButtonClick('starter')}>
            Squad
          </button>
        </div>
      </div>
    );
  };
  
export default AdminHomePage;