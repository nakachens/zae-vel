/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

function ImageViewerApp({ imageName = "img-1.jpg", onClose, onTitleChange }) {
  const images = [
    { name: "e-e-eye contactooo???", url: "./images/1.jpeg" },
    { name: "never-ask-a-man-his-past", url: "./images/2.jpeg" },
    { name: "skincare-videocall-sesh", url: "./images/3.jpeg" },
    { name: "haha-this-is-nothing", url: "./images/4.jpeg" },
    { name: "she-hates-me-#hater", url: "./images/5.jpeg" },
    { name: "yandere-simulator", url: "./images/6.jpeg" },
    { name: "oh-shes-everywhere", url: "./images/7.jpeg" },
    { name: "what", url: "./images/8.jpeg" },
    { name: "the-real-ones-get-it", url: "./images/9.jpeg" },
    { name: "the-1st-zhongli-main-to-ever-exist", url: "./images/10.jpeg" },
    { name: "10th-grade-GAHHHH", url: "./images/11.jpeg" },
    { name: "vc...", url: "./images/12.png" },
    { name: "omg-first-irl-meetup", url: "./images/13.jpeg" },
    { name: "feet", url: "./images/14.jpeg" },
    { name: "best-name-era", url: "./images/15.jfif" },
    { name: "tehee", url: "./images/img-16.jpg" },
    { name: "me-when-i", url: "./images/img-17.jpg" },
    { name: "cute-akechi", url: "./images/img-18.jpg" },
    { name: "nom-nom", url: "./images/img-19.jpg" },
    { name: "our-cool-meetup", url: "./images/img-20.jpeg" },
    { name: "me-tryna-explain-this-project", url: "./images/img-21.jpg" },
  ];

  const getInitialIndex = () => {
    const index = images.findIndex(img => img.name === imageName);
    return index !== -1 ? index : 0;
  };

  const [currentIndex, setCurrentIndex] = useState(getInitialIndex());
  const [imageError, setImageError] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentImage = images[currentIndex];
    if (currentImage && onTitleChange) {
      onTitleChange(currentImage.name);
    }
  }, [currentIndex, onTitleChange, images]);

  const playClickSound = () => {
    const audio = new Audio('/click.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const nextImage = () => {
    playClickSound();
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
    setImageError(false);
    setZoomLevel(1);
    setIsLoading(true);
  };

  const prevImage = () => {
    playClickSound();
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    setImageError(false);
    setZoomLevel(1);
    setIsLoading(true);
  };

  const handleZoomIn = () => {
    playClickSound();
    setZoomLevel(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    playClickSound();
    setZoomLevel(prev => Math.max(prev - 0.2, 0.2));
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  // get current image 
  const currentImage = images[currentIndex] || images[0];

  return (
  <div 
    style={{ 
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(145deg, #1E1A19, #3E2B27)',
      fontFamily: 'Courier New, monospace',
      overflow: 'hidden',
      position: 'relative'
    }}
  >
    
    {/* img header*/}
    <div 
      style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 16px',
        background: 'linear-gradient(90deg, #3E2B27 0%, #5A4A45 50%, #4A3F3A 100%)',
        color: '#E5DCC8',
        borderBottom: '1px solid #7C8B6A',
        flexShrink: 0,
        height: '44px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: '16px' }}>🖼️</span>
        <span style={{ 
          fontWeight: 'bold', 
          fontSize: '13px',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap'
        }}>
          {currentImage.name}
        </span>
      </div>
      
      <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
        <button 
          style={{
            padding: '4px 8px',
            background: 'linear-gradient(145deg, #5A4A45, #4A3F3A)',
            border: '1px solid',
            borderColor: '#7C8B6A',
            borderRadius: '2px',
            color: '#E5DCC8',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 'bold',
            minWidth: '32px',
            height: '24px',
            fontFamily: 'inherit',
            transition: 'all 0.2s'
          }}
          onClick={handleZoomOut}
          onMouseEnter={(e) => e.target.style.background = 'linear-gradient(145deg, #6B4F47, #5A4A45)'}
          onMouseLeave={(e) => e.target.style.background = 'linear-gradient(145deg, #5A4A45, #4A3F3A)'}
        >
          🔍-
        </button>
        <button 
          style={{
            padding: '4px 8px',
            background: 'linear-gradient(145deg, #5A4A45, #4A3F3A)',
            border: '1px solid',
            borderColor: '#7C8B6A',
            borderRadius: '2px',
            color: '#E5DCC8',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 'bold',
            minWidth: '32px',
            height: '24px',
            fontFamily: 'inherit',
            transition: 'all 0.2s'
          }}
          onClick={handleZoomIn}
          onMouseEnter={(e) => e.target.style.background = 'linear-gradient(145deg, #6B4F47, #5A4A45)'}
          onMouseLeave={(e) => e.target.style.background = 'linear-gradient(145deg, #5A4A45, #4A3F3A)'}
        >
          🔍+
        </button>
      </div>
    </div>

    {/* display area*/}
    <div style={{ 
      flex: 1, 
      position: 'relative', 
      overflow: 'hidden', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at center, #1E1A19 0%, #0f0704 100%)'
    }}>
      
      {/* navi*/}
      <button 
        style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '48px',
          height: '48px',
          background: 'linear-gradient(145deg, #5A4A45, #4A3F3A)',
          border: '2px solid',
          borderColor: '#7C8B6A',
          borderRadius: '50%',
          color: '#E5DCC8',
          cursor: 'pointer',
          fontSize: '18px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          boxShadow: '2px 2px 8px rgba(0,0,0,0.6)',
          fontFamily: 'inherit',
          transition: 'all 0.2s'
        }}
        onClick={prevImage}
        onMouseEnter={(e) => e.target.style.background = 'linear-gradient(145deg, #6B4F47, #5A4A45)'}
        onMouseLeave={(e) => e.target.style.background = 'linear-gradient(145deg, #5A4A45, #4A3F3A)'}
        title="Previous Image"
      >
        ←
      </button>

      {/* img holder*/}
      <div 
        style={{ 
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: zoomLevel > 1 ? 'auto' : 'hidden',
          padding: '60px',
          boxSizing: 'border-box'
        }}
      >
        {isLoading && !imageError && (
          <div style={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#A3B1A2',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            Loading image...
          </div>
        )}
        
        {!imageError ? (
          <img 
            src={currentImage.url}
            alt={currentImage.name}
            style={{ 
              maxWidth: zoomLevel === 1 ? '100%' : 'none',
              maxHeight: zoomLevel === 1 ? '100%' : 'none',
              width: zoomLevel !== 1 ? `${100 * zoomLevel}%` : 'auto',
              height: 'auto',
              objectFit: 'contain',
              display: isLoading ? 'none' : 'block',
              border: '3px solid #7C8B6A',
              borderRadius: '4px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.7)',
              transition: 'opacity 0.3s ease'
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div 
            style={{ 
              width: '100%',
              height: '100%',
              maxWidth: '500px',
              maxHeight: '400px',
              background: 'linear-gradient(135deg, #5A4A45, #3E2B27)',
              border: '3px solid #7C8B6A',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(0,0,0,0.7)'
            }}
          >
            <div style={{ 
              textAlign: 'center', 
              color: '#E5DCC8', 
              padding: '40px',
              fontFamily: 'inherit'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.6 }}>🖼️</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                {currentImage.name}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.75, marginBottom: '12px' }}>
                Image not found
              </div>
              <div style={{ fontSize: '12px', opacity: 0.6, lineHeight: 1.4 }}>
                Expected location:<br/>
                <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 4px', borderRadius: '2px' }}>
                  {currentImage.url}
                </code>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* next arrow*/}
      <button 
        style={{
          position: 'absolute',
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '48px',
          height: '48px',
          background: 'linear-gradient(145deg, #5A4A45, #4A3F3A)',
          border: '2px solid',
          borderColor: '#7C8B6A',
          borderRadius: '50%',
          color: '#E5DCC8',
          cursor: 'pointer',
          fontSize: '18px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          boxShadow: '2px 2px 8px rgba(0,0,0,0.6)',
          fontFamily: 'inherit',
          transition: 'all 0.2s'
        }}
        onClick={nextImage}
        onMouseEnter={(e) => e.target.style.background = 'linear-gradient(145deg, #6B4F47, #5A4A45)'}
        onMouseLeave={(e) => e.target.style.background = 'linear-gradient(145deg, #5A4A45, #4A3F3A)'}
        title="Next Image"
      >
        →
      </button>

      {/* keyboard hints */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.8)',
        color: '#A3B1A2',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 'bold',
        opacity: 0.8,
        zIndex: 5,
        border: '1px solid #7C8B6A'
      }}>
        Use arrows to navigate • {currentIndex + 1}/{images.length}
      </div>
    </div>

    {/* status bar */}
    <div 
      style={{ 
        background: 'linear-gradient(to right, #3E2B27, #5A4A45)',
        borderTop: '1px solid #7C8B6A',
        padding: '8px 16px',
        color: '#E5DCC8',
        flexShrink: 0,
        height: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '11px',
        fontWeight: 'bold',
        boxShadow: '0 -2px 4px rgba(0,0,0,0.3)'
      }}
    >
      <span>
        📁 Image {currentIndex + 1} of {images.length} | 🔍 Zoom: {Math.round(zoomLevel * 100)}%
      </span>
      <span>
        {!imageError && !isLoading ? '✅ Loaded' : imageError ? '❌ Error' : '⏳ Loading...'}
      </span>
    </div>
  </div>
);
}

export default ImageViewerApp;