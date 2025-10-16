import React, { useState, useEffect, useRef } from 'react';
import { globalAssetPreloader, CRITICAL_ASSETS, SECONDARY_ASSETS } from './AssetPreloader';

function LoadingScreen({ onLoadingComplete }) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('zae\'vel LOADING...');
  const [currentAsset, setCurrentAsset] = useState('');
  const [phase, setPhase] = useState('initial'); // initial, fonts, assets, finalizing
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const loadAssets = async () => {
      const totalAssets = CRITICAL_ASSETS.length + SECONDARY_ASSETS.length;
      let loadedCount = 0;

      const updateProgress = (loaded, total, message, asset = '') => {
        if (!isMountedRef.current) return;
        const percent = (loaded / total) * 100;
        setProgress(percent);
        setLoadingText(message);
        if (asset) setCurrentAsset(asset);
      };

      try {
        // === PHASE 1: CRITICAL FONTS (0-15%) ===
        setPhase('fonts');
        updateProgress(0, totalAssets, 'Loading system fonts...', 'zozafont');

        // Load zozafont first (most critical)
        const zozafont = CRITICAL_ASSETS.find(a => a.fontFamily === 'zozafont');
        if (zozafont) {
          await globalAssetPreloader.preloadFont(
            zozafont.fontFamily,
            zozafont.src,
            zozafont.descriptors
          );
          loadedCount++;
          updateProgress(loadedCount, totalAssets, 'zozafont loaded', '');
        }

        // Load Google Fonts in parallel
        const googleFonts = CRITICAL_ASSETS.filter(a => a.type === 'google-font');
        await Promise.all(
          googleFonts.map(async (font) => {
            await globalAssetPreloader.preloadGoogleFont(
              font.fontFamily,
              font.weights,
              font.styles
            );
            loadedCount++;
            updateProgress(loadedCount, totalAssets, `Loading ${font.fontFamily}...`, '');
          })
        );

        // === PHASE 2: CRITICAL ASSETS (15-70%) ===
        setPhase('assets');
        const criticalNonFonts = CRITICAL_ASSETS.filter(
          a => a.type !== 'font' && a.type !== 'google-font'
        );

        // Group assets by type for optimized loading
        const imageAssets = criticalNonFonts.filter(a => a.type === 'image');
        const audioAssets = criticalNonFonts.filter(a => a.type === 'audio');

        // Load wallpaper first (high priority for first impression)
        const wallpaper = imageAssets.find(a => a.src.includes('1.jpg'));
        if (wallpaper) {
          updateProgress(loadedCount, totalAssets, 'Loading desktop...', 'wallpaper');
          await globalAssetPreloader.preloadImage(wallpaper.src);
          loadedCount++;
        }

        // Load pet animations (critical for interaction)
        const petAnimations = imageAssets.filter(a => a.src.includes('animations/'));
        updateProgress(loadedCount, totalAssets, 'Loading pet animations...', 'hakuchin');
        await Promise.all(
          petAnimations.map(async (asset) => {
            await globalAssetPreloader.preloadImage(asset.src);
            loadedCount++;
            updateProgress(loadedCount, totalAssets, 'Loading pet animations...', asset.src.split('/').pop());
          })
        );

        // Load core sounds
        updateProgress(loadedCount, totalAssets, 'Loading sounds...', 'click.mp3');
        await Promise.all(
          audioAssets.map(async (asset) => {
            await globalAssetPreloader.preloadAudio(asset.src);
            loadedCount++;
          })
        );

        // Load login image
        const loginImage = imageAssets.find(a => a.src.includes('zhong.jpg'));
        if (loginImage) {
          updateProgress(loadedCount, totalAssets, 'Loading profile...', 'profile picture');
          await globalAssetPreloader.preloadImage(loginImage.src);
          loadedCount++;
        }

        // Load app icons in parallel (batch of 5 at a time for performance)
        const appIcons = imageAssets.filter(a => 
          a.src.includes('assets/') && 
          !a.src.includes('1.jpg') &&
          !a.src.includes('zhong.jpg')
        );
        
        updateProgress(loadedCount, totalAssets, 'Loading app icons...', 'icons');
        const iconBatches = [];
        for (let i = 0; i < appIcons.length; i += 5) {
          iconBatches.push(appIcons.slice(i, i + 5));
        }

        for (const batch of iconBatches) {
          await Promise.all(
            batch.map(async (asset) => {
              await globalAssetPreloader.preloadImage(asset.src);
              loadedCount++;
              updateProgress(loadedCount, totalAssets, 'Loading app icons...', asset.src.split('/').pop());
            })
          );
        }

        // === PHASE 3: SECONDARY ASSETS (70-95%) ===
        setPhase('secondary');
        updateProgress(loadedCount, totalAssets, 'Loading additional assets...', '');

        const secondaryImages = SECONDARY_ASSETS.filter(a => a.type === 'image');
        const secondaryAudio = SECONDARY_ASSETS.filter(a => a.type === 'audio');

        await Promise.all([
          ...secondaryImages.map(async (asset) => {
            await globalAssetPreloader.preloadImage(asset.src);
            loadedCount++;
            updateProgress(loadedCount, totalAssets, 'Loading characters...', asset.src.split('/').pop());
          }),
          ...secondaryAudio.map(async (asset) => {
            await globalAssetPreloader.preloadAudio(asset.src);
            loadedCount++;
            updateProgress(loadedCount, totalAssets, 'Loading sounds...', asset.src.split('/').pop());
          })
        ]);

        // === PHASE 4: FINALIZATION (95-100%) ===
        setPhase('finalizing');
        updateProgress(loadedCount, totalAssets, 'Finalizing...', '');

        // Wait for all fonts to be fully ready
        await globalAssetPreloader.waitForFonts();

        // Final verification for critical fonts
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }

        // Small delay to ensure everything is settled
        await new Promise(resolve => setTimeout(resolve, 200));

        updateProgress(totalAssets, totalAssets, 'Welcome to zae\'vel!', '');

        // Show welcome message briefly before transitioning
        await new Promise(resolve => setTimeout(resolve, 800));

        // Trigger completion
        if (isMountedRef.current && onLoadingComplete) {
          onLoadingComplete();
        }

      } catch (error) {
        console.error('Loading error:', error);
        // Even on error, allow the app to load
        if (isMountedRef.current && onLoadingComplete) {
          onLoadingComplete();
        }
      }
    };

    loadAssets();

    return () => {
      isMountedRef.current = false;
    };
  }, [onLoadingComplete]);

  // Dynamic loading messages based on phase
  const getPhaseMessage = () => {
    switch (phase) {
      case 'fonts':
        return 'Preparing typography...';
      case 'assets':
        return 'Loading interface...';
      case 'secondary':
        return 'Polishing details...';
      case 'finalizing':
        return 'Almost ready...';
      default:
        return 'Starting up...';
    }
  };

  return (
    <div 
      className="h-screen w-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #3E2B27 0%, #2A1F1D 25%, #1E1A19 50%, #252120 75%, #1E1A19 100%)',
      }}
    >
      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              background: ['#8B2A2A', '#7C8B6A', '#A3B1A2', '#C6C1B5'][Math.floor(Math.random() * 4)],
              opacity: 0.3 + Math.random() * 0.4
            }}
          />
        ))}
      </div>

      <div className="text-center relative z-10">
        {/* Logo */}
        <div className="text-6xl mb-6 animate-pulse" style={{ color: '#E5DCC8' }}>
          🌧️
        </div>

        {/* Title */}
        <div 
          className="text-4xl mb-2 font-bold"
          style={{
            fontFamily: 'zozafont, monospace',
            color: '#E5DCC8',
            textShadow: '2px 2px 0px #1E1A19, 4px 4px 8px rgba(0,0,0,0.5)',
            letterSpacing: '0.1em'
          }}
        >
          zae'vel
        </div>

        {/* Subtitle */}
        <div 
          className="text-sm mb-8 opacity-70"
          style={{
            fontFamily: 'Crimson Text, serif',
            color: '#A3B1A2',
            letterSpacing: '0.2em'
          }}
        >
          Specialised Computing Experience
        </div>

        {/* Status message */}
        <div 
          className="text-base mb-4"
          style={{
            fontFamily: 'Courier New, monospace',
            color: '#C6C1B5',
            minHeight: '24px'
          }}
        >
          {loadingText}
        </div>

        {/* Progress bar */}
        <div 
          className="w-96 h-4 border-2 mx-auto mb-3"
          style={{ 
            background: '#2A1F1D',
            borderColor: '#C6C1B5 #1E1A19 #1E1A19 #C6C1B5',
            borderStyle: 'solid',
            maxWidth: '90vw'
          }}
        >
          <div 
            className="h-full transition-all duration-300 ease-out"
            style={{ 
              width: `${Math.max(progress, 2)}%`,
              background: 'linear-gradient(to right, #8B2A2A, #7C8B6A)',
              boxShadow: progress > 5 ? '0 0 10px rgba(139, 42, 42, 0.5)' : 'none'
            }}
          />
        </div>

        {/* Progress details */}
        <div 
          className="text-xs opacity-60"
          style={{
            fontFamily: 'Courier New, monospace',
            color: '#A3B1A2',
            minHeight: '18px'
          }}
        >
          {Math.round(progress)}%
          {currentAsset && ` • ${currentAsset}`}
        </div>

        {/* Phase indicator */}
        <div 
          className="text-xs mt-4 opacity-50"
          style={{
            fontFamily: 'Courier New, monospace',
            color: '#7C8B6A',
            fontStyle: 'italic'
          }}
        >
          {getPhaseMessage()}
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;