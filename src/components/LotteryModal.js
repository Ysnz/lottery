import React, { useState } from 'react';
import './LotteryModal.css';

const prizeOptions = [
  { label: 'Free entry', value: 0 },
  { label: '€5', value: 5 },
  { label: '€10', value: 10 },
  { label: '€20', value: 20 },
  { label: '€50', value: 50 },
];

const RewardRow = ({ value, onChange, onSpin }) => (
  <div className="tmup-row">
    <div className="tmup-prize-options">
      {prizeOptions.map((option) => (
        <button
          key={option.value}
          className={`tmup-prize-btn${value.selectedPrize === option.value ? ' selected' : ''}`}
          onClick={() => onChange({ ...value, selectedPrize: option.value })}
        >
          {option.label}
        </button>
      ))}
    </div>
    <input
      className="tmup-input"
      type="text"
      placeholder="Prize name"
      value={value.prizeName}
      onChange={e => onChange({ ...value, prizeName: e.target.value })}
    />
    <button
      className="tmup-spin-btn"
      onClick={onSpin}
      disabled={!value.prizeName}
      title="Spin"
    >
      SPIN
    </button>
  </div>
);

const LotteryModal = ({
  isOpen,
  onClose,
  onSpin
}) => {
  const [rewardRows, setRewardRows] = useState([
    { selectedPrize: 0, prizeName: '' }
  ]);

  if (!isOpen) return null;

  const handleRowChange = (idx, newValue) => {
    setRewardRows(rows => rows.map((row, i) => (i === idx ? newValue : row)));
  };

  const handleAddRow = () => {
    setRewardRows(rows => [...rows, { selectedPrize: 0, prizeName: '' }]);
  };

  const handleSpin = idx => {
    const row = rewardRows[idx];
    if (!row.prizeName) return;
    onSpin([{ name: row.prizeName, value: row.selectedPrize }]);
    // İsterseniz: satırı sıfırlayabilirsiniz
    setRewardRows(rows => rows.map((r, i) => i === idx ? { selectedPrize: 0, prizeName: '' } : r));
  };

  return (
    <div className="lottery-modal-overlay">
      <div className="tmup-card">
        <h2 className="tmup-title">Giving Draw</h2>
        {rewardRows.map((row, idx) => (
          <RewardRow
            key={idx}
            value={row}
            onChange={val => handleRowChange(idx, val)}
            onSpin={() => handleSpin(idx)}
          />
        ))}
        <button
          className="tmup-add-btn"
          onClick={handleAddRow}
        >
          +Add Reward
        </button>
      </div>
    </div>
  );
};

export default LotteryModal; 