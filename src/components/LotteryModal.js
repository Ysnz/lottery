import React from 'react';
import './LotteryModal.css';

const prizeOptions = [
  { label: 'Free entry', value: 0 },
  { label: '€5', value: 5 },
  { label: '€10', value: 10 },
  { label: '€20', value: 20 },
  { label: '€50', value: 50 },
];

const RewardRow = ({ value, onChange, onSpin, onRemove }) => {
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
      <div className="tmup-prize-options">
        {prizeOptions.map((option) => (
          <button
            key={option.value}
            className={`tmup-prize-btn${value.selectedPrize === option.value ? ' selected' : ''}`}
            onClick={() => onChange({ selectedPrize: option.value })}
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
        onChange={e => onChange({ prizeName: e.target.value })}
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
  onComplete
}) => {
  if (!isOpen) return null;

  const hasWinner = rewards.some(r => r.winner);

  return (
    <div className="lottery-modal-overlay">
      <div className="tmup-card">
        <h2 className="tmup-title">Giving Draw</h2>
        {rewards.map((row, idx) => (
          <div className={`tmup-row-container${row.winner ? ' has-winner' : ''}`} key={idx}>
            <RewardRow
              value={row}
              onChange={val => onRowChange(idx, val)}
              onSpin={() => onSpin(idx)}
              onRemove={() => onRemoveRow(idx)}
            />
          </div>
        ))}
        <div className="modal-actions">
          <button
            className="tmup-add-btn"
            onClick={onAddRow}
            disabled={rewards.some(row => !row.prizeName)}
          >
            +Add Reward
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