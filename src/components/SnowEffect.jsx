import React, { useEffect, useState } from 'react';

export default function SnowEffect() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (Math.random() > 0.25) return; // limit frequency
      const newParticle = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 5 + 3, // 3px to 8px
        driftX: (Math.random() - 0.5) * 40 // drift between -20px and +20px horizontally
      };
      
      setParticles(prev => [...prev.slice(-30), newParticle]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {particles.map(p => (
        <div 
          key={p.id}
          className="snow-particle"
          style={{
            left: p.x, top: p.y,
            width: p.size, height: p.size,
            '--driftX': `${p.driftX}px`
          }}
        />
      ))}
    </>
  );
}
