import React, { useState } from 'react';
import confetti from 'canvas-confetti';
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
  const [spinDuration, setSpinDuration] = useState(8000);

  const triggerConfetti = () => {
    const launch = (origin, angle) => {
      // First, more powerful burst
      confetti({
        particleCount: 250,
        angle: angle,
        spread: 90,
        origin: origin,
        colors: segColors,
        startVelocity: 45,
        drift: origin.x === 0 ? -1 : 1,
      });

      // Second, wider burst a moment later
      setTimeout(() => {
        confetti({
          particleCount: 150,
          angle: angle,
          spread: 120,
          origin: origin,
          colors: segColors,
          startVelocity: 35,
          scalar: 0.8,
          drift: origin.x === 0 ? -0.5 : 0.5,
        });
      }, 100);
    };

    // Launch from both sides
    launch({ x: 0, y: 0.6 }, 60);
    launch({ x: 1, y: 0.6 }, 120);
  };

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
    setSpinDuration(Math.random() * 8000 + 14000);
    setShowWheel(true);
    setSpinTrigger(x => x + 1);
  };

  const handleComplete = () => {
    setShowModal(false);
  };

  const handleWheelFinish = (winnerCode) => {
    setTimeout(() => {
      const activeReward = rewards[spinningRowIndex];
      const prizeText = `${winnerCode} - ${activeReward.prizeName}${activeReward.selectedPrize ? ` (${activeReward.selectedPrize}€)` : ' (Free)'}`;
      
      const newRewards = [...rewards];
      newRewards[spinningRowIndex].winner = prizeText;
      setRewards(newRewards);
      triggerConfetti();
    }, 1000);
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
        onComplete={handleComplete}
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
              contrastColor="#fff"
              buttonText=""
              isOnlyOnce={true}
              size={290}
              upDuration={1500}
              downDuration={spinDuration - 1500}
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