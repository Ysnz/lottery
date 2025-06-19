import React, { useState } from 'react';
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
  onSpin
}) => {
  const [selectedPrize, setSelectedPrize] = useState(0);
  const [prizeName, setPrizeName] = useState('');
  const [rewards, setRewards] = useState([]);

  if (!isOpen) return null;

  const handleAddReward = () => {
    if (!prizeName) return;
    setRewards([
      ...rewards,
      { name: prizeName, value: selectedPrize }
    ]);
    setPrizeName('');
    setSelectedPrize(0);
  };

  const handleDeleteReward = (idx) => {
    setRewards(rewards.filter((_, i) => i !== idx));
  };

  const handleSpin = () => {
    if (rewards.length === 0) return;
    onSpin(rewards);
    setRewards([]);
    setPrizeName('');
    setSelectedPrize(0);
  };

  return (
    <div className="lottery-modal-overlay">
      <div className="tmup-card">
        <h2 className="tmup-title">Giving Draw</h2>
        <div className="tmup-row">
          <div className="tmup-prize-options">
            {prizeOptions.map((option) => (
              <button
                key={option.value}
                className={`tmup-prize-btn${selectedPrize === option.value ? ' selected' : ''}`}
                onClick={() => setSelectedPrize(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <input
            className="tmup-input"
            type="text"
            placeholder="Enter prize name"
            value={prizeName}
            onChange={e => setPrizeName(e.target.value)}
          />
          <button
            className="tmup-spin-btn"
            onClick={handleSpin}
            disabled={rewards.length === 0}
            title="Spin"
          >
            SPIN
          </button>
        </div>
        <button
          className="tmup-add-btn"
          onClick={handleAddReward}
          disabled={!prizeName}
        >
          +Add
        </button>
        {rewards.length > 0 && (
          <div style={{ margin: '18px 0', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '6px' }}>Prize Name</th>
                  <th style={{ textAlign: 'left', padding: '6px' }}>Entry Type</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rewards.map((reward, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '6px' }}>{reward.name}</td>
                    <td style={{ padding: '6px' }}>{prizeOptions.find(opt => opt.value === reward.value)?.label}</td>
                    <td style={{ padding: '6px' }}>
                      <button
                        style={{ color: '#fff', background: '#ff6b6b', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}
                        onClick={() => handleDeleteReward(idx)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LotteryModal; 