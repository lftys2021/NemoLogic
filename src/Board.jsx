import React, { useState, useCallback, useEffect } from 'react';
import RowHints from './hints/RowHints';
import ColHints from './hints/ColHints';
import Cell from './Cell';
import { getHints, checkWin } from './utils';
import Menu from './menu/Menu';

const Board = ({ solution, initialItems, onExit, onWin }) => {

    const size = solution.length;
    const [grid, setGrid] = useState(Array(solution.length).fill().map(() => Array(solution.length).fill(0)));
    const [lives, setLives] = useState(initialItems.lives);
    const [dotHints, setDotHints] = useState(initialItems.dotHints);
    const [lineHints, setLineHints] = useState(initialItems.lineHints);
    const [gameState, setGameState] = useState('PLAYING');

    // 드래그 관련 상태
    const [isDragging, setIsDragging] = useState(false);
    const [dragMode, setDragMode] = useState(null); // 1: 색칠, 2: X, 0: 지우기

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

    const handleCellAction = useCallback((r, c, type) => {
        // 이미 색칠된 정답은 수정 불가하게 하거나, 자유 모드라면 토글 로직 적용
        setGrid(prev => {
            const newGrid = prev.map(row => [...row]);
            
            // 드래그 도중 현재 셀의 상태가 이미 목표 상태와 같다면 업데이트 방지
            if (newGrid[r][c] === type) return prev;

            // 정답 체크 로직 (실수 시 라이프 차감 로직을 여기에 결합 가능)
            if (type === 1 && solution[r][c] !== 1) {
            // 드래그 중에는 alert이 계속 뜨면 안 되므로 별도 처리 권장
            return prev; 
            }
            
            newGrid[r][c] = type;
            return newGrid;
        });
    }, [solution]);

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

    // 마우스 클릭 시작
    const onMouseDown = (r, c, e) => {
        e.preventDefault();
        setIsDragging(true);
        
        let mode;
        if (e.button === 2) { // 우클릭
        mode = grid[r][c] === 2 ? 0 : 2;
        } else { // 좌클릭
        mode = grid[r][c] === 1 ? 0 : 1;
        }
        
        setDragMode(mode);
        handleCellAction(r, c, mode);
    };

    // 마우스 이동 중 (다른 셀로 진입)
    const onMouseEnter = (r, c) => {
        if (!isDragging) return;
        handleCellAction(r, c, dragMode);
    };

    const restartGame = () => {
        setGrid(Array(size).fill().map(() => Array(size).fill(0)));
        setLives(3);
        setHintsLeft(3);
        setGameState('PLAYING');
    };

    // 승리 조건 체크
    // Board 내부의 useEffect 승리 체크 로직 수정
    useEffect(() => {
        if (gameState === 'PLAYING' && checkWin(grid, solution)) {
        setGameState('WON');
        onWin(); // 부모 컴포넌트의 코인 지급 함수 호출
        }
    }, [grid, solution, gameState, onWin]);

    // 라이프 체크
    useEffect(() => {
        if (lives <= 0) setGameState('LOST');
    }, [lives]);

    // 마우스를 뗄 때 드래그 종료
    useEffect(() => {
        const handleGlobalMouseUp = () => setIsDragging(false);
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, []);

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
                <div className="grid" onContextMenu={(e) => e.preventDefault()}>
                    {grid.map((row, r) => (
                    <div key={r} className="grid-row">
                        {row.map((val, c) => (
                        <Cell key={`${r}-${c}`} r={r} c={c} value={val} onClick={handleCellClick} onMouseDown={onMouseDown} 
                        onMouseEnter={onMouseEnter} />
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