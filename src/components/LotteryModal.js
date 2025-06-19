import React from 'react';
import './LotteryModal.css';

const priceOptions = [
  { label: 'Free entry', value: 0 },
  { label: '€5', value: 5 },
  { label: '€10', value: 10 },
  { label: '€20', value: 20 },
  { label: '€50', value: 50 },
];

const LotteryModal = ({
  isOpen,
  onClose,
  selectedPrice,
  setSelectedPrice,
  priceName,
  setPriceName,
  onSpin
}) => {
  if (!isOpen) return null;

  return (
    <div className="lottery-modal-overlay">
      <div className="lottery-modal">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Options</h2>
        <div className="price-options">
          {priceOptions.map((option) => (
            <button
              key={option.value}
              className={`price-btn${selectedPrice === option.value ? ' selected' : ''}`}
              onClick={() => setSelectedPrice(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="voucher-section">
          <h2>Price</h2>
          <input
            className="voucher-input"
            type="text"
            placeholder="Enter price name"
            value={priceName}
            onChange={e => setPriceName(e.target.value)}
          />
        </div>
        <button className="spin-btn" onClick={onSpin} disabled={!priceName}>
          Spin
        </button>
      </div>
    </div>
  );
};

export default LotteryModal; 