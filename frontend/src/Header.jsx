import React, { useState, useEffect } from 'react';

const Header = () => {

  return (
    <header style={{ position: 'fixed', top: 0, width: '100%', background: '#333', color: '#fff', padding: '30px 20px', textAlign: 'center', zIndex: 999, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <a href="/" style={{color: '#fff', cursor: 'pointer' }}>ScoreStatsFC</a>
      </div>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ display: 'inline', margin: '0 10px' }}><a href="/">Home</a></li>
          <li style={{ display: 'inline', margin: '0 10px' }}><a href="/about">About</a></li>
          <li style={{ display: 'inline', margin: '0 10px' }}><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
};

const PageContent = ({ children }) => {
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = document.querySelector('header');

    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
  }, []);

  return (
    <div style={{ paddingTop: headerHeight + 10, minHeight: '100vh' }}>
      {children}
    </div>
  );
};

export { Header, PageContent };
