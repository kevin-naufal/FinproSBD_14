import React from 'react';
import { PageContent } from '../Header'; // Import the PageContent component

const PlayerSearchPage = () => {
  return (
    <PageContent> {/* Wrap the content with PageContent */}
      <div style={{ padding: '20px' }}>
        <h1>Player Search</h1>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3>Forward</h3>
            <input type="text" placeholder="Search Forward..." />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ width: '30%' }}>
              <h3>Midfielder</h3>
              <input type="text" placeholder="Search Midfielder..." />
            </div>
            <div style={{ width: '30%' }}>
              <h3>Midfielder</h3>
              <input type="text" placeholder="Search Midfielder..." />
            </div>
            <div style={{ width: '30%' }}>
              <h3>Midfielder</h3>
              <input type="text" placeholder="Search Midfielder..." />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ width: '24%' }}>
              <h3>Defender</h3>
              <input type="text" placeholder="Search Defender..." />
            </div>
            <div style={{ width: '24%' }}>
              <h3>Defender</h3>
              <input type="text" placeholder="Search Defender..." />
            </div>
            <div style={{ width: '24%' }}>
              <h3>Defender</h3>
              <input type="text" placeholder="Search Defender..." />
            </div>
            <div style={{ width: '24%' }}>
              <h3>Defender</h3>
              <input type="text" placeholder="Search Defender..." />
            </div>
          </div>
          <div>
            <h3>Goalkeeper</h3>
            <input type="text" placeholder="Search Goalkeeper..." />
          </div>
        </div>
      </div>
    </PageContent>
  );
};

export default PlayerSearchPage;
