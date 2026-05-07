import React, { useState, useCallback, useEffect } from 'react';
import RowHints from './hints/RowHints';
import ColHints from './hints/ColHints';
import Cell from './Cell';
import { getHints, checkWin } from './utils';
import Menu from '../menu/Menu';

const Board = ({ solution, initialItems, onExit }) => {

    const size = solution.length;
    const [grid, setGrid] = useState(Array(solution.length).fill().map(() => Array(solution.length).fill(0)));
    const [lives, setLives] = useState(initialItems.lives);
    const [dotHints, setDotHints] = useState(initialItems.dotHints);
    const [lineHints, setLineHints] = useState(initialItems.lineHints);
    const [gameState, setGameState] = useState('PLAYING');

    const rowHints = solution.map(row => getHints(row));
    const colHints = Array(size).fill().map((_, i) => getHints(solution.map(row => row[i])));

    // 1. 랜덤 점 힌트
    const useDotHint = () => {
        if (dotHints <= 0) return;
        const emptyCells = [];
        solution.forEach((row, r) => row.forEach((val, c) => {
        if (val === 1 && grid[r][c] === 0) emptyCells.push({ r, c });
        }));
        if (emptyCells.length > 0) {
        const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        updateGrid(r, c, 1);
        setDotHints(prev => prev - 1);
        }
    };

    // 2. 지정 라인 힌트 (랜덤으로 한 행을 완성)
    const useLineHint = () => {
        if (lineHints <= 0) return;
        // 아직 완성되지 않은 행 찾기
        const incompleteRows = solution.map((row, r) => r).filter(r => 
        solution[r].some((val, c) => val === 1 && grid[r][c] === 0)
        );

        if (incompleteRows.length > 0) {
        const targetRow = incompleteRows[Math.floor(Math.random() * incompleteRows.length)];
        const newGrid = grid.map((row, r) => 
            r === targetRow ? solution[r].map((val, c) => val === 1 ? 1 : row[c]) : row
        );
        setGrid(newGrid);
        setLineHints(prev => prev - 1);
        }
    };

    const updateGrid = (r, c, val) => {
        const newGrid = grid.map((row, rowIdx) => 
        rowIdx === r ? row.map((cell, colIdx) => colIdx === c ? val : cell) : row
        );
        setGrid(newGrid);
    };

    // 승리 조건 체크
    useEffect(() => {
      if (gameState === 'PLAYING' && checkWin(grid, solution)) {
        setGameState('WON');
      }
    }, [grid, solution, gameState]);

    // 라이프 체크
    useEffect(() => {
        if (lives <= 0) setGameState('LOST');
    }, [lives]);

    // 셀 클릭 핸들러 (useCallback으로 최적화)
    const handleCellClick = useCallback((r, c, e) => {
        if (gameState !== 'PLAYING') return;
        e.preventDefault();
    
        // 이미 채워진 칸은 아무 동작도 안 함
        if (grid[r][c] !== 0) return;

        const isRightClick = e.type === 'contextmenu';
        const isCorrect = solution[r][c] === 1;
    
        if (isRightClick) {
            const newGrid = grid.map(row => [...row]);
            newGrid[r][c] = 2;
            setGrid(newGrid);
        } else {
            if (isCorrect) {
              const newGrid = grid.map(row => [...row]);
              newGrid[r][c] = 1;
              setGrid(newGrid);
            } else {
              setLives(prev => prev - 1);
            }
        }
    }, [gameState, solution, grid]);

    const useHint = () => {
        if (hintsLeft <= 0 || gameState !== 'PLAYING') return;
        
        // 아직 채워지지 않은 정답 칸 중 하나를 랜덤하게 찾아 채워줌
        const emptyCorrectCells = [];
        solution.forEach((row, r) => {
          row.forEach((val, c) => {
            if (val === 1 && grid[r][c] === 0) emptyCorrectCells.push({ r, c });
          });
        });
    
        if (emptyCorrectCells.length > 0) {
          const randomCell = emptyCorrectCells[Math.floor(Math.random() * emptyCorrectCells.length)];
          const newGrid = grid.map(row => [...row]);
          newGrid[randomCell.r][randomCell.c] = 1;
          setGrid(newGrid);
          setHintsLeft(h => h - 1);
        }
    };

    const restartGame = () => {
        setGrid(Array(size).fill().map(() => Array(size).fill(0)));
        setLives(3);
        setHintsLeft(3);
        setGameState('PLAYING');
    };

    return (
        <div className={`game-container`}>

            <div className="item-bar">
                <span>❤️ {lives}</span>
                <button onClick={useDotHint}>📍 힌트({dotHints})</button>
                <button onClick={useLineHint}>📏 라인({lineHints})</button>
            </div>
    
            <div className="game-board">
                <ColHints colHints={colHints} />
                <div className="main-area">
                <RowHints rowHints={rowHints} />
                <div className="grid">
                    {grid.map((row, r) => (
                    <div key={r} className="grid-row">
                        {row.map((val, c) => (
                        <Cell key={`${r}-${c}`} r={r} c={c} value={val} onClick={handleCellClick} />
                        ))}
                    </div>
                    ))}
                </div>
                </div>
            </div>

            {/* 게임 UI (Status Bar, Board 등) */}
            <div className="status-bar">
                <button onClick={onExit}>나가기</button>
            </div>
    
            {gameState === 'WON' && <div className="overlay win">🎉 SUCCESS! 🎉</div>}
            {gameState === 'LOST' && <div className="overlay lose">💀 GAME OVER 💀</div>}

            {/* 승리/패배 시 메뉴 팝업 노출 */}
            {gameState !== 'PLAYING' && (
                <Menu 
                type={gameState} 
                onStart={restartGame} 
                onGoHome={onExit} 
                />
            )}
        </div>
    );
};

export default Board;