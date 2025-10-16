/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';

// TXT file comp
function TxtFileApp({ fileName = "document.txt", content = "", onClose }) {
  const [selectedText, setSelectedText] = useState('');
  const textAreaRef = useRef(null);

  const playClickSound = () => {
    const audio = new Audio('/click.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const handleTextSelect = () => {
    if (textAreaRef.current) {
      const start = textAreaRef.current.selectionStart;
      const end = textAreaRef.current.selectionEnd;
      const selected = content.substring(start, end);
      setSelectedText(selected);
    }
  };

  const menuItems = [
    { label: 'File', items: ['New', 'Open', 'Save', 'Save As', 'Exit'] },
    { label: 'Edit', items: ['Cut', 'Copy', 'Paste', 'Find', 'Replace'] },
    { label: 'Format', items: ['Word Wrap', 'Font'] },
    { label: 'View', items: ['Zoom In', 'Zoom Out', 'Status Bar'] },
    { label: 'Help', items: ['About Notepad'] }
  ];

  return (
  <div 
    style={{ 
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(145deg, #3E2B27 0%, #1E1A19 100%)',
      fontFamily: 'Courier New, monospace',
      overflow: 'hidden',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    }}
  >
    
    {/*menu*/}
    <div 
      style={{ 
        display: 'flex',
        background: 'linear-gradient(to right, #5A4A45, #4A3F3A)',
        borderBottom: '1px solid #7C8B6A',
        padding: '8px 16px',
        gap: '16px',
        flexShrink: 0,
        height: '40px',
        alignItems: 'center'
      }}
    >
      {menuItems.map((menu, index) => (
        <div key={index} style={{ position: 'relative' }}>
          <button 
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#E5DCC8',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'background-color 0.2s'
            }}
            onClick={playClickSound}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#6B4F47'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            {menu.label}
          </button>
        </div>
      ))}
    </div>

    {/* toolbar*/}
    <div 
      style={{ 
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(to right, #4A3F3A, #3E2B27)',
        borderBottom: '1px solid #7C8B6A',
        padding: '6px 16px',
        gap: '8px',
        flexShrink: 0,
        height: '36px'
      }}
    >
      {['📄', '📂', '💾', '✂️', '📋', '🔍', '🔎'].map((icon, index) => (
        <button
          key={index}
          style={{
            padding: '4px',
            border: '1px solid transparent',
            background: 'transparent',
            cursor: 'pointer',
            borderRadius: '2px',
            fontSize: '14px',
            transition: 'all 0.2s'
          }}
          onClick={playClickSound}
          title={['New', 'Open', 'Save', 'Cut', 'Paste', 'Edit', 'Find'][index]}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#6B4F47';
            e.target.style.borderColor = '#7C8B6A';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.borderColor = 'transparent';
          }}
        >
          {icon}
        </button>
      ))}
    </div>

    {/* content area*/}
    <div style={{ 
      flex: 1, 
      overflow: 'hidden', 
      position: 'relative',
      width: '100%',
      height: 'calc(100% - 104px)' 
    }}>
      <textarea
        ref={textAreaRef}
        value={content}
        readOnly
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
          resize: 'none',
          fontFamily: 'Courier New, monospace',
          color: '#E5DCC8',
          outline: 'none',
          background: '#1E1A19',
          fontWeight: 'bold',
          margin: 0,
          padding: '20px',
          boxSizing: 'border-box',
          fontSize: '13px',
          lineHeight: '1.5',
          letterSpacing: '0.5px',
          overflow: 'auto'
        }}
        onSelect={handleTextSelect}
        onClick={playClickSound}
      />
    </div>

    {/* status bar */}
    <div 
      style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(to right, #3E2B27, #5A4A45)',
        borderTop: '1px solid #7C8B6A',
        padding: '6px 16px',
        color: '#E5DCC8',
        flexShrink: 0,
        height: '28px',
        fontSize: '11px',
        fontWeight: 'bold'
      }}
    >
      <span>
        Lines: {content.split('\n').length} | Characters: {content.length}
      </span>
      <span>
        {selectedText.length > 0 ? `Selected: ${selectedText.length}` : 'Ready'}
      </span>
    </div>
  </div>
);
}

export default TxtFileApp;