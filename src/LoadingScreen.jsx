import React, { useState, useEffect, useRef } from 'react';
import { globalAssetPreloader, CRITICAL_ASSETS, MUSIC_ASSETS, CORKBOARD_ASSETS } from './AssetPreloader';

function LoadingScreen({ onLoadingComplete }) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('zae\'vel LOADING...');
  const [currentAsset, setCurrentAsset] = useState('');
  const [phase, setPhase] = useState('initial');
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const loadAssets = async () => {
      const allAssets = [...CRITICAL_ASSETS, ...MUSIC_ASSETS, ...CORKBOARD_ASSETS];
      const totalAssets = allAssets.length;
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

        // Load zozafont first
        const zozafont = CRITICAL_ASSETS.find(a => a.fontFamily === 'zozafont');
        if (zozafont) {
          await globalAssetPreloader.preloadFont(
            zozafont.fontFamily,
            zozafont.src,
            zozafont.descriptors
          );
          loadedCount++;
          updateProgress(loadedCount, totalAssets, 'zozafont loaded ✓', '');
        }

        // Load all Google Fonts in parallel
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

        // Force font rendering with extra time
        await globalAssetPreloader.waitForFonts();
        await new Promise(resolve => setTimeout(resolve, 500));

        // === PHASE 2: CRITICAL IMAGES (15-40%) ===
        setPhase('critical-images');
        const criticalImages = CRITICAL_ASSETS.filter(a => a.type === 'image');

        // Wallpaper first
        const wallpaper = criticalImages.find(a => a.src.includes('1.jpg'));
        if (wallpaper) {
          updateProgress(loadedCount, totalAssets, 'Loading desktop...', 'wallpaper');
          await globalAssetPreloader.preloadImage(wallpaper.src);
          loadedCount++;
        }

        // Login image
        const loginImage = criticalImages.find(a => a.src.includes('zhong.jpg'));
        if (loginImage) {
          updateProgress(loadedCount, totalAssets, 'Loading profile...', 'profile');
          await globalAssetPreloader.preloadImage(loginImage.src);
          loadedCount++;
        }

        // Pet animations
        const petAnimations = criticalImages.filter(a => a.src.includes('animations/'));
        updateProgress(loadedCount, totalAssets, 'Loading pet animations...', 'hakuchin');
        await Promise.all(
          petAnimations.map(async (asset) => {
            await globalAssetPreloader.preloadImage(asset.src);
            loadedCount++;
            updateProgress(loadedCount, totalAssets, 'Loading pet animations...', asset.src.split('/').pop());
          })
        );

        // === PHASE 3: GAME ASSETS (40-55%) ===
        setPhase('game-assets');
        
        // Leaves game assets (CRITICAL!)
        const leavesAssets = CRITICAL_ASSETS.filter(a => 
          a.src && (a.src.includes('hehe/basket') || a.src.includes('hehe/leaf'))
        );
        updateProgress(loadedCount, totalAssets, 'Loading leaves game...', 'basket & leaves');
        await Promise.all(
          leavesAssets.map(async (asset) => {
            await globalAssetPreloader.preloadImage(asset.src);
            loadedCount++;
            updateProgress(loadedCount, totalAssets, 'Loading leaves game...', asset.src.split('/').pop());
          })
        );

        // TicTacToe pfp
        const tictactoePfp = criticalImages.find(a => a.src.includes('silly.jpg'));
        if (tictactoePfp) {
          updateProgress(loadedCount, totalAssets, 'Loading tictactoe...', 'zhongli pfp');
          await globalAssetPreloader.preloadImage(tictactoePfp.src);
          loadedCount++;
        }

        // === PHASE 4: MUSIC PLAYER ASSETS (55-65%) ===
        setPhase('music-assets');
        updateProgress(loadedCount, totalAssets, 'Loading music player...', 'albums');
        
        // Kaoru GIF
        const kaoruGif = criticalImages.find(a => a.src.includes('kaoru2.gif'));
        if (kaoruGif) {
          await globalAssetPreloader.preloadImage(kaoruGif.src);
          loadedCount++;
        }

        // All album covers
        await Promise.all(
          MUSIC_ASSETS.map(async (asset) => {
            await globalAssetPreloader.preloadImage(asset.src);
            loadedCount++;
            updateProgress(loadedCount, totalAssets, 'Loading albums...', asset.src.split('/').pop());
          })
        );

        // === PHASE 5: CORKBOARD ASSETS (65-85%) ===
        setPhase('corkboard');
        updateProgress(loadedCount, totalAssets, 'Loading corkboard...', 'polaroids & stickers');
        
        await Promise.all(
          CORKBOARD_ASSETS.map(async (asset) => {
            if (asset.type === 'image') {
              await globalAssetPreloader.preloadImage(asset.src);
            } else if (asset.type === 'audio') {
              await globalAssetPreloader.preloadAudio(asset.src);
            }
            loadedCount++;
            if (loadedCount % 3 === 0) { // Update every 3 assets to avoid too many renders
              updateProgress(loadedCount, totalAssets, 'Loading corkboard...', asset.src.split('/').pop());
            }
          })
        );

        // === PHASE 6: REMAINING CRITICAL ASSETS (85-95%) ===
        setPhase('remaining');
        updateProgress(loadedCount, totalAssets, 'Loading remaining assets...', '');

        // App icons
        const appIcons = criticalImages.filter(a => 
          a.src.includes('assets/') && 
          !a.src.includes('1.jpg') &&
          !a.src.includes('kaoru') &&
          !a.src.includes('silly.jpg')
        );
        
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

        // Audio files
        const audioAssets = CRITICAL_ASSETS.filter(a => a.type === 'audio');
        await Promise.all(
          audioAssets.map(async (asset) => {
            await globalAssetPreloader.preloadAudio(asset.src);
            loadedCount++;
            updateProgress(loadedCount, totalAssets, 'Loading sounds...', asset.src.split('/').pop());
          })
        );

        // === PHASE 7: FINALIZATION (95-100%) ===
        setPhase('finalizing');
        updateProgress(loadedCount, totalAssets, 'Finalizing...', '');

        // Wait for all fonts to be fully ready
        await globalAssetPreloader.waitForFonts();

        // Final verification with extra delay for decoding
        await new Promise(resolve => setTimeout(resolve, 500));

        // Double-check critical assets
        const criticalCheck = [
          './hehe/basket.png',
          './hehe/leaf-1.png',
          './albums/1.jpg',
          './assets/kaoru2.gif',
          '/corkboard/sticker1.png',
          '/corkboard/polaroids/1.png'
        ];

        let allReady = true;
        for (const src of criticalCheck) {
          if (!globalAssetPreloader.getCachedImage(src)) {
            console.warn(`Critical asset not ready: ${src}`);
            allReady = false;
          }
        }

        if (!allReady) {
          console.warn('Some critical assets not ready, adding extra delay...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        updateProgress(totalAssets, totalAssets, 'Welcome to zae\'vel!', '');

        // Show welcome message briefly
        await new Promise(resolve => setTimeout(resolve, 800));

        // Log loading stats
        const stats = globalAssetPreloader.getStats();
        console.log(`✓ Loading complete: ${stats.loaded} loaded, ${stats.failed} failed`);

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
      case 'critical-images':
        return 'Loading desktop environment...';
      case 'game-assets':
        return 'Setting up games...';
      case 'music-assets':
        return 'Preparing music library...';
      case 'corkboard':
        return 'Loading your memories...';
      case 'remaining':
        return 'Almost there...';
      case 'finalizing':
        return 'Finishing touches...';
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