import React from 'react';

export default function CloudButton({ children, onClick, style }) {
  return (
    <div className="cloud-btn-wrapper" style={style}>
      <button className="literal-cloud-btn" onClick={onClick}>
        {children}
      </button>
    </div>
  );
}