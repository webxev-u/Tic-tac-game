import { useState, useEffect } from 'react';

function App() {
  const [positionsPlayed, setPositionsPlayed] = useState({});
  const [currentSymbol, setCurrentSymbol] = useState(Math.random() < 0.5 ? 'X' : 'O');
  const [gameOver, setGameOver] = useState(false);
  const [status, setStatus] = useState(`Player ${currentSymbol}'s Turn`);
  const waysOfWinning = [
    [0, 1, 2], [6, 7, 8], [0, 3, 6], [2, 5, 8],
    [3, 4, 5], [1, 4, 7], [0, 4, 8], [2, 4, 6]
  ];
  const corners = [0, 2, 6, 8];
  const diagonals = [[0, 8], [2, 6]];

  const checkForWins = () => {
    for (let winList of waysOfWinning) {
      if (winList.every(idx => idx in positionsPlayed)) {
        if (winList.every(idx => positionsPlayed[idx] === 'X')) {
          highlightWin(winList, 'X');
          return true;
        }
        if (winList.every(idx => positionsPlayed[idx] === 'O')) {
          highlightWin(winList, 'O');
          return true;
        }
      }
    }
    return false;
  };

  const highlightWin = (winList, symbol) => {
    setStatus(`${symbol} Wins!`);
    setGameOver(true);
    setPositionsPlayed(prev => {
      const newPositions = { ...prev };
      Object.keys(newPositions).forEach(idx => {
        newPositions[idx] = {
          symbol: newPositions[idx],
          class: winList.includes(parseInt(idx)) ? 'winning' : 'losing'
        };
      });
      return newPositions;
    });
  };

  const analyze = () => {
    if (Object.keys(positionsPlayed).length === 9) {
      setStatus("It's a Draw!");
      setGameOver(true);
      setPositionsPlayed(prev => {
        const newPositions = { ...prev };
        Object.keys(newPositions).forEach(idx => {
          newPositions[idx] = { symbol: newPositions[idx], class: 'losing' };
        });
        return newPositions;
      });
      return;
    }
    if (checkForWins()) return;
    if (currentSymbol === 'O') {
      setTimeout(aiPlay, 300); // AI plays as 'O'
    } else {
      setStatus(`Player ${currentSymbol}'s Turn`);
    }
  };

  const aiPlay = () => {
    if (gameOver) return;
    let spot = null;

    // First move: Choose a corner
    if (!Object.keys(positionsPlayed).length) {
      spot = corners[Math.floor(Math.random() * corners.length)];
    }
    // Second move: Counter diagonal or take center
    else if (Object.keys(positionsPlayed).length === 2) {
      for (let diag of diagonals) {
        const [a, b] = diag;
        if (a in positionsPlayed && !(b in positionsPlayed)) {
          spot = b;
          break;
        } else if (b in positionsPlayed && !(a in positionsPlayed)) {
          spot = a;
          break;
        }
      }
    }
    // Third move: Take center if available
    else if (Object.keys(positionsPlayed).length === 1 && !(4 in positionsPlayed)) {
      spot = 4;
    }
    // Later moves: Block or win
    else {
      spot = logic();
      if (!spot) {
        const available = Array.from({length: 9}, (_, i) => i).filter(i => !(i in positionsPlayed));
        spot = available[Math.floor(Math.random() * available.length)];
      }
    }

    if (spot !== null && !(spot in positionsPlayed)) {
      setPositionsPlayed(prev => ({
        ...prev,
        [spot]: { symbol: currentSymbol, class: '' }
      }));
      setCurrentSymbol(currentSymbol === 'X' ? 'O' : 'X');
      analyze();
    }
  };

  const logic = () => {
    for (let lst of waysOfWinning) {
      const [a, b, c] = lst;
      if (a in positionsPlayed && b in positionsPlayed && positionsPlayed[a].symbol === positionsPlayed[b].symbol && !(c in positionsPlayed)) {
        return c;
      }
      if (a in positionsPlayed && c in positionsPlayed && positionsPlayed[a].symbol === positionsPlayed[c].symbol && !(b in positionsPlayed)) {
        return b;
      }
      if (b in positionsPlayed && c in positionsPlayed && positionsPlayed[b].symbol === positionsPlayed[c].symbol && !(a in positionsPlayed)) {
        return a;
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (gameOver || positionsPlayed[index] || currentSymbol === 'O') return;
    setPositionsPlayed(prev => ({
      ...prev,
      [index]: { symbol: currentSymbol, class: '' }
    }));
    setCurrentSymbol(currentSymbol === 'X' ? 'O' : 'X');
    analyze();
  };

  const resetGame = () => {
    setPositionsPlayed({});
    setGameOver(false);
    setCurrentSymbol(Math.random() < 0.5 ? 'X' : 'O');
    setStatus(`Player ${currentSymbol}'s Turn`);
  };

  useEffect(() => {
    if (currentSymbol === 'O' && !gameOver) {
      setTimeout(aiPlay, 300);
    }
  }, [currentSymbol, gameOver]);

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center text-white mb-6">Tic-Tac-Toe</h1>
        <div className="text-2xl text-center text-white mb-4">{status}</div>
        <div className="grid grid-cols-3 gap-2 w-80 mx-auto">
          {Array.from({length: 9}).map((_, i) => (
            <div
              key={i}
              className={`cell bg-gray-800 text-white text-4xl font-bold flex items-center justify-center h-20 cursor-pointer ${positionsPlayed[i]?.class || ''}`}
              onClick={() => handleClick(i)}
            >
              {positionsPlayed[i]?.symbol || ''}
            </div>
          ))}
        </div>
        <button
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mx-auto block"
          onClick={resetGame}
        >
          Reset Game
        </button>
      </div>
    </div>
  );
}

export default App;
