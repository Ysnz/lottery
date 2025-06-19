import React, { useState } from 'react';
import LotteryModal from './components/LotteryModal';
import './App.css';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [priceName, setPriceName] = useState('');

  const handleSpin = () => {
    setShowModal(false);
    // Burada wheel veya başka bir işlem başlatılabilir.
  };

  return (
    <div className="App app-center lottery-bg">
      <button className="lottery-btn" onClick={() => setShowModal(true)}>
        START LOTTERY
      </button>
      <LotteryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        selectedPrice={selectedPrice}
        setSelectedPrice={setSelectedPrice}
        priceName={priceName}
        setPriceName={setPriceName}
        onSpin={handleSpin}
      />
    </div>
  );
}

export default App;