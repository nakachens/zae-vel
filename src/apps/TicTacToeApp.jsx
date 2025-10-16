/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';

const AutumnTicTacToe = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [board, setBoard] = useState(['', '', '', '', '', '', '', '', '']);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [gameActive, setGameActive] = useState(true);
  const [playerWins, setPlayerWins] = useState(0);
  const [zhongliWins, setZhongliWins] = useState(0);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [showGamePopup, setShowGamePopup] = useState(false);
  const [showStatsPopup, setShowStatsPopup] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  
  const audioRef = useRef(null);

  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  // function to play the click sound
  const playClickSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.log("Audio play failed:", error);
      });
    }
  };

  useEffect(() => {
    audioRef.current = new Audio('/click.mp3');
    audioRef.current.volume = 0.3;
  }, []);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(true); // Still show even if fails
    img.src = './assets/silly.jpg';
  }, []);

  const startGame = () => {
    playClickSound();
    setCurrentScreen('game');
    resetGame();
  };

  const goHome = () => {
    playClickSound();
    setCurrentScreen('home');
    setShowGamePopup(false);
    setShowStatsPopup(false);
  };

  const resetGame = () => {
    setBoard(['', '', '', '', '', '', '', '', '']);
    setCurrentPlayer('X');
    setGameActive(true);
  };

  const makeMove = (index) => {
    if (board[index] !== '' || !gameActive || currentPlayer !== 'X') {
      return;
    }

    playClickSound();
    
    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    if (checkWinner(newBoard)) {
      endGame('Player');
      return;
    }

    if (newBoard.every(cell => cell !== '')) {
      endGame('Draw');
      return;
    }

    setCurrentPlayer('O');
    setTimeout(() => zhongliMove(newBoard), 800);
  };

  const zhongliMove = (currentBoard) => {
    if (!gameActive) return;

    const availableMoves = currentBoard.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
    
    if (availableMoves.length === 0) return;

    const move = getBestMove(currentBoard);
    
    const newBoard = [...currentBoard];
    newBoard[move] = 'O';
    setBoard(newBoard);

    if (checkWinner(newBoard)) {
      endGame('Zhongli');
      return;
    }

    if (newBoard.every(cell => cell !== '')) {
      endGame('Draw');
      return;
    }

    setCurrentPlayer('X');
  };

  const getBestMove = (currentBoard) => {
    for (let i = 0; i < currentBoard.length; i++) {
      if (currentBoard[i] === '') {
        const testBoard = [...currentBoard];
        testBoard[i] = 'O';
        if (checkWinner(testBoard)) {
          return i;
        }
      }
    }

    for (let i = 0; i < currentBoard.length; i++) {
      if (currentBoard[i] === '') {
        const testBoard = [...currentBoard];
        testBoard[i] = 'X';
        if (checkWinner(testBoard)) {
          return i;
        }
      }
    }

    if (currentBoard[4] === '') {
      return 4;
    }

    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => currentBoard[i] === '');
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    const availableMoves = currentBoard.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  };

  const checkWinner = (currentBoard) => {
    return winningConditions.some(condition => {
      const [a, b, c] = condition;
      return currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c];
    });
  };

  const endGame = (winner) => {
    setGameActive(false);

    let message = '';
    if (winner === 'Player') {
      message = 'you have beaten me..as it seems...';
      setPlayerWins(prev => prev + 1);
    } else if (winner === 'Zhongli') {
      message = 'it seems like i have won this match..';
      setZhongliWins(prev => prev + 1);
    } else {
      message = 'A tie is not a loss.. yet its also not a win.. do not think of getting cocky my dear';
    }

    setChatMessage(message);
    setShowGamePopup(true);
    playClickSound();
  };

  const playAgain = () => {
    playClickSound();
    setShowGamePopup(false);
    resetGame();
  };

  const showWinners = () => {
    playClickSound();
    setShowStatsPopup(true);
  };

  const closeStats = () => {
    playClickSound();
    setShowStatsPopup(false);
  };

  const getGameInfo = () => {
    if (!gameActive) return '';
    if (currentPlayer === 'X') {
      return 'Your turn! You are X';
    } else {
      return 'Zhongli is thinking...';
    }
  };

  const getOverallMessage = () => {
    if (playerWins === 0 && zhongliWins === 0) {
      return 'No matches played yet!';
    } else if (playerWins > zhongliWins) {
      return '🎉 You won more matches!';
    } else if (zhongliWins > playerWins) {
      return 'Zhong dong won more matches!';
    } else {
      return '🤝 It\'s tied overall!';
    }
  };

  const styles = {
  container: {
    fontFamily: "'Nunito', sans-serif",
    background: 'transparent',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#1E1A19',
    position: 'relative',
    overflow: 'hidden'
  },
  appContainer: {
    background: 'transparent',
    borderRadius: '20px',
    padding: '12px', 
    boxSizing: 'border-box',
    boxShadow: '0 15px 35px rgba(30, 26, 25, 0.3)',
    border: '3px solid #3E2B27',
    width: '100%',
    height: '100%',
    maxWidth: '360px',
    maxHeight: '420px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  title: {
    fontFamily: "'Fredoka One', cursive",
    fontSize: '2em', 
    color: '#3E2B27',
    marginBottom: '5px', 
    textShadow: '2px 2px 4px rgba(30, 26, 25, 0.2)',
    flexShrink: 0
  },
  button: {
    background: 'linear-gradient(145deg, #C6C1B5, #A3B1A2)',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '25px',
    fontFamily: "'Nunito', sans-serif",
    fontWeight: '600',
    fontSize: '0.9em',
    color: '#1E1A19',
    cursor: 'pointer',
    margin: '6px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(62, 43, 39, 0.3)'
  },
  homeScreen: {
    display: currentScreen === 'home' ? 'flex' : 'none',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    gap: '20px'
  },
  gameScreen: {
    display: currentScreen === 'game' ? 'flex' : 'none',
    flexDirection: 'column',
    justifyContent: 'flex-start', 
    height: '100%',
    padding: '5px 0' 
  },
  homeButtonContainer: {
    marginTop: 'auto', 
    paddingTop: '10px'
  },
  gameBoard: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '6px',
    margin: '10px auto', 
    background: '#7C8B6A',
    padding: '10px',
    borderRadius: '15px',
    boxShadow: 'inset 0 4px 8px rgba(30, 26, 25, 0.3)',
    width: '210px', 
    height: '210px',
    aspectRatio: '1 / 1',
    boxSizing: 'content-box'
  },
  cell: {
    width: '60px',
    height: '60px',
    background: '#E5DCC8',
    border: 'none',
    borderRadius: '10px',
    fontFamily: "'Fredoka One', cursive",
    fontSize: '1.5em',
    color: '#1E1A19',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 3px 10px rgba(30, 26, 25, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '60px',
    minHeight: '60px',
    flexShrink: 0
  },
  gameInfo: {
    margin: '8px 0', 
    fontWeight: '700',
    fontSize: '0.9em', 
    flexShrink: 0
  },
  popupOverlay: {
    display: showGamePopup || showStatsPopup ? 'flex' : 'none',
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: 'rgba(30, 26, 25, 0.5)',
    zIndex: 10000,
    backdropFilter: 'blur(3px)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  popup: {
    background: '#E5DCC8',
    padding: '25px',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 20px 40px rgba(30, 26, 25, 0.4)',
    border: '3px solid #3E2B27',
    minWidth: '260px',
    maxWidth: '90%'
  },
  popupTitle: {
    fontFamily: "'Fredoka One', cursive",
    fontSize: '1.5em',
    color: '#3E2B27',
    marginBottom: '15px'
  },
  popupText: {
    marginBottom: '15px',
    fontWeight: '600',
    color: '#1E1A19',
    fontSize: '1em'
  },
  chatPopup: {
    background: 'linear-gradient(135deg, #3E2B27 0%, #2A1F1D 100%)',
    border: '3px solid #1E1A19',
    color: 'white',
    padding: '0',
    borderRadius: '15px',
    minWidth: '250px',
    maxWidth: '280px',
    overflow: 'hidden'
  },
  chatHeader: {
    background: 'linear-gradient(135deg, #7C8B6A 0%, #A3B1A2 100%)',
    padding: '10px 15px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderBottom: '2px solid #1E1A19'
  },
  chatPfp: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #8B2A2A, #6B1F1F)',
    border: '2px solid #E5DCC8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2em',
    color: '#E5DCC8',
    flexShrink: 0
  },
  chatName: {
    fontFamily: "'Fredoka One', cursive",
    fontSize: '1em',
    color: '#1E1A19',
    textShadow: '1px 1px 2px rgba(229, 220, 200, 0.3)'
  },
  chatBody: {
    padding: '15px',
    background: 'linear-gradient(135deg, #3E2B27 0%, #2A1F1D 100%)',
    position: 'relative'
  },
  chatDialogue: {
    background: 'rgba(124, 139, 106, 0.15)',
    border: '2px solid #7C8B6A',
    borderRadius: '10px',
    padding: '12px',
    marginBottom: '15px',
    position: 'relative'
  },
  chatText: {
    fontFamily: "'Nunito', sans-serif",
    fontSize: '0.95em',
    color: '#E5DCC8',
    margin: '0',
    textAlign: 'left',
    lineHeight: '1.4'
  },
  chatButtons: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  chatBtn: {
    background: 'linear-gradient(145deg, #7C8B6A, #A3B1A2)',
    border: '2px solid #1E1A19',
    padding: '8px 15px',
    borderRadius: '20px',
    fontFamily: "'Nunito', sans-serif",
    fontWeight: '600',
    fontSize: '0.8em',
    color: '#1E1A19',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  stats: {
    background: '#C6C1B5',
    padding: '12px',
    borderRadius: '10px',
    margin: '12px 0',
    border: '2px solid #A3B1A2'
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '6px 0',
    fontWeight: '600',
    fontSize: '0.9em'
  },
  winnerText: {
    fontStyle: 'italic',
    color: '#3E2B27',
    fontWeight: '700',
    marginTop: '8px',
    fontSize: '0.9em'
  }
};

  return (
    <>
      <audio ref={audioRef} src="/click.mp3" preload="auto" />
      
      <div style={styles.container}>
        <div style={styles.appContainer}>
          {/* homescreen*/}
          <div style={styles.homeScreen}>
            <h1 style={styles.title}> ★ TickleTackleToe ☆</h1>
            <button style={styles.button} onClick={startGame}>Start Game</button>
            <button style={styles.button} onClick={showWinners}>Show Winners</button>
          </div>

          {/* gamescreen*/}
          <div style={styles.gameScreen}>
            <h1 style={styles.title}>ദ്ദി ˉ͈̀꒳ˉ͈́ )✧ Playing...</h1>
            <div style={styles.gameInfo}>{getGameInfo()}</div>
            <div style={styles.gameBoard}>
              {board.map((cell, index) => (
                <button 
                key={index}
                className="cell" 
                style={styles.cell}
                onClick={() => makeMove(index)}
                disabled={cell !== '' || !gameActive || currentPlayer !== 'X'}
                >
                  {cell}
                </button>
              ))}
            </div>
            <button 
              style={styles.button} 
              onClick={goHome}
              onMouseEnter={(e) => {
  e.target.style.transform = 'translateY(-2px)';
  e.target.style.boxShadow = '0 6px 20px rgba(62, 43, 39, 0.4)';
  e.target.style.background = 'linear-gradient(145deg, #A3B1A2, #7C8B6A)';
}}
onMouseLeave={(e) => {
  e.target.style.transform = 'translateY(0)';
  e.target.style.boxShadow = '0 4px 15px rgba(62, 43, 39, 0.3)';
  e.target.style.background = 'linear-gradient(145deg, #C6C1B5, #A3B1A2)';
}}
            >
              Home .ᐟ
            </button>
          </div>
        </div>

        {/* popup*/}
        <div style={styles.popupOverlay}>
          {/* game result */}
          {showGamePopup && (
            <div style={styles.chatPopup}>
              <div style={styles.chatHeader}>
                <div style={styles.chatPfp}>
                  <img 
                    src="./assets/silly.jpg" 
                    alt="Zhongli"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <div style={styles.chatName}>Zhongli</div>
              </div>
              <div style={styles.chatBody}>
                <div style={styles.chatDialogue}>
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    left: '18px',
                    width: '0',
                    height: '0',
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderBottom: '8px solid #d4a574'
                  }}></div>
                  <p style={styles.chatText}>{chatMessage}</p>
                </div>
                <div style={styles.chatButtons}>
                  <button 
                    style={styles.chatBtn} 
                    onClick={playAgain}
                    onMouseEnter={(e) => {
  e.target.style.background = 'linear-gradient(145deg, #A3B1A2, #C6C1B5)';
  e.target.style.transform = 'translateY(-1px)';
}}
onMouseLeave={(e) => {
  e.target.style.background = 'linear-gradient(145deg, #7C8B6A, #A3B1A2)';
  e.target.style.transform = 'translateY(0)';
}}
                  >
                    Play Again
                  </button>
                  <button 
                    style={styles.chatBtn} 
                    onClick={goHome}
                    onMouseEnter={(e) => {
  e.target.style.transform = 'translateY(-2px)';
  e.target.style.boxShadow = '0 6px 20px rgba(62, 43, 39, 0.4)';
  e.target.style.background = 'linear-gradient(145deg, #A3B1A2, #7C8B6A)';
}}
onMouseLeave={(e) => {
  e.target.style.transform = 'translateY(0)';
  e.target.style.boxShadow = '0 4px 15px rgba(62, 43, 39, 0.3)';
  e.target.style.background = 'linear-gradient(145deg, #C6C1B5, #A3B1A2)';
}}
                  >
                    Home .ᐟ
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* winners */}
          {showStatsPopup && (
            <div style={styles.popup}>
              <h2 style={styles.popupTitle}>ᯓ Match Statistics</h2>
              <div style={styles.stats}>
                <div style={styles.statRow}>
                  <span>Player (You):</span>
                  <span>{playerWins} {playerWins === 1 ? 'win' : 'wins'}</span>
                </div>
                <div style={styles.statRow}>
                  <span>Zhongli:</span>
                  <span>{zhongliWins} {zhongliWins === 1 ? 'win' : 'wins'}</span>
                </div>
                <div style={styles.winnerText}>{getOverallMessage()}</div>
              </div>
              <button 
                style={styles.button} 
                onClick={closeStats}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(205, 133, 63, 0.4)';
                  e.target.style.background = 'linear-gradient(145deg, #f0e68c, #daa520)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(205, 133, 63, 0.3)';
                  e.target.style.background = 'linear-gradient(145deg, #deb887, #cd853f)';
                }}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AutumnTicTacToe;