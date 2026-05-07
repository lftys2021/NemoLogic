import React, { useState } from 'react';
import Board from './Board';
import Menu from '../menu/Menu';
import Shop from '../Shop/Shop';
import DifficultyMenu from '../menu/DifficultyMenu';
import StageMenu from '../menu/StageMenu';
import { STAGES } from './stages/stages';

import './css/App.css';

function App() {
  const [view, setView] = useState('MAIN'); // MAIN, DIFFICULTY, STAGE, GAME
  const [difficulty, setDifficulty] = useState(null);
  const [selectedSolution, setSelectedSolution] = useState(null);

  // 아이템 및 자원 상태
  const [items, setItems] = useState({
    lives: 3,
    dotHints: 3,
    lineHints: 1,
  });

  // 구매 로직
  const buyItem = (type) => {
    setItems(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
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
    
      {view === 'MAIN' && <Menu onStart={() => setView('DIFFICULTY')} onShop={() => setView('SHOP')} />}
      
      {view === 'SHOP' && <Shop items={items} onBuy={buyItem} onBack={() => setView('MAIN')} />}

      {view === 'DIFFICULTY' && <DifficultyMenu stages={STAGES} onSelect={(diff) => { setDifficulty(diff); setView('STAGE'); }} onBack={() => setView('MAIN')} />}

      {view === 'STAGE' && <StageMenu difficulty={difficulty} stages={STAGES} onSelect={(sol) => { setSelectedSolution(sol); setView('GAME'); }} onBack={() => setView('DIFFICULTY')} />}

      {view === 'GAME' && <Board solution={selectedSolution} initialItems={items} onExit={() => setView('MAIN')} />}
    </div>
  );
}

export default App;