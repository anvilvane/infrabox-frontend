'use client';

import { useEffect, useState } from 'react';

export default function ChristmasSnowflakes() {
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    // Generate 70 snowflakes with random properties
    const flakes = Array.from({ length: 70 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4, // Faster: 3-7 seconds
      size: 8 + Math.random() * 16, // Bigger: 8-24px
      opacity: 0.6 + Math.random() * 0.4 // More visible: 0.6-1.0
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute animate-snowfall drop-shadow-lg"
          style={{
            left: `${flake.left}%`,
            animationDelay: `${flake.delay}s`,
            animationDuration: `${flake.duration}s`,
            fontSize: `${flake.size}px`,
            opacity: flake.opacity,
            color: '#fff',
            textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.4)'
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
}
