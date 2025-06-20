import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import LotteryModal from './components/LotteryModal';
import WheelComponent from './components/WheelComponent';
import './App.css';

const segColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#FF8B8B', '#6ECDC4', '#65B7D1', '#A6CEB4', '#FFEAC7', '#EDA0DD', '#A8D8C8', '#F7DC8F'
];

// GraphQL query to fetch campaign data
const CAMPAIGN_QUERY = `
  query GetCampaign($slug: String!) {
    campaign(slug: $slug) {
      id
      name
      tiers {
        edges {
          node {
            id
            description
            donationAmount
            donationAmountOperator
            maxTickets
            isUnlimitedTickets
            descriptionEn
            isSoldOut
            stockLeft
            booked
            acquired
            used
          }
        }
      }
    }
  }
`;

// Mock GraphQL response for development
const mockGraphQLResponse = {
  "data": {
    "campaign": {
      "id": "Q2FtcGFpZ25Ob2RlOjY0YzBhYmI3LTJmZjgtNGUzNi1hNzllLWRmOGI4MzU0MGZlNw==",
      "slug": "trustmeup-trust:save-tea-cups-all-around-the-world",
      "name": "Save tea cups all around the world",
      "tiers": {
        "edges": [
          {
            "node": {
              "id": "RG9uYXRpb25UaWVyTm9kZTphNDk2MTNiMy1hZjFmLTQ0YTUtYjY3ZS0wOTJmZThhYzliMzY=",
              "description": "Meal and drinks",
              "donationAmount": "90.00",
              "donationAmountOperator": "EQ",
              "maxTickets": 100,
              "isUnlimitedTickets": false,
              "descriptionEn": "Meal and drinks",
              "isSoldOut": false,
              "stockLeft": 3,
              "booked": 97,
              "acquired": 97,
              "used": 0
            }
          },
          {
            "node": {
              "id": "RG9uYXRpb25UaWVyTm9kZTo4ODdiMjYxOC0zMWQ2LTRkMjctODU0OC0xY2NiZDFhNmY0NmU=",
              "description": "Meal and drinks",
              "donationAmount": "30.00",
              "donationAmountOperator": "EQ",
              "maxTickets": 32767,
              "isUnlimitedTickets": false,
              "descriptionEn": "Meal and drinks",
              "isSoldOut": false,
              "stockLeft": 32667,
              "booked": 100,
              "acquired": 100,
              "used": 0
            }
          },
          {
            "node": {
              "id": "RG9uYXRpb25UaWVyTm9kZToyNzZiOWI3YS0xYTJhLTQzOTMtOTg3MC01OWEwZjU4NzYwODk=",
              "description": "Meal and drinks",
              "donationAmount": "25.00",
              "donationAmountOperator": "EQ",
              "maxTickets": 32767,
              "isUnlimitedTickets": false,
              "descriptionEn": "Meal and drinks",
              "isSoldOut": false,
              "stockLeft": 32596,
              "booked": 171,
              "acquired": 171,
              "used": 0
            }
          }
        ]
      }
    }
  }
};

// Function to fetch campaign data
const fetchCampaignData = async (slug = 'trustmeup-trust:save-tea-cups-all-around-the-world') => {
  try {
    // For now, using mock data. Replace with actual GraphQL call
    // const response = await fetch('/graphql', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     query: CAMPAIGN_QUERY,
    //     variables: { slug }
    //   })
    // });
    // const data = await response.json();
    
    // Using mock data for development
    return mockGraphQLResponse.data.campaign;
  } catch (error) {
    console.error('Error fetching campaign data:', error);
    return null;
  }
};

// Function to extract donation tiers and convert to prize options
const extractPrizeOptions = (campaignData) => {
  if (!campaignData || !campaignData.tiers || !campaignData.tiers.edges) {
    return [];
  }

  const tierOptions = campaignData.tiers.edges
    .map(edge => edge.node)
    .filter(tier => !tier.isSoldOut && tier.stockLeft > 0)
    .map(tier => ({
      label: `€${parseFloat(tier.donationAmount).toFixed(2)}`,
      value: parseFloat(tier.donationAmount),
      description: tier.description || tier.descriptionEn || '',
      tierId: tier.id
    }))
    .sort((a, b) => a.value - b.value); // Sort by amount ascending

  // Add "Free Entry" option at the beginning
  const freeEntryOption = {
    label: 'Free Entry',
    value: 0,
    description: '',
    tierId: 'free-entry'
  };

  return [freeEntryOption, ...tierOptions];
};

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
  const [prizeOptions, setPrizeOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [campaignName, setCampaignName] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Fetch campaign data on component mount
  useEffect(() => {
    const loadCampaignData = async () => {
      setLoading(true);
      const campaignData = await fetchCampaignData();
      if (campaignData) {
        const options = extractPrizeOptions(campaignData);
        setPrizeOptions(options);
        setCampaignName(campaignData.name || '');
      }
      setLoading(false);
    };

    loadCampaignData();
  }, []);

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
    setShowSuccessPopup(true);
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

  if (loading) {
    return (
      <div className="App app-center lottery-bg">
        <div className="App-main">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

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
        prizeOptions={prizeOptions}
        campaignName={campaignName}
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

      {showSuccessPopup && (
        <div className="lottery-modal-overlay">
          <div className="tmup-card" style={{maxWidth: 380, textAlign: 'center', padding: '40px 32px'}}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: '#e6f9ed', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 18px auto'
            }}>
              <span style={{fontSize: 36, color: '#27ae60'}}>✓</span>
            </div>
            <h2 style={{color: '#27ae60', fontWeight: 700, fontSize: '2rem', margin: '0 0 10px 0'}}>Success!</h2>
            <div style={{margin: '0 0 28px 0', color: '#222', fontSize: '1.13rem', fontWeight: 500}}>
              Your draw has been successfully recorded.
            </div>
            <button
              className="tmup-add-btn"
              style={{
                background: '#27ae60',
                color: '#fff',
                fontWeight: 600,
                fontSize: '1.08rem',
                border: 'none',
                borderRadius: 10,
                padding: '12px 32px',
                margin: '0 auto',
                display: 'block',
                boxShadow: '0 2px 8px rgba(39,174,96,0.10)'
              }}
              onClick={() => {
                setShowSuccessPopup(false);
                setRewards([{ selectedPrize: 0, prizeName: '', winner: null }]);
                setShowModal(false);
                setShowWheel(false);
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;