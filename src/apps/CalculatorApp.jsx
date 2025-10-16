import React, { useState, useEffect, useRef } from 'react';

const CalculatorApp = () => {
  const [expression, setExpression] = useState('');
  const audioRef = useRef(null);

  // audio setup
  useEffect(() => {
    audioRef.current = new Audio('/click.mp3');
    audioRef.current.load();
  }, []);

  const playClickSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Audio play failed:", error);
          try {
            const newAudio = new Audio('/click.mp3');
            newAudio.play();
          } catch (e) {
            console.log("Fallback audio also failed:", e);
          }
        });
      }
    }
  };

  const updateDisplay = () => {
    return expression || '0';
  };

  const inputNumber = (num) => {
    playClickSound();
    setExpression(prev => prev + num);
  };

  const inputOperator = (op) => {
    playClickSound();
    setExpression(prev => {
      if (prev === '') return prev;
      const lastChar = prev[prev.length - 1];
      if ('+-*/'.includes(lastChar)) {
        return prev.slice(0, -1) + op;
      }
      return prev + op;
    });
  };

  const calculate = () => {
    playClickSound();
    try {
      setExpression(eval(expression).toString());
    } catch {
      setExpression('Error');
    }
  };

  const clearDisplay = () => {
    playClickSound();
    setExpression('');
  };

  const deleteLast = () => {
    playClickSound();
    setExpression(prev => prev.slice(0, -1));
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;
      if ((key >= '0' && key <= '9') || key === '.') {
        playClickSound();
        inputNumber(key);
      } else if ('+-*/'.includes(key)) {
        playClickSound();
        inputOperator(key);
      } else if (key === 'Enter' || key === '=') {
        playClickSound();
        calculate();
      } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        playClickSound();
        clearDisplay();
      } else if (key === 'Backspace') {
        playClickSound();
        deleteLast();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const styles = {
    container: {
      width: '100%',
      height: '100%',
      background: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Courier Prime', monospace"
    },
    calculator: {
      width: 'min(300px, 100%)', 
      height: 'min(380px, 100%)', 
      background: 'transparent',
      borderRadius: '20px',
      padding: '20px',
      boxSizing: 'border-box', 
      border: '2px solid #3E2B27',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      boxShadow: '10px 10px 20px rgba(30, 26, 25, 0.4), -10px -10px 20px rgba(198, 193, 181, 0.2)'
    },
    display: {
      width: '100%',
      height: '60px',
      background: '#E5DCC8',
      border: '2px solid #3E2B27',
      borderRadius: '10px',
      fontSize: '18px',
      fontWeight: '700',
      color: '#1E1A19',
      textAlign: 'right',
      padding: '10px 15px',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      letterSpacing: '1px',
      overflowX: 'auto',
      whiteSpace: 'nowrap'
    },
    buttons: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '8px',
      flex: 1,
      gridTemplateRows: 'repeat(5, 1fr)'
    },
    button: {
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      padding: '0',
      minHeight: '45px',
      boxShadow: '4px 4px 8px rgba(30, 26, 25, 0.3), -3px -3px 6px rgba(198, 193, 181, 0.5)',
      transition: 'transform 0.1s ease',
      fontFamily: "'Courier Prime', monospace"
    },
    number: {
      background: '#C6C1B5',
      color: '#1E1A19'
    },
    operator: {
      background: '#A3B1A2',
      color: '#1E1A19'
    },
    equals: {
      background: '#8B2A2A',
      color: '#E5DCC8',
      gridRow: 'span 2'
    },
    clear: {
      background: '#7C8B6A',
      color: '#E5DCC8',
      gridColumn: 'span 2'
    },
    zero: {
      gridColumn: 'span 2'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.calculator}>
        <div style={styles.display}>{updateDisplay()}</div>
        <div style={styles.buttons}>
          <button 
            style={{...styles.button, ...styles.clear}} 
            onClick={clearDisplay}
          >
            CLEAR
          </button>
          <button 
            style={{...styles.button, ...styles.operator}} 
            onClick={() => inputOperator('/')} 
            title="÷"
          >
            ÷
          </button>
          <button 
            style={{...styles.button, ...styles.operator}} 
            onClick={() => inputOperator('*')} 
            title="×"
          >
            ×
          </button>
          <button 
            style={{...styles.button, ...styles.operator}} 
            onClick={deleteLast} 
            title="Delete"
          >
            ⌫
          </button>

          <button 
            style={{...styles.button, ...styles.number}} 
            onClick={() => inputNumber('7')}
          >
            7
          </button>
          <button 
            style={{...styles.button, ...styles.number}} 
            onClick={() => inputNumber('8')}
          >
            8
          </button>
          <button 
            style={{...styles.button, ...styles.number}} 
            onClick={() => inputNumber('9')}
          >
            9
          </button>
          <button 
            style={{...styles.button, ...styles.operator}} 
            onClick={() => inputOperator('-')}
          >
            −
          </button>

          <button 
            style={{...styles.button, ...styles.number}} 
            onClick={() => inputNumber('4')}
          >
            4
          </button>
          <button 
            style={{...styles.button, ...styles.number}} 
            onClick={() => inputNumber('5')}
          >
            5
          </button>
          <button 
            style={{...styles.button, ...styles.number}} 
            onClick={() => inputNumber('6')}
          >
            6
          </button>
          <button 
            style={{...styles.button, ...styles.operator}} 
            onClick={() => inputOperator('+')}
          >
            +
          </button>

          <button 
            style={{...styles.button, ...styles.number}} 
            onClick={() => inputNumber('1')}
          >
            1
          </button>
          <button 
            style={{...styles.button, ...styles.number}} 
            onClick={() => inputNumber('2')}
          >
            2
          </button>
          <button 
            style={{...styles.button, ...styles.number}} 
            onClick={() => inputNumber('3')}
          >
            3
          </button>
          <button 
            style={{...styles.button, ...styles.equals}} 
            onClick={calculate}
          >
            =
          </button>

          <button 
            style={{...styles.button, ...styles.number, ...styles.zero}} 
            onClick={() => inputNumber('0')}
          >
            0
          </button>
          <button 
            style={{...styles.button, ...styles.number}} 
            onClick={() => inputNumber('.')}
          >
            .
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalculatorApp;