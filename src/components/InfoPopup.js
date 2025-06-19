import React from 'react';
import './InfoPopup.css';

const InfoPopup = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="info-popup-overlay">
      <div className="info-popup-card">
        <p className="info-popup-message">{message}</p>
        <button className="info-popup-btn" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default InfoPopup; 