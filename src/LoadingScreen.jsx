import React, { useState, useEffect, useRef } from 'react';
import { globalAssetPreloader, CRITICAL_ASSETS, SECONDARY_ASSETS } from './AssetPreloader';

function LoadingScreen({ onLoadingComplete }) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('ZAE\'VEL LOADING...');
  const [currentAsset, setCurrentAsset] = useState('');
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const loadAssets = async () => {
      const loadingTexts = [
        'ZAE\'VEL LOADING...',
        'Loading desktop assets...',
        'Preparing applications...',
        'Loading fonts...',
        'oh im crying as im making this',
        'Loading zozafont...',
        'Almost ready...',
        'please bare with me..',
        'pure pain..'
      ];

      try {
        // asset loading
        let loadedCount = 0;
        const totalAssets = CRITICAL_ASSETS.length + SECONDARY_ASSETS.length + 3; // +3 for additional font loading phases

        // loading text rotation while loading
        const textInterval = setInterval(() => {
          if (isMountedRef.current) {
            const textIndex = Math.floor((loadedCount / totalAssets) * loadingTexts.length);
            setLoadingText(loadingTexts[Math.min(textIndex, loadingTexts.length - 1)]);
          }
        }, 800);

        // Load all CRITICAL_ASSETS
        for (let i = 0; i < CRITICAL_ASSETS.length; i++) {
          if (!isMountedRef.current) break;

          const asset = CRITICAL_ASSETS[i];
          setCurrentAsset(asset.src ? asset.src.split('/').pop() : asset.fontFamily);

          try {
            if (asset.type === 'image') {
              await globalAssetPreloader.preloadImage(asset.src);
            } else if (asset.type === 'audio') {
              await globalAssetPreloader.preloadAudio(asset.src);
            } else if (asset.type === 'google-font') {
              await globalAssetPreloader.preloadGoogleFont(asset.fontFamily, asset.weights, asset.styles);
            } else if (asset.type === 'font') {
              await globalAssetPreloader.preloadFont(asset.fontFamily, asset.src, asset.descriptors);
            }
          } catch (error) {
            console.warn(`Failed to load ${asset.src || asset.fontFamily}:`, error);
          }

          loadedCount++;
          if (isMountedRef.current) {
            setProgress((loadedCount / totalAssets) * 100);
          }
        }

        // Load all SECONDARY_ASSETS
        for (let i = 0; i < SECONDARY_ASSETS.length; i++) {
          if (!isMountedRef.current) break;

          const asset = SECONDARY_ASSETS[i];
          setCurrentAsset(asset.src ? asset.src.split('/').pop() : '');

          try {
            if (asset.type === 'image') {
              await globalAssetPreloader.preloadImage(asset.src);
            } else if (asset.type === 'audio') {
              await globalAssetPreloader.preloadAudio(asset.src);
            }
          } catch (error) {
            console.warn(`Failed to load ${asset.src}:`, error);
          }

          loadedCount++;
          if (isMountedRef.current) {
            setProgress((loadedCount / totalAssets) * 100);
          }
        }

        // zozafont loading and testing
        if (isMountedRef.current) {
          setCurrentAsset('zozafont');
          setLoadingText('Loading zozafont...');
          
          // testing element
          const zozoTestEl = document.createElement('div');
          zozoTestEl.style.position = 'fixed';
          zozoTestEl.style.left = '-9999px';
          zozoTestEl.style.top = '-9999px';
          zozoTestEl.style.visibility = 'hidden';
          zozoTestEl.style.fontFamily = 'zozafont, monospace';
          zozoTestEl.style.fontSize = '64px';
          zozoTestEl.style.fontWeight = 'bold';
          zozoTestEl.textContent = "zae'vel";
          
          document.body.appendChild(zozoTestEl);
          
          // forcing reflow
          zozoTestEl.offsetHeight;
          zozoTestEl.getBoundingClientRect();
      
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          ctx.font = '64px monospace';
          const fallbackWidth = ctx.measureText("zae'vel").width;
          
          ctx.font = '64px zozafont, monospace';
          const zozoWidth = ctx.measureText("zae'vel").width;
          
          if (Math.abs(zozoWidth - fallbackWidth) < 5) {
            await new Promise(resolve => setTimeout(resolve, 400));
          }
          
          // remove testing element
          setTimeout(() => {
            if (zozoTestEl.parentNode) {
              zozoTestEl.parentNode.removeChild(zozoTestEl);
            }
          }, 200);
          
          // load properly
          await new Promise(resolve => setTimeout(resolve, 300));
          
          loadedCount++;
          setProgress((loadedCount / totalAssets) * 100);
        }

        // Crimson Text & Lora font loading
        if (isMountedRef.current) {
          setCurrentAsset('Crimson Text & Lora fonts');
          setLoadingText('Loading Crimson Text & Lora fonts...');
          
          const testTexts = [
            'Whispers of the Quill',
            'Mysterious dude', 
            'Dear diary magical entry',
            'My Collected Thoughts'
          ];
          
          testTexts.forEach((text, index) => {
            const testEl = document.createElement('div');
            testEl.style.position = 'fixed';
            testEl.style.left = '-9999px';
            testEl.style.top = '-9999px';
            testEl.style.visibility = 'hidden';
            testEl.style.fontFamily = '"Crimson Text", serif';
            testEl.style.fontSize = '16px';
            testEl.textContent = text;
            
            document.body.appendChild(testEl);
            
            testEl.offsetHeight;
            testEl.getBoundingClientRect();
            
            setTimeout(() => {
              if (testEl.parentNode) {
                testEl.parentNode.removeChild(testEl);
              }
            }, 100 + (index * 50));
          });
          
          await new Promise(resolve => setTimeout(resolve, 500));
          
          loadedCount++;
          setProgress((loadedCount / totalAssets) * 100);
        }

        // system fonts finalization
        if (isMountedRef.current) {
          setCurrentAsset('system fonts');
          setLoadingText('Finalizing font loading...');
          
          try {
            if (document.fonts && document.fonts.ready) {
              await document.fonts.ready;
            }
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            ctx.font = '64px monospace';
            const monoWidth = ctx.measureText("zae'vel").width;
            
            ctx.font = '64px zozafont, monospace';
            const zozoWidth = ctx.measureText("zae'vel").width;
            
            ctx.font = '20px serif';
            const serifWidth = ctx.measureText('Mysterious dude').width;
            
            ctx.font = '20px "Crimson Text", serif';
            const crimsonWidth = ctx.measureText('Mysterious dude').width;
            
            if (Math.abs(zozoWidth - monoWidth) < 2 || Math.abs(crimsonWidth - serifWidth) < 1) {
              console.warn('Key fonts may not be fully loaded, waiting...');
              await new Promise(resolve => setTimeout(resolve, 800));
            }
          
            await new Promise(resolve => setTimeout(resolve, 400));
            
          } catch (error) {
            console.warn('Font loading check failed:', error);
          }
          
          loadedCount++;
          setProgress((loadedCount / totalAssets) * 100);
        }

        clearInterval(textInterval);

        if (isMountedRef.current) {
          setLoadingText("Welcome to zae'vel!");
          setCurrentAsset('');
          
          setTimeout(() => {
            if (isMountedRef.current && onLoadingComplete) {
              onLoadingComplete();
            }
          }, 1000);
        }

      } catch (error) {
        console.error('Loading failed:', error);
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

  return (
    <div 
      className="h-screen w-screen flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #3E2B27 0%, #1E1A19 100%)',
      }}
    >
      <div className="text-center">
        {/* status */}
        <div className="text-xl mb-8 font-mono" style={{ color: '#E5DCC8' }}>
          {loadingText}
        </div>

        {/* progress bar */}
        <div className="w-96 h-6 border-2" style={{ 
          background: '#2A1F1D',
          borderColor: '#C6C1B5 #1E1A19 #1E1A19 #C6C1B5',
          borderStyle: 'solid'
        }}>
          <div 
            className="h-full bg-gradient-to-r from-orange-400 to-amber-300 animate-pulse" 
            style={{ width: `${Math.max(progress, 2)}%` }}
          />
        </div>

        {/* progress text */}
        <div className="text-sm mt-6 font-mono" style={{ color: '#A3B1A2' }}>
          {Math.round(progress)}%{currentAsset && ` • ${currentAsset}`}
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;