import React, { useState } from 'react';

// WiFi Sidebar Component
function WiFiSidebar({ isOpen, onClose, onZozoClick }) {
  const [brightness, setBrightness] = useState(75);
  const [volume, setVolume] = useState(60);
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [airplaneMode, setAirplaneMode] = useState(false);
  const [batterySaver, setBatterySaver] = useState(false);
  const [nightLight, setNightLight] = useState(false);
  const [accessibility, setAccessibility] = useState(false);

  const playClickSound = () => {
    const audio = new Audio('/click.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const toggleSetting = (setter, current) => {
    playClickSound();
    setter(!current);
  };

  if (!isOpen) return null;

  return (
  <>
    <div className="fixed inset-0 z-30" onClick={onClose} />
    <div 
      className="fixed bottom-12 right-4 w-80 border-2 shadow-2xl z-40 overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #3E2B27, #1E1A19)',
        borderColor: '#7C8B6A',
        borderStyle: 'solid',
        fontFamily: 'monospace',
        borderRadius: '8px'
      }}
    >
      {/* Header */}
      <div 
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{
          background: 'linear-gradient(90deg, #5A4A45 0%, #4A3F3A 50%, #3E2B27 100%)',
          borderColor: '#7C8B6A',
          color: '#E5DCC8'
        }}
      >
        <span className="text-sm font-bold">Quick Settings</span>
        <button 
          className="w-5 h-5 border text-xs flex items-center justify-center font-bold hover:opacity-80 transition-opacity"
          onClick={onClose}
          style={{ 
            borderColor: '#7C8B6A',
            background: '#6B4F47',
            color: '#E5DCC8'
          }}
        >
          ×
        </button>
      </div>

      {/* Settings Content */}
      <div className="p-5 space-y-4">
        {/* Settings Grid with proper spacing */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'WiFi', icon: '📶', enabled: wifiEnabled, setter: setWifiEnabled },
            { label: 'Bluetooth', icon: '🔗', enabled: bluetoothEnabled, setter: setBluetoothEnabled },
            { label: 'Airplane', icon: '✈️', enabled: airplaneMode, setter: setAirplaneMode },
            { label: 'Battery', icon: '🔋', enabled: batterySaver, setter: setBatterySaver },
            { label: 'Night', icon: '🌙', enabled: nightLight, setter: setNightLight },
            { label: 'Access', icon: '♿', enabled: accessibility, setter: setAccessibility }
          ].map((setting, index) => (
            <button
              key={index}
              className="p-3 border rounded transition-all duration-200 flex items-center justify-center space-x-2 hover:transform hover:scale-105"
              onClick={() => toggleSetting(setting.setter, setting.enabled)}
              style={{
                background: setting.enabled 
                  ? 'linear-gradient(145deg, #7C8B6A, #6B7A59)' 
                  : 'linear-gradient(145deg, #5A4A45, #4A3F3A)',
                borderColor: setting.enabled 
                  ? '#A3B1A2'
                  : '#7C8B6A',
                color: setting.enabled ? '#E5DCC8' : '#C6C1B5',
                minHeight: '50px',
                width: 'auto'
              }}
            >
              <span className="text-sm">{setting.icon}</span>
              <span className="text-xs font-bold">{setting.label}</span>
            </button>
          ))}
        </div>

        {/* Special Zozo Button with margins */}
        <div className="px-2">
          <button
            className="w-full p-3 border rounded transition-all duration-200 flex items-center justify-center space-x-2 hover:transform hover:scale-105"
            onClick={() => {
              playClickSound();
              onZozoClick();
              onClose();
            }}
            style={{
              background: 'linear-gradient(145deg, #8B2A2A, #6B1F1F)',
              borderColor: '#A3B1A2',
              color: '#E5DCC8',
              marginTop: '8px',
              marginBottom: '8px'
            }}
          >
            <span className="text-sm">🍂</span>
            <span className="text-xs font-bold">ZOZO SPECIAL</span>
          </button>
        </div>

        {/* Sliders with proper margins */}
        <div className="space-y-4 pt-3 border-t px-2" style={{ borderColor: '#7C8B6A' }}>
          <div className="px-2 py-2">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm">☀️</span>
                <span className="text-xs font-bold" style={{ color: '#E5DCC8' }}>Brightness</span>
              </div>
              <span className="text-xs font-bold" style={{ color: '#A3B1A2' }}>{brightness}%</span>
            </div>
            <div className="px-1">
              <input
                type="range"
                min="0"
                max="100"
                value={brightness}
                onChange={(e) => setBrightness(e.target.value)}
                className="w-full h-2 rounded appearance-none cursor-pointer"
                style={{
                  background: 'linear-gradient(90deg, #3E2B27, #7C8B6A)',
                  outline: 'none'
                }}
              />
            </div>
          </div>
          <div className="px-2 py-2">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm">🔊</span>
                <span className="text-xs font-bold" style={{ color: '#E5DCC8' }}>Volume</span>
              </div>
              <span className="text-xs font-bold" style={{ color: '#A3B1A2' }}>{volume}%</span>
            </div>
            <div className="px-1">
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                className="w-full h-2 rounded appearance-none cursor-pointer"
                style={{
                  background: 'linear-gradient(90deg, #3E2B27, #7C8B6A)',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);
}

export default WiFiSidebar;