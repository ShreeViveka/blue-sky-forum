import React from 'react';

export default function SkyBackground() {
  return (
    <>
      <div className="sky-layer-base"></div>
      <div className="sky-layer-real"></div>
      
      {/* Light Mode: Realistic Rainbow */}
      <div className="rainbow-overlay"></div>
      
      {/* Dark Mode: Shooting Stars (Comets) & Static Stars */}
      <div className="comets-container">
        <div className="static-stars"></div>
        <div className="comet" style={{ top: '5%', animationDelay: '0s' }}></div>
        <div className="comet" style={{ top: '25%', animationDelay: '2.5s' }}></div>
        <div className="comet" style={{ top: '-10%', animationDelay: '5s' }}></div>
        <div className="comet" style={{ top: '15%', animationDelay: '7.2s' }}></div>
        <div className="comet" style={{ top: '40%', animationDelay: '9s' }}></div>
      </div>
    </>
  );
}