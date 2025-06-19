import React, { useState, useRef, useEffect } from 'react';
import LotteryModal from './components/LotteryModal';
import WheelComponent from './components/WheelComponent';
import './App.css';

const segColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
];

function App() {
  const [showModal, setShowModal] = useState(false);
  const [rewards, setRewards] = useState([]);
  const [showWheel, setShowWheel] = useState(false);
  const wheelRef = useRef();
  const [segments, setSegments] = useState([]);
  const [spinTrigger, setSpinTrigger] = useState(0);

  // Spin butonuna basınca
  const handleSpin = (rewardList) => {
    setShowModal(false);
    setRewards(rewardList);
    setSegments(rewardList.map(r => r.name + (r.value ? ` (${r.value}€)` : ' (Free)')));
    setTimeout(() => {
      setShowWheel(true);
      setSpinTrigger(x => x + 1); // spin tetikleyici
    }, 300);
  };

  // Çark bitince tekrar modal açmak için
  const handleWheelFinish = () => {
    setTimeout(() => {
      setShowWheel(false);
      setShowModal(true);
    }, 1500);
  };

  return (
    <div className="App app-center lottery-bg">
      {!showWheel && (
        <button className="lottery-btn" onClick={() => setShowModal(true)}>
          START LOTTERY
        </button>
      )}
      <LotteryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSpin={handleSpin}
      />
      {showWheel && (
        <WheelComponent
          key={spinTrigger}
          segments={segments}
          segColors={segments.map((_, i) => segColors[i % segColors.length])}
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
    </div>
  );
}

export default App;