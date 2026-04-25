import React, { useRef, useState, useEffect } from 'react';
import './MagneticBall.css';

const MagneticBall = () => {
  const ballRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!ballRef.current) return;

      const { left, top, width, height } = ballRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      const magnetRadius = 150; // Raio de influência
      const strength = 40; // Força do imã

      if (distance < magnetRadius) {
        // Calcula o deslocamento (atração)
        const moveX = (deltaX / distance) * strength * (1 - distance / magnetRadius);
        const moveY = (deltaY / distance) * strength * (1 - distance / magnetRadius);
        setPosition({ x: moveX, y: moveY });
      } else {
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="Ball-container">
      <div 
        ref={ballRef}
        className="Magnetic-Ball"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        <div className="Ball-glow"></div>
      </div>
    </div>
  );
};

export default MagneticBall;
