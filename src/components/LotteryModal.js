import React from 'react';
import './LotteryModal.css';

const prizeOptions = [
  { label: 'Free entry', value: 0 },
  { label: '€5', value: 5 },
  { label: '€10', value: 10 },
  { label: '€20', value: 20 },
  { label: '€50', value: 50 },
];

const LotteryModal = ({
  isOpen,
  onClose,
  selectedPrize,
  setSelectedPrize,
  prizeName,
  setPrizeName,
  onSpin
}) => {
  if (!isOpen) return null;

  return (
    <div className="lottery-modal-overlay">
      <div className="lottery-modal">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Giving Draw</h2>
        <div className="prize-options">
          {prizeOptions.map((option) => (
            <button
              key={option.value}
              className={`prize-btn${selectedPrize === option.value ? ' selected' : ''}`}
              onClick={() => setSelectedPrize(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="voucher-section">
          <h2>Prize</h2>
          <input
            className="voucher-input"
            type="text"
            placeholder="Enter prize name"
            value={prizeName}
            onChange={e => setPrizeName(e.target.value)}
          />
        </div>
        <button className="spin-btn" onClick={onSpin} disabled={!prizeName}>
          Spin
        </button>
      </div>
    </div>
  );
};

export default LotteryModal; 