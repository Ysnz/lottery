import React from 'react';
import './LotteryModal.css';

// Default prize options fallback
const defaultPrizeOptions = [
  { label: 'Free Entry', value: 0, description: '' },
  { label: '€5', value: 5, description: 'Basic reward' },
  { label: '€10', value: 10, description: 'Standard reward' },
  { label: '€20', value: 20, description: 'Premium reward' },
  { label: '€50', value: 50, description: 'VIP reward' },
];

const RewardRow = ({ value, onChange, onSpin, onRemove, prizeOptions = defaultPrizeOptions }) => {
  const isWinningRow = !!value.winner;

  if (isWinningRow) {
    return (
      <div className="tmup-row winning-row">
        <div className="winner-display-inline">
          <span className="winner-badge-inline">🎉 Winner!</span>
          <span className="winner-code-inline">{value.winner}</span>
        </div>
        <button
          className="tmup-remove-btn"
          onClick={onRemove}
          title="Remove"
          type="button"
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <div className={`tmup-row`}>
      <div style={{width: 340, margin: '0 0 0 8px', display: 'flex', alignItems: 'center'}}>
        <div className="tmup-prize-options">
          {prizeOptions.map((option) => (
            <button
              key={option.value}
              className={`tmup-prize-btn${value.selectedPrize === option.value ? ' selected' : ''}`}
              onClick={() => onChange({ selectedPrize: option.value })}
            >
              <div className="prize-amount">{option.label}</div>
              <div className="prize-description">{option.description && option.description.length > 10 ? option.description.slice(0, 10) + '...' : option.description}</div>
            </button>
          ))}
        </div>
      </div>
      <input
        className="tmup-input"
        type="text"
        placeholder="Prize name"
        value={value.prizeName}
        onChange={e => onChange({ prizeName: e.target.value })}
        style={{minWidth: 120, maxWidth: 180}}
      />
      <button
        className="tmup-spin-btn"
        onClick={onSpin}
        disabled={!value.prizeName}
        title="Spin"
      >
        SPIN
      </button>
      <button
        className="tmup-remove-btn"
        onClick={onRemove}
        title="Remove"
        type="button"
      >
        ×
      </button>
    </div>
  );
};

const LotteryModal = ({
  isOpen,
  onClose,
  rewards,
  onRowChange,
  onAddRow,
  onRemoveRow,
  onSpin,
  onComplete,
  prizeOptions = defaultPrizeOptions,
  campaignName = ''
}) => {
  if (!isOpen) return null;

  const hasWinner = rewards.some(r => r.winner);

  return (
    <div className="lottery-modal-overlay">
      <div className="tmup-card">
        <h2 className="tmup-title">Giving Draw</h2>
        {campaignName && (
          <div className="tmup-campaign-name">{campaignName}</div>
        )}
        {rewards.map((row, idx) => (
          <div className={`tmup-row-container${row.winner ? ' has-winner' : ''}`} key={idx}>
            <RewardRow
              value={row}
              onChange={val => onRowChange(idx, val)}
              onSpin={() => onSpin(idx)}
              onRemove={() => onRemoveRow(idx)}
              prizeOptions={prizeOptions}
            />
          </div>
        ))}
        <div className="modal-actions">
          <button
            className="tmup-add-btn"
            onClick={onAddRow}
            disabled={rewards.some(row => !row.prizeName)}
          >
            Add Reward
          </button>
          {hasWinner && (
            <button
              className="tmup-complete-btn"
              onClick={onComplete}
            >
              Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LotteryModal; 