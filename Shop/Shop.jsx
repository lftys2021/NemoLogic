import React from 'react';

const Shop = ({ items, onBuy, onBack }) => {
  const products = [
    { id: 'lives', name: '하트 추가', icon: '❤️' },
    { id: 'dotHints', name: '점 힌트', icon: '📍' },
    { id: 'lineHints', name: '라인 힌트', icon: '📏' },
  ];

  return (
    <div className="menu-overlay">
      <div className="shop-content">
        <h2>아이템 상점</h2>
        <div className="inventory-summary">
          보유: ❤️x{items.lives} | 📍x{items.dotHints} | 📏x{items.lineHints}
        </div>
        <div className="product-list">
          {products.map(p => (
            <div key={p.id} className="product-card">
              <span>{p.icon} {p.name}</span>
              <button onClick={() => onBuy(p.id)}>구매하기</button>
            </div>
          ))}
        </div>
        <button className="btn-secondary" onClick={onBack}>나가기</button>
      </div>
    </div>
  );
};

export default Shop;