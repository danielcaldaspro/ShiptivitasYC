import React from 'react';

export default function HomeTab() {
  return (
    <header className="App-header">
      <div className="App-title">
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: '#ff6600' }}>
          SHIPTIVITAS
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#6c757d', marginBottom: '2rem' }}>
          The future of freight shipping logistics.
        </p>
        <div className="App-icon">
          {/* A bolinha agora flutua pelo site todo como um satélite magnético! */}
        </div>
      </div>
    </header>
  );
}