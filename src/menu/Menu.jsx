import React from 'react';

const Menu = ({ onStart, onShop, type = 'MAIN', onGoHome }) => {
  const titles = {
    MAIN: "네모 로직 (Nonogram)",
    WON: "🎉 미션 성공! 🎉",
    LOST: "💀 게임 오버 💀"
  };

  return (
    <div className="menu-overlay">
      <div className="menu-content">
        <h1>{titles[type]}</h1>
        
        <div className="menu-buttons">
          <button className="btn-primary" onClick={onStart}>
            {type === 'MAIN' ? '▶️' : '🔄'}
          </button>
          {type === 'MAIN' ? 
            <button className="btn-shop" onClick={onShop}>🛒</button> : <button onClick={onGoHome}>🏠</button>
          }
        </div>
      </div>
    </div>
  );
};

export default Menu;