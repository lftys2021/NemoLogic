import React, { useState } from 'react';
import Board from './Board';
import Menu from './menu/Menu';
import Shop from './Shop/Shop';
import DifficultyMenu from './menu/DifficultyMenu';
import StageMenu from './menu/StageMenu';
import { STAGES } from './stages/stages';
import './css/App.css';

function App() {
  const [view, setView] = useState('MAIN'); // MAIN, DIFFICULTY, STAGE, GAME
  const [difficulty, setDifficulty] = useState(null);
  const [selectedSolution, setSelectedSolution] = useState(null);

  // 자원 상태 관리
  const [coins, setCoins] = useState(50); // 초기 코인

  // 아이템 및 자원 상태
  const [items, setItems] = useState({
    lives: 3,
    dotHints: 3,
    lineHints: 1,
  });

  // 난이도별 보상 설정
  const REWARDS = { '기초': 1, '초급': 2, '중급': 4, '고급': 8 };
  
  // 아이템 가격 설정
  const PRICES = { dotHints: 10, lineHints: 100, lives: 50 };

  // 구매 로직
  const buyItem = (type) => {
    if (coins >= PRICES[type]) {
      setCoins(prev => prev - PRICES[type]);
      setItems(prev => ({ ...prev, [type]: prev[type] + 1 }));
    } else {
      
    }
  };

  // 클리어 보상 지급 (Board에서 호출됨)
  const handleWin = (diff) => {
    const reward = REWARDS[diff] || 0;
    setCoins(prev => prev + reward);
  };

  // 네비게이션 함수들
  const goToDifficulty = () => setView('DIFFICULTY');
  const goToStage = (diff) => {
    setDifficulty(diff);
    setView('STAGE');
  };
  
  const startGame = (solution) => {
    setSelectedSolution(solution);
    setView('GAME');
  };

  const resetToMain = () => {
    setView('MAIN');
    setDifficulty(null);
    setSelectedSolution(null);
  };

  return (
    <div className="app">
      {/* 상단 바에 항상 코인 표시 가능 */}
      <div className="top-info">💰 {coins}</div>

      {view === 'MAIN' && <Menu onStart={() => setView('DIFFICULTY')} onShop={() => setView('SHOP')} />}
      
      {view === 'SHOP' && (
        <Shop 
          items={items} 
          coins={coins} 
          prices={PRICES} 
          onBuy={buyItem} 
          onBack={() => setView('MAIN')} 
        />
      )}

      {view === 'DIFFICULTY' && <DifficultyMenu stages={STAGES} onSelect={(diff) => { setDifficulty(diff); setView('STAGE'); }} onBack={() => setView('MAIN')} />}

      {view === 'STAGE' && <StageMenu difficulty={difficulty} stages={STAGES} onSelect={(sol) => { setSelectedSolution(sol); setView('GAME'); }} onBack={() => setView('DIFFICULTY')} />}

      {view === 'GAME' && (
        <Board 
          solution={selectedSolution} 
          difficulty={difficulty}
          initialItems={items} 
          onWin={() => handleWin(difficulty)} 
          onExit={resetToMain} 
        />
      )}
    </div>
  );
}

export default App;