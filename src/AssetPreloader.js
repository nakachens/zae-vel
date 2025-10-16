/* eslint-disable no-unused-vars */
export class AssetPreloader {
  constructor() {
    this.loadedAssets = new Map();
    this.loadingPromises = new Map();
    this.failedAssets = new Set();
    this.imageCache = new Map(); // Cache decoded images
  }

  // Enhanced image preloading with decode() for instant rendering
  preloadImage(src, retries = 3) {
    if (this.loadedAssets.has(src)) {
      return Promise.resolve(this.loadedAssets.get(src));
    }

    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src);
    }

    const promise = new Promise((resolve) => {
      const attemptLoad = (attemptsLeft) => {
        const img = new Image();
        
        // Critical: Set crossOrigin before src
        img.crossOrigin = 'anonymous';
        
        img.onload = async () => {
          try {
            // Decode image to ensure it's ready for rendering
            await img.decode();
            this.loadedAssets.set(src, img);
            this.imageCache.set(src, img);
            this.loadingPromises.delete(src);
            console.log(`✓ Loaded and decoded: ${src}`);
            resolve(img);
          } catch (decodeError) {
            console.warn(`Decode failed for ${src}, but image loaded:`, decodeError);
            this.loadedAssets.set(src, img);
            this.loadingPromises.delete(src);
            resolve(img);
          }
        };
        
        img.onerror = () => {
          if (attemptsLeft > 0) {
            console.log(`Retry loading ${src}, ${attemptsLeft} attempts left`);
            setTimeout(() => attemptLoad(attemptsLeft - 1), 300);
          } else {
            this.failedAssets.add(src);
            this.loadingPromises.delete(src);
            console.error(`✗ Failed to load: ${src}`);
            resolve(null);
          }
        };
        
        // Set src last
        img.src = src;
      };
      
      attemptLoad(retries);
    });

    this.loadingPromises.set(src, promise);
    return promise;
  }

  // Enhanced audio preloading with full buffer loading
  preloadAudio(src, retries = 3) {
    if (this.loadedAssets.has(src)) {
      return Promise.resolve(this.loadedAssets.get(src));
    }

    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src);
    }

    const promise = new Promise((resolve) => {
      const attemptLoad = (attemptsLeft) => {
        const audio = new Audio();
        
        // Ensure full loading
        audio.preload = 'auto';
        
        const onCanPlay = () => {
          this.loadedAssets.set(src, audio);
          this.loadingPromises.delete(src);
          console.log(`✓ Audio loaded: ${src}`);
          resolve(audio);
          
          // Clean up listeners
          audio.removeEventListener('canplaythrough', onCanPlay);
          audio.removeEventListener('error', onError);
        };
        
        const onError = () => {
          audio.removeEventListener('canplaythrough', onCanPlay);
          audio.removeEventListener('error', onError);
          
          if (attemptsLeft > 0) {
            console.log(`Retry audio ${src}, ${attemptsLeft} attempts left`);
            setTimeout(() => attemptLoad(attemptsLeft - 1), 300);
          } else {
            this.failedAssets.add(src);
            this.loadingPromises.delete(src);
            console.error(`✗ Failed to load audio: ${src}`);
            resolve(null);
          }
        };
        
        audio.addEventListener('canplaythrough', onCanPlay);
        audio.addEventListener('error', onError);
        audio.src = src;
      };
      
      attemptLoad(retries);
    });

    this.loadingPromises.set(src, promise);
    return promise;
  }

  // Enhanced font preloading with forced rendering
  preloadFont(fontFamily, src, descriptors = {}) {
    const fontKey = `${fontFamily}-${src}`;
    
    if (this.loadedAssets.has(fontKey)) {
      return Promise.resolve(this.loadedAssets.get(fontKey));
    }

    if (this.loadingPromises.has(fontKey)) {
      return this.loadingPromises.get(fontKey);
    }

    const promise = new Promise((resolve) => {
      if ('FontFace' in window) {
        const font = new FontFace(fontFamily, `url(${src})`, descriptors);
        
        font.load()
          .then(() => {
            document.fonts.add(font);
            
            // CRITICAL: Force immediate font rendering with multiple techniques
            const preRenderDiv = document.createElement('div');
            preRenderDiv.style.cssText = `
              position: fixed;
              left: -9999px;
              top: -9999px;
              visibility: hidden;
              font-family: "${fontFamily}", monospace;
              font-size: 64px;
              font-weight: bold;
              white-space: pre;
              pointer-events: none;
            `;
            
            // Render all common characters to force font decode
            preRenderDiv.textContent = `zae'vel TIME TO LOG IN? LOADING ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()`;
            document.body.appendChild(preRenderDiv);
            
            // Force multiple reflows to ensure font is decoded
            preRenderDiv.offsetHeight;
            preRenderDiv.getBoundingClientRect();
            window.getComputedStyle(preRenderDiv).fontFamily;
            
            // Keep element for 200ms to ensure render, then remove
            setTimeout(() => {
              if (preRenderDiv.parentNode) {
                preRenderDiv.remove();
              }
            }, 200);
            
            this.loadedAssets.set(fontKey, font);
            this.loadingPromises.delete(fontKey);
            console.log(`✓ Font loaded and rendered: ${fontFamily}`);
            resolve(font);
          })
          .catch((error) => {
            this.failedAssets.add(fontKey);
            this.loadingPromises.delete(fontKey);
            console.error(`✗ Failed to load font: ${fontFamily}`, error);
            resolve(null);
          });
      } else {
        // Fallback for older browsers
        const style = document.createElement('style');
        style.textContent = `
          @font-face {
            font-family: '${fontFamily}';
            src: url('${src}');
            font-display: block;
          }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
          this.loadedAssets.set(fontKey, true);
          this.loadingPromises.delete(fontKey);
          resolve(true);
        }, 500);
      }
    });

    this.loadingPromises.set(fontKey, promise);
    return promise;
  }

  // Enhanced Google Fonts preloading
  preloadGoogleFont(fontFamily, weights = ['400'], styles = ['normal']) {
    const fontKey = `google-${fontFamily}`;
    
    if (this.loadedAssets.has(fontKey)) {
      return Promise.resolve(this.loadedAssets.get(fontKey));
    }

    if (this.loadingPromises.has(fontKey)) {
      return this.loadingPromises.get(fontKey);
    }

    const promise = new Promise((resolve) => {
      if (!document.fonts) {
        setTimeout(() => resolve(true), 800);
        return;
      }

      const loadPromises = [];
      
      weights.forEach(weight => {
        styles.forEach(style => {
          const fontString = `${style === 'italic' ? 'italic ' : ''}${weight} 16px "${fontFamily}"`;
          
          const fontPromise = document.fonts.load(fontString)
            .then(() => {
              // Force render with actual content
              const testEl = document.createElement('div');
              testEl.style.cssText = `
                position: fixed;
                left: -9999px;
                visibility: hidden;
                font-family: "${fontFamily}";
                font-weight: ${weight};
                font-style: ${style};
                font-size: 32px;
                white-space: pre;
              `;
              testEl.textContent = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
              document.body.appendChild(testEl);
              
              testEl.offsetHeight;
              testEl.getBoundingClientRect();
              
              setTimeout(() => testEl.remove(), 100);
              return true;
            })
            .catch(() => {
              console.warn(`Failed to load ${fontString}`);
              return false;
            });
            
          loadPromises.push(fontPromise);
        });
      });

      Promise.all(loadPromises).then(() => {
        this.loadedAssets.set(fontKey, true);
        this.loadingPromises.delete(fontKey);
        console.log(`✓ Google Font loaded: ${fontFamily}`);
        resolve(true);
      });
    });

    this.loadingPromises.set(fontKey, promise);
    return promise;
  }

  // Wait for all fonts with timeout
  waitForFonts(timeout = 5000) {
    if (document.fonts && document.fonts.ready) {
      return Promise.race([
        document.fonts.ready,
        new Promise(resolve => setTimeout(resolve, timeout))
      ]);
    }
    return Promise.resolve();
  }

  // Preload multiple assets with detailed progress
  async preloadAssets(assets, onProgress) {
    const total = assets.length;
    let loaded = 0;

    const promises = assets.map(async (asset) => {
      try {
        if (asset.type === 'image') {
          await this.preloadImage(asset.src);
        } else if (asset.type === 'audio') {
          await this.preloadAudio(asset.src);
        } else if (asset.type === 'font') {
          await this.preloadFont(asset.fontFamily, asset.src, asset.descriptors);
        } else if (asset.type === 'google-font') {
          await this.preloadGoogleFont(asset.fontFamily, asset.weights, asset.styles);
        }
      } catch (error) {
        console.error(`Asset failed: ${asset.src || asset.fontFamily}`, error);
      } finally {
        loaded++;
        if (onProgress) {
          onProgress(loaded, total, asset);
        }
      }
    });

    await Promise.all(promises);
    return true;
  }

  // Get cached image for instant use
  getCachedImage(src) {
    return this.imageCache.get(src);
  }

  // Get loading statistics
  getStats() {
    return {
      loaded: this.loadedAssets.size,
      failed: this.failedAssets.size,
      total: this.loadedAssets.size + this.failedAssets.size
    };
  }
}

// Global instance
export const globalAssetPreloader = new AssetPreloader();

// ============================================================================
// CRITICAL ASSETS - ENHANCED AND COMPREHENSIVE
// ============================================================================

export const CRITICAL_ASSETS = [
  // === FONTS (HIGHEST PRIORITY) ===
  { type: 'font', fontFamily: 'zozafont', src: './public/zozafont.ttf', descriptors: { weight: 'normal', style: 'normal' } },
  { type: 'google-font', fontFamily: 'Crimson Text', weights: ['400', '600'], styles: ['normal', 'italic'] },
  { type: 'google-font', fontFamily: 'Lora', weights: ['400', '500', '600'], styles: ['normal', 'italic'] },
  { type: 'google-font', fontFamily: 'Courier New', weights: ['400', '700'], styles: ['normal'] },
  { type: 'google-font', fontFamily: 'Nunito', weights: ['400', '600', '700'], styles: ['normal'] },
  { type: 'google-font', fontFamily: 'Fredoka One', weights: ['400'], styles: ['normal'] },
  
  // === DESKTOP & LOGIN ===
  { type: 'image', src: './assets/1.jpg' },
  { type: 'image', src: './zhong.jpg' },
  
  // === CORE SOUNDS ===
  { type: 'audio', src: './click.mp3' },
  { type: 'audio', src: './keyboard.mp3' },
  { type: 'audio', src: './flip.mp3' },
  
  // === PET ANIMATIONS ===
  { type: 'image', src: './animations/walking_right.gif' },
  { type: 'image', src: './animations/walking_left.gif' },
  { type: 'image', src: './animations/click_right.gif' },
  { type: 'image', src: './animations/click-left.gif' },
  { type: 'image', src: './animations/drag.png' },
  
  // === APP ICONS ===
  { type: 'image', src: './assets/calc.png' },
  { type: 'image', src: './assets/music.png' },
  { type: 'image', src: './assets/weather.png' },
  { type: 'image', src: './assets/tictactoe.png' },
  { type: 'image', src: './assets/notebook.png' },
  { type: 'image', src: './assets/leaves.png' },
  { type: 'image', src: './assets/search.png' },
  { type: 'image', src: './assets/poetry.png' },
  { type: 'image', src: './assets/memory.png' },
  { type: 'image', src: './assets/snakey.png' },
  { type: 'image', src: './assets/paint.png' },
  { type: 'image', src: './assets/folder.png' },
  { type: 'image', src: './assets/heart.png' },
  { type: 'image', src: './assets/settings.png' },
  
  // === LEAVES GAME ASSETS (CRITICAL!) ===
  { type: 'image', src: './hehe/basket.png' },
  { type: 'image', src: './hehe/leaf-1.png' },
  { type: 'image', src: './hehe/leaf-2.png' },
  { type: 'image', src: './hehe/leaf-3.png' },
  { type: 'audio', src: './hehe/catch2.mp3' },
  { type: 'audio', src: './hehe/home-music.mp3' },
  { type: 'audio', src: './hehe/game-music.mp3' },
  { type: 'audio', src: './hehe/clickfr.mp3' },
  { type: 'audio', src: './hehe/eat.mp3' },
  
  // === TICTACTOE ASSETS ===
  { type: 'image', src: './assets/silly.jpg' },
  
  // === CHARACTER IMAGES ===
  { type: 'image', src: './assets/kaoru.gif' },
  { type: 'image', src: './assets/kaoru2.gif' },
  { type: 'image', src: './assets/hehe.gif' },
];

// ============================================================================
// MUSIC PLAYER ASSETS - Load immediately after critical
// ============================================================================

export const MUSIC_ASSETS = [
  { type: 'image', src: './albums/1.jpg' },
  { type: 'image', src: './albums/2.jpg' },
  { type: 'image', src: './albums/3.jpg' },
  { type: 'image', src: './albums/4.jfif' },
  { type: 'image', src: './albums/4.jpg' },
  { type: 'image', src: './albums/5.jpg' },
  { type: 'image', src: './albums/7.png' },
];

// ============================================================================
// CORKBOARD ASSETS - Most critical for your use case
// ============================================================================

export const CORKBOARD_ASSETS = [
  // Background
  { type: 'image', src: '/corkboard/corkboard.jpg' },
  { type: 'image', src: '/corkboard/boardpin.png' },
  
  // Audio
  { type: 'audio', src: '/corkboard/audio/click.mp3' },
  { type: 'audio', src: '/corkboard/audio/paper.mp3' },
  { type: 'audio', src: '/corkboard/audio/music.mp3' },
  
  // ALL Stickers (preload all to avoid delays)
  { type: 'image', src: '/corkboard/sticker1.png' },
  { type: 'image', src: '/corkboard/sticker2.png' },
  { type: 'image', src: '/corkboard/sticker3.png' },
  { type: 'image', src: '/corkboard/sticker4.png' },
  { type: 'image', src: '/corkboard/sticker5.png' },
  { type: 'image', src: '/corkboard/sticker6.png' },
  { type: 'image', src: '/corkboard/sticker8.png' },
  { type: 'image', src: '/corkboard/sticker9.png' },
  { type: 'image', src: '/corkboard/sticker10.png' },
  { type: 'image', src: '/corkboard/sticker11.png' },
  { type: 'image', src: '/corkboard/sticker12.png' },
  { type: 'image', src: '/corkboard/sticker13.png' },
  { type: 'image', src: '/corkboard/sticker14.png' },
  { type: 'image', src: '/corkboard/sticker15.png' },
  { type: 'image', src: '/corkboard/sticker16.png' },
  { type: 'image', src: '/corkboard/sticker17.png' },
  
  // ALL Polaroids (preload all)
  { type: 'image', src: '/corkboard/polaroids/1.png' },
  { type: 'image', src: '/corkboard/polaroids/2.png' },
  { type: 'image', src: '/corkboard/polaroids/3.png' },
  { type: 'image', src: '/corkboard/polaroids/4.png' },
  { type: 'image', src: '/corkboard/polaroids/5.png' },
  { type: 'image', src: '/corkboard/polaroids/6.png' },
  { type: 'image', src: '/corkboard/polaroids/7.png' },
  { type: 'image', src: '/corkboard/polaroids/8.png' },
  { type: 'image', src: '/corkboard/polaroids/9.png' },
];

// ============================================================================
// GAME ASSETS - Secondary priority
// ============================================================================

export const GAME_ASSETS = [
  { type: 'audio', src: './memorygame-music.mp3' },
  { type: 'audio', src: './cardflip.mp3' },
];

// ============================================================================
// ACHIEVEMENTS & MISC
// ============================================================================

export const ACHIEVEMENTS_ASSETS = [
  { type: 'audio', src: './achievements/audios/click.mp3' },
  { type: 'audio', src: './achievements/audios/unlock.mp3' },
  { type: 'audio', src: './achievements/audios/page-flip.mp3' },
];

export const SETTINGS_ASSETS = [
  { type: 'audio', src: './soundzz/error.mp3' },
  { type: 'audio', src: './soundzz/cutscene.mp3' },
  { type: 'audio', src: './soundzz/fireworks.mp3' },
  { type: 'audio', src: './soundzz/booting.mp3' },
  { type: 'image', src: './zhong.png' },
  { type: 'image', src: './childe.png' },
];

// Lazy loader utility
export async function lazyLoadAssets(assetGroup) {
  return await globalAssetPreloader.preloadAssets(assetGroup);
}