import React, { useState } from 'react';
import LotteryModal from './components/LotteryModal';
import WheelComponent from './components/WheelComponent';
import './App.css';

const segColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
];

function App() {
  const [showModal, setShowModal] = useState(false);
  const [activeReward, setActiveReward] = useState(null); // {name, value}
  const [showWheel, setShowWheel] = useState(false);
  const [winner, setWinner] = useState(null);
  const [spinTrigger, setSpinTrigger] = useState(0);

  // Sadece ilgili satırdan spin
  const handleSpin = (rewardList) => {
    if (!rewardList || !rewardList[0]) return;
    setActiveReward(rewardList[0]);
    setShowModal(false);
    setTimeout(() => {
      setShowWheel(true);
      setSpinTrigger(x => x + 1);
    }, 300);
  };

  // Wheel bitince kazananı göster
  const handleWheelFinish = (winnerSegment) => {
    setShowWheel(false);
    setWinner(winnerSegment);
  };

  // Continue ile tekrar draw ekranı
  const handleContinue = () => {
    setWinner(null);
    setActiveReward(null);
    setShowModal(false);
  };

  // START LOTTERY butonuna tıklandığında modal'ı aç
  const handleStartLottery = () => {
    setShowModal(true);
  };

  return (
    <div className="App app-center lottery-bg">
      {!showModal && !showWheel && !winner && (
        <div className="App-main">
          <button className="start-lottery-btn" onClick={handleStartLottery}>
            START LOTTERY
          </button>
        </div>
      )}
      
      <LotteryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSpin={handleSpin}
      />
      {showWheel && activeReward && (
        <WheelComponent
          key={spinTrigger}
          segments={[activeReward.name + (activeReward.value ? ` (${activeReward.value}€)` : ' (Free)')]}
          segColors={[segColors[0]]}
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
      )}
      {winner && (
        <div className="result-section">
          <div className="result-card">
            <h2>Congratulations!</h2>
            <div className="prize-amount">{winner}</div>
            <div style={{ color: '#13a3b3', fontWeight: 600, margin: '18px 0 0 0' }}>Your reward is on the way!</div>
            <button className="reset-button" onClick={handleContinue} style={{marginTop: 24}}>Continue</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;