import React, { useEffect, useState } from 'react';

export default function GlitterEffect() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (Math.random() > 0.15) return; // limit particles slightly more for stars
      const newParticle = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 3 + 2,
        color: Math.random() > 0.5 ? 'white' : 'var(--theme-secondary)' // White or sunny yellow
      };
      
      setParticles(prev => [...prev.slice(-20), newParticle]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {particles.map(p => (
        <div 
          key={p.id}
          className="glitter-particle"
          style={{
            left: p.x, top: p.y,
            width: p.size, height: p.size,
            background: p.color,
            boxShadow: `0 0 12px 3px ${p.color}`
          }}
        />
      ))}
    </>
  );
}