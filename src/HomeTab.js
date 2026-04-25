import React from 'react';
import MagneticBall from './MagneticBall';

export default function HomeTab() {
  return (
    <header className="App-header">
      <div className="App-title">
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: '#007bff' }}>
          SHIPTIVITAS
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#6c757d', marginBottom: '2rem' }}>
          The future of freight shipping logistics.
        </p>
        <div className="App-icon">
          <MagneticBall />
        </div>
      </div>
    </header>
  );
}