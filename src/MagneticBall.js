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

      const magnetRadius = 250; // Aumentei o raio para as camadas externas
      const strength = -60; // Força NEGATIVA para repulsão

      if (distance < magnetRadius) {
        // Calcula o deslocamento (repulsão: move-se na direção OPOSTA ao mouse)
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
        className="Magnetic-Ball-System"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        {/* Camadas do Campo Magnético */}
        <div className="Magnetic-Field layer-3"></div>
        <div className="Magnetic-Field layer-2"></div>
        <div className="Magnetic-Field layer-1"></div>
        
        {/* Bolinha Principal */}
        <div className="Magnetic-Core"></div>
      </div>
    </div>
  );
};

export default MagneticBall;
