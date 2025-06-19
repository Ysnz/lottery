import React, { useState } from 'react';
import LotteryModal from './components/LotteryModal';
import WheelComponent from './components/WheelComponent';
import './App.css';

const segColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#FF8B8B', '#6ECDC4', '#65B7D1', '#A6CEB4', '#FFEAC7', '#EDA0DD', '#A8D8C8', '#F7DC8F'
];

// 8 haneli random kod üretme fonksiyonu
const generateRandomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// 15 adet random kod üretme
const generateCodes = () => {
  const codes = [];
  for (let i = 0; i < 15; i++) {
    codes.push(generateRandomCode());
  }
  return codes;
};

function App() {
  const [showModal, setShowModal] = useState(false);
  const [rewards, setRewards] = useState([
    { selectedPrize: 0, prizeName: '', winner: null }
  ]);
  const [spinningRowIndex, setSpinningRowIndex] = useState(null);
  const [showWheel, setShowWheel] = useState(false);
  const [spinTrigger, setSpinTrigger] = useState(0);
  const [wheelCodes, setWheelCodes] = useState([]);
  const [winningCode, setWinningCode] = useState(null);

  const handleRowChange = (index, newValue) => {
    const newRewards = [...rewards];
    newRewards[index] = { ...newRewards[index], ...newValue };
    setRewards(newRewards);
  };

  const handleAddRow = () => {
    setRewards(r => [...r, { selectedPrize: 0, prizeName: '', winner: null }]);
  };

  const handleRemoveRow = (index) => {
    setRewards(r => r.filter((_, i) => i !== index));
  };

  const handleSpin = (index) => {
    const newRewards = [...rewards];
    newRewards[index].winner = null;
    setRewards(newRewards);
    
    const codes = generateCodes();
    const winner = codes[Math.floor(Math.random() * codes.length)];

    setWheelCodes(codes);
    setWinningCode(winner);
    setSpinningRowIndex(index);
    setShowWheel(true);
    setSpinTrigger(x => x + 1);
  };

  const handleWheelFinish = (winnerCode) => {
    const activeReward = rewards[spinningRowIndex];
    const prizeText = `${winnerCode} - ${activeReward.prizeName}${activeReward.selectedPrize ? ` (${activeReward.selectedPrize}€)` : ' (Free)'}`;
    
    const newRewards = [...rewards];
    newRewards[spinningRowIndex].winner = prizeText;
    setRewards(newRewards);
  };

  const handleContinue = () => {
    setShowWheel(false);
    setShowModal(true);
  };

  const handleStartLottery = () => {
    setShowModal(true);
    setRewards([{ selectedPrize: 0, prizeName: '', winner: null }]);
  };

  return (
    <div className="App app-center lottery-bg">
      {!showModal && !showWheel && (
        <div className="App-main">
          <button className="start-lottery-btn" onClick={handleStartLottery}>
            START LOTTERY
          </button>
        </div>
      )}
      
      <LotteryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        rewards={rewards}
        onRowChange={handleRowChange}
        onAddRow={handleAddRow}
        onRemoveRow={handleRemoveRow}
        onSpin={handleSpin}
      />

      {showWheel && spinningRowIndex !== null && (
        <div className={`wheel-overlay ${rewards[spinningRowIndex]?.winner ? 'has-winner' : ''}`}>
          <div className="wheel-container">
            <WheelComponent
              key={spinTrigger}
              segments={wheelCodes}
              segColors={segColors}
              winningSegment={winningCode}
              onFinished={handleWheelFinish}
              primaryColor="#13a3b3"
              primaryColoraround="#e6f7fa"
              contrastColor="#fff"
              buttonText="SPIN"
              isOnlyOnce={true}
              size={290}
              upDuration={50}
              downDuration={2000}
            />
            {rewards[spinningRowIndex]?.winner && (
              <div className="wheel-winner-overlay">
                <div className="wheel-winner-card">
                  <h2>Congratulations!</h2>
                  <div className="prize-amount">{rewards[spinningRowIndex].winner}</div>
                  <div style={{ color: '#13a3b3', fontWeight: 600, margin: '18px 0 0 0' }}>Your reward is on the way!</div>
                  <button className="reset-button" onClick={handleContinue} style={{marginTop: 24}}>Continue</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;