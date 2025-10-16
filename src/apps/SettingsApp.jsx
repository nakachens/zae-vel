/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

function SettingsApp() {
  const [selectedDate, setSelectedDate] = useState({
    day: new Date().getDate(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const handleDateChange = (field, value) => {
    setSelectedDate(prev => ({
      ...prev,
      [field]: parseInt(value)
    }));
  };

  const handleApplySettings = () => {
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 2000);
  };

  // Check if current date is October 28th
  const isOctober28 = () => {
    return selectedDate.month === 10 && selectedDate.day === 28;
  };

  const handleSecretButton = () => {
    triggerBirthdayEvent();
  };

  const triggerBirthdayEvent = () => {
    const errors = [
      { title: "CRITICAL ERROR", message: "Date anomaly detected in sector 7G", code: "0x8B2A2A" },
      { title: "SYSTEM WARNING", message: "Temporal overflow imminent. Reality.exe has stopped responding.", code: "0xBD1028" },
      { title: "FATAL EXCEPTION", message: "CGGDFXX@$$ protocol activated. Cannot reverse process.", code: "0xC4K3DAY" },
      { title: "ERROR 404", message: "Normal day not found. XDK%44@2 mode loading...", code: "0xP4RTY" },
      { title: "KERNEL PANIC", message: "Too much ?&&XX*** detected. System overloading.", code: "0xZ4Z4" },
      { title: "EMERGENCY", message: "Too much ?&&XX*** detected. System overloading.", code: "0xFH4Z4" },
      { title: "DEV DIED", message: "&&XX*** overload. Requesting backup..", code: "0x977Z4" },
      { title: "NO GOING BACK", message: "Emergency backup: Zoza's last message loading..", code: "0x977Z4" },
    ];
    let errorIndex = 0;
    const modalStack = [];

    // Create and apply freeze overlay
    const freezeOverlay = document.createElement('div');
    freezeOverlay.id = 'freeze-overlay';
    freezeOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9998;
      pointer-events: none;
    `;
    document.body.appendChild(freezeOverlay);

    function showNextError() {
      if (errorIndex < errors.length) {
        const error = errors[errorIndex];
        const modal = showModal(error.title, error.message, error.code, errorIndex);
        modalStack.push(modal);
        
        // Play error sound
        const errorSound = new Audio('./soundzz/error.mp3');
        errorSound.volume = 0.5;
        errorSound.play().catch(e => console.log('Error sound failed:', e));
        
        errorIndex++;
        setTimeout(showNextError, 800);
      } else {
        // After all errors are shown, wait a bit then close them all
        setTimeout(() => {
          modalStack.forEach(modal => modal.remove());
          document.getElementById('freeze-overlay')?.remove();
          startDramaticSequence();
        }, 1500);
      }
    }

    function startDramaticSequence() {
      const messages = [
        { text: "But wait", delay: 1000 },
        { text: "But wait.", delay: 1000 },
        { text: "But wait..", delay: 1000 },
        { text: "But wait...", delay: 2000 },
      ];
      let messageIndex = 0;

      function showMessage() {
        if (messageIndex < messages.length) {
          document.body.innerHTML = `
            <div style="
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              background: linear-gradient(135deg, #3E2B27 0%, #1E1A19 100%);
              color: #E5DCC8;
              font-family: 'Courier New', monospace;
              font-size: 32px;
              text-align: center;
            ">
              ${messages[messageIndex].text}
            </div>
          `;
          messageIndex++;
          setTimeout(showMessage, messages[messageIndex - 1].delay);
        } else {
          startBlackout();
        }
      }
      showMessage();
    }

    function startBlackout() {
      document.body.style.transition = "all 1s";
      document.body.style.background = "#000";
      document.body.innerHTML = "";

      // Play cutscene music during blackout
      const cutsceneMusic = new Audio('./soundzz/cutscene.mp3');
      cutsceneMusic.volume = 0.7;
      cutsceneMusic.play().catch(e => console.log('Cutscene music failed:', e));

      setTimeout(showCelebration, 5000);
    }

    function showCelebration() {
      document.body.innerHTML = `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Tiny5&display=swap');
          
          @keyframes peekLeft {
            0%, 100% { transform: translateX(-20px) translateY(20px); }
            50% { transform: translateX(0) translateY(0); }
          }
          
          @keyframes peekRight {
            0%, 100% { transform: translateX(20px) translateY(20px); }
            50% { transform: translateX(0) translateY(0); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          @keyframes sparkle {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
          }
          
          @keyframes fadeInParticle {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        </style>
        <div class="birthday-celebration" style="
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #1a0a0f 0%, #0a0510 50%, #050208 100%);
          height: 100vh;
          width: 100vw;
        ">
          <!-- Fireworks Canvas -->
          <div class="fireworks" style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
          "></div>
          
          <!-- Sparkles -->
          <div style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2;
            pointer-events: none;
          ">
            ${Array.from({length: 20}, (_, i) => `
              <div style="
                position: absolute;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                width: 4px;
                height: 4px;
                background: #E5DCC8;
                border-radius: 50%;
                animation: sparkle ${2 + Math.random() * 3}s ease-in-out infinite, fadeInParticle 2s ease-in forwards;
                animation-delay: ${Math.random() * 2}s, 0s;
                box-shadow: 0 0 10px #E5DCC8;
                opacity: 0;
              "></div>
            `).join('')}
          </div>
          
          <!-- Birthday Text -->
          <div class="celebration-text" style="
            position: relative;
            z-index: 3;
            pointer-events: none;
            text-align: center;
            animation: float 3s ease-in-out infinite;
          ">
            <div style="
              background: linear-gradient(45deg, #8B2A2A, #E5DCC8, #8B2A2A);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              font-size: 64px;
              font-family: 'Tiny5', monospace;
              margin: 0;
              padding: 20px;
              letter-spacing: 8px;
              filter: drop-shadow(0 0 20px rgba(139, 42, 42, 0.8))
                      drop-shadow(0 0 40px rgba(229, 220, 200, 0.6))
                      drop-shadow(4px 4px 0px #1E1A19);
              opacity: 0;
              animation: fadeIn 2s ease-in forwards;
            ">HAPPY BIRTHDAY</div>
            
            <div style="
              background: linear-gradient(45deg, #E5DCC8, #C6C1B5, #A3B1A2);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              font-size: 96px;
              font-family: 'Tiny5', monospace;
              margin-top: 30px;
              letter-spacing: 12px;
              filter: drop-shadow(0 0 30px rgba(229, 220, 200, 0.9))
                      drop-shadow(0 0 50px rgba(139, 42, 42, 0.7))
                      drop-shadow(6px 6px 0px #8B2A2A);
              opacity: 0;
              animation: fadeIn 2s ease-in 1s forwards;
            ">ZAZA! 🎉</div>
            
            <div style="
              color: #A3B1A2;
              font-size: 24px;
              font-family: 'Tiny5', monospace;
              margin-top: 40px;
              letter-spacing: 4px;
              text-shadow: 0 0 10px rgba(163, 177, 162, 0.8),
                          2px 2px 0px #1E1A19;
              opacity: 0;
              animation: fadeIn 2s ease-in 2s forwards;
            ">You'll always be the one for me who shares, the memories.</div>
          </div>
          
          <!-- Zhongli peeking from bottom left -->
          <img src="./zhong.png" alt="Zhongli" style="
            position: absolute;
            bottom: 0;
            left: 0;
            height: 300px;
            width: auto;
            z-index: 4;
            filter: drop-shadow(4px 4px 8px rgba(0, 0, 0, 0.8));
            opacity: 0;
            animation: fadeIn 1s ease-in 3s forwards, peekLeft 4s ease-in-out 3s infinite;
          " />
          
          <!-- Childe peeking from bottom right -->
          <img src="./childe.png" alt="Childe" style="
            position: absolute;
            bottom: 0;
            right: 0;
            height: 300px;
            width: auto;
            z-index: 4;
            filter: drop-shadow(-4px 4px 8px rgba(0, 0, 0, 0.8));
            opacity: 0;
            animation: fadeIn 1s ease-in 3.5s forwards, peekRight 4s ease-in-out 3.5s infinite;
          " />
        </div>
        
        <style>
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        </style>
      `;

      createFireworks();

      setTimeout(showEndScreen, 20000);
    }

    function createFireworks() {
      const fireworksContainer = document.querySelector(".fireworks");
      const canvas = document.createElement("canvas");
      fireworksContainer.appendChild(canvas);
      const ctx = canvas.getContext("2d");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      });

      const particles = [];
      const fireworks = [];
      const gravity = 0.05;

      class Particle {
        constructor(x, y, color) {
          this.x = x;
          this.y = y;
          this.radius = 2;
          this.color = color;
          this.speed = Math.random() * 3 + 1;
          this.angle = Math.random() * Math.PI * 2;
          this.velocityX = Math.cos(this.angle) * this.speed;
          this.velocityY = Math.sin(this.angle) * this.speed;
          this.alpha = 1;
        }

        update() {
          this.velocityY += gravity;
          this.x += this.velocityX;
          this.y += this.velocityY;
          this.alpha -= 0.01;
        }

        draw() {
          ctx.save();
          ctx.globalAlpha = this.alpha;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
          ctx.restore();
        }
      }

      class Firework {
        constructor(x, y) {
          this.x = x;
          this.y = y;
          this.targetY = (Math.random() * canvas.height) / 2;
          this.exploded = false;
          this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        }

        update() {
          this.y -= 2;
          if (this.y <= this.targetY && !this.exploded) {
            this.exploded = true;
            this.explode();
          }
        }

        explode() {
          const particleCount = 100;
          
          // Play firework explosion sound
          const fireworkSound = new Audio('./soundzz/fireworks.mp3');
          fireworkSound.volume = 0.3;
          fireworkSound.play().catch(e => console.log('Firework sound failed:', e));
          
          for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(this.x, this.y, this.color));
          }
        }

        draw() {
          if (!this.exploded) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
          }
        }
      }

      function launchFirework() {
        const x = Math.random() * canvas.width;
        const y = canvas.height;
        fireworks.push(new Firework(x, y));
      }

      function animate() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        fireworks.forEach((firework, index) => {
          firework.update();
          firework.draw();
          if (firework.exploded) {
            fireworks.splice(index, 1);
          }
        });

        particles.forEach((particle, index) => {
          particle.update();
          particle.draw();
          if (particle.alpha <= 0) {
            particles.splice(index, 1);
          }
        });

        requestAnimationFrame(animate);
      }

      launchFirework();
      setInterval(launchFirework, 500);
      animate();
    }

    function showEndScreen() {
      document.body.innerHTML = `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Tiny5&display=swap');
        </style>
        <div style="
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #3E2B27 0%, #1E1A19 100%);
          height: 100vh;
          transition: opacity 2s;
          font-family: 'Tiny5', monospace;
        ">
          <h1 style="
            color: #E5DCC8; 
            font-size: 42px; 
            margin-bottom: 20px;
            letter-spacing: 4px;
            text-shadow: 0 0 20px rgba(229, 220, 200, 0.6), 3px 3px 0px #8B2A2A;
          ">
            THANKS FOR BEING THERE ALWAYS! 🎂
          </h1>
          <p style="
            color: #A3B1A2; 
            margin-bottom: 40px; 
            font-size: 18px;
            letter-spacing: 2px;
            text-shadow: 2px 2px 0px #1E1A19;
          ">
            HOPE YOU HAVE AN AMAZING YEAR, YARA! 💛
          </p>
          <button onclick="location.reload()" style="
            padding: 15px 30px;
            background: linear-gradient(145deg, #8B2A2A, #6B1F1F);
            color: #E5DCC8;
            border: 2px solid;
            border-color: #E5DCC8 #1E1A19 #1E1A19 #E5DCC8;
            cursor: pointer;
            font-family: 'Tiny5', monospace;
            font-size: 16px;
            font-weight: bold;
            letter-spacing: 2px;
          ">
            RESTART SYSTEM
          </button>
        </div>
      `;
    }

    showNextError();
  };

  const showModal = (title, message, code, index) => {
    const modal = document.createElement('div');
    modal.className = 'error-modal';
    const offsetX = 50 + (index * 30);
    const offsetY = 100 + (index * 30);
    
    modal.style.cssText = `
      position: fixed;
      left: ${offsetX}px;
      top: ${offsetY}px;
      z-index: ${10000 + index};
    `;
    
    modal.innerHTML = `
      <div style="
        background: #C0C0C0;
        border: 2px solid;
        border-color: #FFFFFF #808080 #808080 #FFFFFF;
        min-width: 320px;
        max-width: 450px;
        font-family: 'MS Sans Serif', 'Courier New', monospace;
        box-shadow: 2px 2px 8px rgba(0,0,0,0.5);
      ">
        <div style="
          background: linear-gradient(90deg, #8B2A2A 0%, #6B1F1F 50%, #5A1A1A 100%);
          padding: 3px 5px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        ">
          <div style="
            color: #FFFFFF;
            font-size: 13px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 5px;
          ">
            <span style="font-size: 14px;">⚠️</span>
            <span>${title}</span>
          </div>
        </div>
        <div style="
          padding: 20px;
          background: #C0C0C0;
        ">
          <div style="
            display: flex;
            align-items: flex-start;
            gap: 15px;
            margin-bottom: 20px;
          ">
            <div style="
              font-size: 32px;
              line-height: 1;
            ">⚠️</div>
            <div style="
              flex: 1;
              color: #000000;
              font-size: 13px;
              line-height: 1.4;
            ">
              ${message}
              <div style="
                margin-top: 10px;
                font-size: 12px;
                color: #666666;
                font-family: monospace;
              ">Error Code: ${code}</div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    return modal;
  };

  const months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ];

 return (
  <div style={{
    width: '100%',
    height: '100%',
    fontFamily: 'MS Sans Serif, Courier New, monospace',
    background: '#C0C0C0',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box'
  }}>
      {/* Tab Bar */}
      <div style={{
        display: 'flex',
        borderBottom: '2px solid',
        borderColor: '#808080',
        background: '#C0C0C0'
      }}>
        <button
          onClick={() => setActiveTab('basic')}
          style={{
            padding: '6px 20px',
            fontFamily: 'MS Sans Serif, monospace',
            fontSize: '13px',
            background: activeTab === 'basic' ? '#C0C0C0' : '#A0A0A0',
            border: '2px solid',
            borderColor: activeTab === 'basic' 
              ? '#FFFFFF #000000 #000000 #FFFFFF'
              : '#808080 #000000 #000000 #808080',
            borderBottom: activeTab === 'basic' ? 'none' : '2px solid #000000',
            cursor: 'pointer',
            marginRight: '2px',
            color: '#000000',
            position: 'relative',
            top: activeTab === 'basic' ? '2px' : '0'
          }}
        >
          Basic Info
        </button>
        <button
          onClick={() => setActiveTab('comm')}
          style={{
            padding: '6px 20px',
            fontFamily: 'MS Sans Serif, monospace',
            fontSize: '13px',
            background: activeTab === 'comm' ? '#C0C0C0' : '#A0A0A0',
            border: '2px solid',
            borderColor: activeTab === 'comm'
              ? '#FFFFFF #000000 #000000 #FFFFFF'
              : '#808080 #000000 #000000 #808080',
            borderBottom: activeTab === 'comm' ? 'none' : '2px solid #000000',
            cursor: 'pointer',
            marginRight: '2px',
            color: '#000000',
            position: 'relative',
            top: activeTab === 'comm' ? '2px' : '0'
          }}
        >
          System
        </button>
        <button
          onClick={() => setActiveTab('detail')}
          style={{
            padding: '6px 20px',
            fontFamily: 'MS Sans Serif, monospace',
            fontSize: '13px',
            background: activeTab === 'detail' ? '#C0C0C0' : '#A0A0A0',
            border: '2px solid',
            borderColor: activeTab === 'detail'
              ? '#FFFFFF #000000 #000000 #FFFFFF'
              : '#808080 #000000 #000000 #808080',
            borderBottom: activeTab === 'detail' ? 'none' : '2px solid #000000',
            cursor: 'pointer',
            marginRight: '2px',
            color: '#000000',
            position: 'relative',
            top: activeTab === 'detail' ? '2px' : '0'
          }}
        >
          Date & Time
        </button>
        <button
          onClick={() => setActiveTab('security')}
          style={{
            padding: '6px 20px',
            fontFamily: 'MS Sans Serif, monospace',
            fontSize: '13px',
            background: activeTab === 'security' ? '#C0C0C0' : '#A0A0A0',
            border: '2px solid',
            borderColor: activeTab === 'security'
              ? '#FFFFFF #000000 #000000 #FFFFFF'
              : '#808080 #000000 #000000 #808080',
            borderBottom: activeTab === 'security' ? 'none' : '2px solid #000000',
            cursor: 'pointer',
            color: '#000000',
            position: 'relative',
            top: activeTab === 'security' ? '2px' : '0'
          }}
        >
          Security
        </button>
      </div>

      {/* Content Area */}
<div style={{
  flex: 1,
  padding: '15px',
  overflowY: 'auto',
  background: '#C0C0C0',
  minHeight: 0,
  boxSizing: 'border-box'
}}>
        {activeTab === 'basic' && (
          <div style={{ display: 'flex', gap: '15px' }}>
            {/* Profile Picture */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                border: '2px solid',
                borderColor: '#FFFFFF #000000 #000000 #FFFFFF',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <img 
                  src="./zhong.jpg" 
                  alt="Profile"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <button style={{
                padding: '4px 12px',
                fontFamily: 'MS Sans Serif, monospace',
                fontSize: '13px',
                background: '#C0C0C0',
                border: '2px solid',
                borderColor: '#FFFFFF #000000 #000000 #FFFFFF',
                cursor: 'pointer',
                color: '#000000'
              }}>
                Change
              </button>
            </div>

            {/* User Info */}
            <div style={{ flex: 1 }}>
              <div style={{
                marginBottom: '10px',
                padding: '10px',
                border: '2px solid',
                borderColor: '#808080 #FFFFFF #FFFFFF #808080',
                background: '#FFFFFF'
              }}>
                <div style={{ marginBottom: '10px', fontSize: '13px', color: '#000000' }}>
                  <strong>Basic Information</strong>
                </div>
                
                <div style={{ marginBottom: '8px' }}>
                  <label style={{
                    display: 'inline-block',
                    width: '80px',
                    fontSize: '13px',
                    color: '#000000'
                  }}>Avatar:</label>
                </div>

                <div style={{ marginBottom: '8px' }}>
                  <label style={{
                    display: 'inline-block',
                    width: '80px',
                    fontSize: '13px',
                    color: '#000000'
                  }}>User Number:</label>
                  <input
                    type="text"
                    value="zku1028"
                    readOnly
                    style={{
                      padding: '2px 4px',
                      fontFamily: 'MS Sans Serif, monospace',
                      fontSize: '13px',
                      background: '#FFFFFF',
                      border: '1px solid',
                      borderColor: '#808080 #FFFFFF #FFFFFF #808080',
                      color: '#000000',
                      width: '120px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '8px' }}>
                  <label style={{
                    display: 'inline-block',
                    width: '80px',
                    fontSize: '13px',
                    color: '#000000'
                  }}>Nickname:</label>
                  <input
                    type="text"
                    value="Zai"
                    readOnly
                    style={{
                      padding: '2px 4px',
                      fontFamily: 'MS Sans Serif, monospace',
                      fontSize: '13px',
                      background: '#FFFFFF',
                      border: '1px solid',
                      borderColor: '#808080 #FFFFFF #FFFFFF #808080',
                      color: '#000000',
                      width: '120px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '8px' }}>
                  <label style={{
                    display: 'inline-block',
                    width: '80px',
                    fontSize: '13px',
                    color: '#000000'
                  }}>Email:</label>
                  <input
                    type="text"
                    value="nakachenx@gmail.com"
                    readOnly
                    style={{
                      padding: '2px 4px',
                      fontFamily: 'MS Sans Serif, monospace',
                      fontSize: '13px',
                      background: '#FFFFFF',
                      border: '1px solid',
                      borderColor: '#808080 #FFFFFF #FFFFFF #808080',
                      color: '#000000',
                      width: '180px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '8px' }}>
                  <label style={{
                    display: 'inline-block',
                    width: '80px',
                    fontSize: '13px',
                    color: '#000000',
                    verticalAlign: 'top'
                  }}>Signature:</label>
                   <input
                    type="text"
                    value="no sign cuz zoza made tis"
                    readOnly
                    style={{
                      padding: '2px 4px',
                      fontFamily: 'MS Sans Serif, monospace',
                      fontSize: '13px',
                      background: '#FFFFFF',
                      border: '1px solid',
                      borderColor: '#808080 #FFFFFF #FFFFFF #808080',
                      color: '#000000',
                      width: '180px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '8px' }}>
                  <label style={{display: 'inline-block',
                    width: '80px',
                    fontSize: '13px',
                    color: '#000000',
                    verticalAlign: 'top'
                  }}>Description:</label>
                   <input
                    type="text"
                    value="zai chan spl"
                    readOnly
                    style={{
                      padding: '2px 4px',
                      fontFamily: 'MS Sans Serif, monospace',
                      fontSize: '13px',
                      background: '#FFFFFF',
                      border: '1px solid',
                      borderColor: '#808080 #FFFFFF #FFFFFF #808080',
                      color: '#000000',
                      width: '180px'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'detail' && (
          <div style={{
            padding: '10px',
            border: '2px solid',
            borderColor: '#808080 #FFFFFF #FFFFFF #808080',
            background: '#FFFFFF'
          }}>
            <div style={{ marginBottom: '15px', fontSize: '13px', color: '#000000' }}>
              <strong>📅 Date & Time Settings</strong>
              {isOctober28() && (
                <button
                  onClick={handleSecretButton}
                  style={{
                    marginLeft: '10px',
                    width: '20px',
                    height: '20px',
                    background: '#C0C0C0',
                    border: '2px solid',
                    borderColor: '#FFFFFF #000000 #000000 #FFFFFF',
                    color: '#000000',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontFamily: 'monospace'
                  }}
                  title="Something special..."
                >
                  ?
                </button>
              )}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              marginBottom: '12px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  color: '#000000',
                  fontSize: '13px',
                  marginBottom: '4px'
                }}>Month:</label>
                <select
                  value={selectedDate.month}
                  onChange={(e) => handleDateChange('month', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '2px 4px',
                    fontFamily: 'MS Sans Serif, monospace',
                    fontSize: '13px',
                    background: '#FFFFFF',
                    border: '1px solid',
                    borderColor: '#808080 #FFFFFF #FFFFFF #808080',
                    color: '#000000',
                    cursor: 'pointer'
                  }}
                >
                  {months.map(month => (
                    <option key={month.value} value={month.value}>
                      {month.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  color: '#000000',
                  fontSize: '13px',
                  marginBottom: '4px'
                }}>Day:</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={selectedDate.day}
                  onChange={(e) => handleDateChange('day', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '2px 4px',
                    fontFamily: 'MS Sans Serif, monospace',
                    fontSize: '13px',
                    background: '#FFFFFF',
                    border: '1px solid',
                    borderColor: '#808080 #FFFFFF #FFFFFF #808080',
                    color: '#000000'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  color: '#000000',
                  fontSize: '13px',
                  marginBottom: '4px'
                }}>Year:</label>
                <input
                  type="number"
                  min="1970"
                  max="2100"
                  value={selectedDate.year}
                  onChange={(e) => handleDateChange('year', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '2px 4px',
                    fontFamily: 'MS Sans Serif, monospace',
                    fontSize: '13px',
                    background: '#FFFFFF',
                    border: '1px solid',
                    borderColor: '#808080 #FFFFFF #FFFFFF #808080',
                    color: '#000000'
                  }}
                />
              </div>
            </div>

            <div style={{
              background: '#FFFFD0',
              padding: '8px',
              border: '1px solid #808080',
              marginBottom: '10px',
              fontSize: '13px',
              color: '#000000'
            }}>
              Selected: <strong>
                {months.find(m => m.value === selectedDate.month)?.name} {selectedDate.day}, {selectedDate.year}
              </strong>
            </div>

            <div style={{
              fontSize: '12px',
              color: '#808080',
              fontStyle: 'italic'
            }}>
              💡 Try setting the date to a special day in October...
            </div>
          </div>
        )}

        {activeTab === 'comm' && (
          <div style={{
            padding: '10px',
            border: '2px solid',
            borderColor: '#808080 #FFFFFF #FFFFFF #808080',
            background: '#FFFFFF',
            fontSize: '13px',
            color: '#000000'
          }}>
            <div style={{ marginBottom: '10px' }}>
              <strong>System Developer:</strong> nakachens
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>User ID:</strong> zaiuyku28
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Status:</strong> Active
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div style={{
            padding: '10px',
            border: '2px solid',
            borderColor: '#808080 #FFFFFF #FFFFFF #808080',
            background: '#FFFFFF',
            fontSize: '13px',
            color: '#000000'
          }}>
            <div style={{ marginBottom: '10px' }}>
              <strong>Security Level:</strong> Standard
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Last Login:</strong> {new Date().toLocaleDateString()}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>System Version:</strong> ZAE'VEL v2.1
            </div>
          </div>
        )}
      </div>

      {/* Bottom Buttons */}
      <div style={{
        padding: '8px 15px',
        borderTop: '2px solid #FFFFFF',
        background: '#C0C0C0',
        display: 'flex',
        justifyContent: 'center',
        gap: '10px'
      }}>
        <button
          onClick={handleApplySettings}
          style={{
            padding: '6px 24px',
            fontFamily: 'MS Sans Serif, monospace',
            fontSize: '13px',
            background: '#C0C0C0',
            border: '2px solid',
            borderColor: '#FFFFFF #000000 #000000 #FFFFFF',
            cursor: 'pointer',
            color: '#000000',
            minWidth: '80px'
          }}
          onMouseDown={(e) => {
            e.target.style.borderColor = '#000000 #FFFFFF #FFFFFF #000000';
          }}
          onMouseUp={(e) => {
            e.target.style.borderColor = '#FFFFFF #000000 #000000 #FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = '#FFFFFF #000000 #000000 #FFFFFF';
          }}
        >
          OK
        </button>
        <button
          style={{
            padding: '6px 24px',
            fontFamily: 'MS Sans Serif, monospace',
            fontSize: '13px',
            background: '#C0C0C0',
            border: '2px solid',
            borderColor: '#FFFFFF #000000 #000000 #FFFFFF',
            cursor: 'pointer',
            color: '#000000',
            minWidth: '80px'
          }}
          onMouseDown={(e) => {
            e.target.style.borderColor = '#000000 #FFFFFF #FFFFFF #000000';
          }}
          onMouseUp={(e) => {
            e.target.style.borderColor = '#FFFFFF #000000 #000000 #FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = '#FFFFFF #000000 #000000 #FFFFFF';
          }}
        >
          Close
        </button>
      </div>

      {showConfirmation && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#C0C0C0',
          border: '2px solid',
          borderColor: '#FFFFFF #000000 #000000 #FFFFFF',
          padding: '20px',
          boxShadow: '2px 2px 8px rgba(0,0,0,0.5)',
          zIndex: 1000
        }}>
          <div style={{
            fontSize: '13px',
            color: '#000000',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            ✓ Settings applied successfully!
          </div>
          <button
            onClick={() => setShowConfirmation(false)}
            style={{
              padding: '4px 16px',
              fontFamily: 'MS Sans Serif, monospace',
              fontSize: '13px',
              background: '#C0C0C0',
              border: '2px solid',
              borderColor: '#FFFFFF #000000 #000000 #FFFFFF',
              cursor: 'pointer',
              color: '#000000',
              display: 'block',
              margin: '0 auto'
            }}
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
}

export default SettingsApp;