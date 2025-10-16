/* eslint-disable no-unused-vars */
export class AssetPreloader {
  constructor() {
    this.loadedAssets = new Map();
    this.loadingPromises = new Map();
    this.failedAssets = new Set();
  }

  // Preload images with retry logic
  preloadImage(src, retries = 3) {
    if (this.loadedAssets.has(src)) {
      return Promise.resolve(this.loadedAssets.get(src));
    }

    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src);
    }

    const promise = new Promise((resolve, reject) => {
      const attemptLoad = (attemptsLeft) => {
        const img = new Image();
        img.onload = () => {
          this.loadedAssets.set(src, img);
          this.loadingPromises.delete(src);
          resolve(img);
        };
        img.onerror = () => {
          if (attemptsLeft > 0) {
            setTimeout(() => attemptLoad(attemptsLeft - 1), 200);
          } else {
            this.failedAssets.add(src);
            this.loadingPromises.delete(src);
            console.warn(`Failed to load image after retries: ${src}`);
            resolve(null);
          }
        };
        img.src = src;
      };
      attemptLoad(retries);
    });

    this.loadingPromises.set(src, promise);
    return promise;
  }

  // Preload audio files
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
        audio.oncanplaythrough = () => {
          this.loadedAssets.set(src, audio);
          this.loadingPromises.delete(src);
          resolve(audio);
        };
        audio.onerror = () => {
          if (attemptsLeft > 0) {
            setTimeout(() => attemptLoad(attemptsLeft - 1), 200);
          } else {
            this.failedAssets.add(src);
            this.loadingPromises.delete(src);
            console.warn(`Failed to load audio after retries: ${src}`);
            resolve(null);
          }
        };
        audio.preload = 'auto';
        audio.src = src;
      };
      attemptLoad(retries);
    });

    this.loadingPromises.set(src, promise);
    return promise;
  }

  // Preload custom fonts (zozafont)
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
            
            // Force immediate rendering for critical fonts
            const testEl = document.createElement('div');
            testEl.style.cssText = `
              position: fixed;
              left: -9999px;
              top: -9999px;
              visibility: hidden;
              font-family: "${fontFamily}", monospace;
              font-size: 64px;
              font-weight: bold;
            `;
            testEl.textContent = "zae'vel TIME TO LOG IN? LOADING The quill awaits";
            document.body.appendChild(testEl);
            
            // Force layout multiple times
            testEl.offsetHeight;
            testEl.getBoundingClientRect();
            
            setTimeout(() => testEl.remove(), 500);
            
            this.loadedAssets.set(fontKey, font);
            this.loadingPromises.delete(fontKey);
            resolve(font);
          })
          .catch((error) => {
            this.failedAssets.add(fontKey);
            this.loadingPromises.delete(fontKey);
            console.warn(`Failed to load font: ${fontFamily}`, error);
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

  // Preload Google Fonts with forced rendering
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
        setTimeout(() => resolve(true), 500);
        return;
      }

      const loadPromises = [];
      
      weights.forEach(weight => {
        styles.forEach(style => {
          const fontString = `${style === 'italic' ? 'italic ' : ''}${weight} 16px "${fontFamily}"`;
          loadPromises.push(
            document.fonts.load(fontString)
              .then(() => {
                // Force render with sample text
                const testEl = document.createElement('div');
                testEl.style.cssText = `
                  position: fixed;
                  left: -9999px;
                  visibility: hidden;
                  font-family: "${fontFamily}";
                  font-weight: ${weight};
                  font-style: ${style};
                  font-size: 16px;
                `;
                testEl.textContent = 'Loading Test Text The quill awaits your thoughts';
                document.body.appendChild(testEl);
                testEl.offsetHeight;
                setTimeout(() => testEl.remove(), 200);
                return true;
              })
              .catch(() => {
                console.warn(`Failed to load ${fontString}`);
                return false;
              })
          );
        });
      });

      Promise.all(loadPromises).then(() => {
        this.loadedAssets.set(fontKey, true);
        this.loadingPromises.delete(fontKey);
        resolve(true);
      });
    });

    this.loadingPromises.set(fontKey, promise);
    return promise;
  }

  // Wait for all fonts to be ready
  waitForFonts() {
    if (document.fonts && document.fonts.ready) {
      return document.fonts.ready;
    }
    return Promise.resolve();
  }

  // Preload multiple assets with progress tracking
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
        console.warn(`Asset failed: ${asset.src || asset.fontFamily}`, error);
      } finally {
        loaded++;
        if (onProgress) {
          onProgress(loaded, total);
        }
      }
    });

    await Promise.all(promises);
    return true;
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

// CRITICAL ASSETS - Must load before app starts
export const CRITICAL_ASSETS = [
  // === FONTS (Highest Priority) ===
  { type: 'font', fontFamily: 'zozafont', src: './public/zozafont.ttf' },
  { type: 'google-font', fontFamily: 'Crimson Text', weights: ['400', '600'], styles: ['normal', 'italic'] },
  { type: 'google-font', fontFamily: 'Lora', weights: ['400', '500', '600'], styles: ['normal', 'italic'] },
  { type: 'google-font', fontFamily: 'Courier New', weights: ['400', '700'], styles: ['normal'] },
  { type: 'google-font', fontFamily: 'Comic Sans MS', weights: ['400'], styles: ['normal'] },
  { type: 'google-font', fontFamily: 'Nunito', weights: ['400', '600', '700'], styles: ['normal'] },
  { type: 'google-font', fontFamily: 'Fredoka One', weights: ['400'], styles: ['normal'] },
  
  // === DESKTOP WALLPAPER (Show first) ===
  { type: 'image', src: './assets/1.jpg' },
  
  // === LOGIN ASSETS ===
  { type: 'image', src: './zhong.jpg' },
  
  // === CORE SOUNDS ===
  { type: 'audio', src: './click.mp3' },
  
  // === PET ANIMATIONS (Critical for interactivity) ===
  { type: 'image', src: './animations/walking_right.gif' },
  { type: 'image', src: './animations/walking_left.gif' },
  { type: 'image', src: './animations/click_right.gif' },
  { type: 'image', src: './animations/click-left.gif' },
  { type: 'image', src: './animations/drag.png' },
  
  // === APP ICONS (Desktop visibility) ===
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
  { type: 'audio', src: './hehe/clickfr.mp3' },
  { type: 'audio', src: './hehe/home-music.mp3' },
  { type: 'audio', src: './hehe/game-music.mp3' },
  
  // === TIC TAC TOE ASSETS ===
  { type: 'image', src: './assets/silly.jpg' },
  
  // === MUSIC PLAYER ASSETS (CRITICAL!) ===
  { type: 'image', src: './assets/kaoru2.gif' },
  { type: 'image', src: './albums/1.jpg' },
  { type: 'image', src: './albums/2.jpg' },
  { type: 'image', src: './albums/3.jpg' },
  { type: 'image', src: './albums/4.jfif' },
  { type: 'image', src: './albums/4.jpg' },
  { type: 'image', src: './albums/5.jpg' },
  { type: 'image', src: './albums/7.png' },
  
  // === CORKBOARD ASSETS (CRITICAL!) ===
  { type: 'image', src: '/corkboard/corkboard.jpg' },
  { type: 'image', src: '/corkboard/boardpin.png' },
  { type: 'audio', src: '/corkboard/audio/click.mp3' },
  { type: 'audio', src: '/corkboard/audio/paper.mp3' },
  { type: 'audio', src: '/corkboard/audio/music.mp3' },
  
  // ALL Stickers - preload all
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
  
  // ALL Polaroids - preload all
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

// SECONDARY ASSETS - Load during login screen
export const SECONDARY_ASSETS = [
  // === CHARACTER IMAGES ===
  { type: 'image', src: './assets/kaoru.gif' },
  { type: 'image', src: './assets/hehe.gif' },
  
  // === ADDITIONAL SOUNDS ===
  { type: 'audio', src: './flip.mp3' },
  { type: 'audio', src: './keyboard.mp3' },
  { type: 'audio', src: './hehe/eat.mp3' },
  { type: 'audio', src: './memorygame-music.mp3' },
  { type: 'audio', src: './cardflip.mp3' },
  
  // === FILE ICONS ===
  { type: 'image', src: './assets/img.png' },
  { type: 'image', src: './assets/txt.png' },
  
  // === ACHIEVEMENTS AUDIO ===
  { type: 'audio', src: './achievements/audios/click.mp3' },
  { type: 'audio', src: './achievements/audios/unlock.mp3' },
  { type: 'audio', src: './achievements/audios/page-flip.mp3' },
];

// Remove the separate CORKBOARD_ASSETS, MUSIC_ASSETS, GAME_ASSETS exports
// as they're now in CRITICAL_ASSETS

// SETTINGS EASTER EGG ASSETS - Lazy load
export const SETTINGS_ASSETS = [
  { type: 'audio', src: './soundzz/error.mp3' },
  { type: 'audio', src: './soundzz/cutscene.mp3' },
  { type: 'audio', src: './soundzz/fireworks.mp3' },
  { type: 'audio', src: './soundzz/booting.mp3' },
  { type: 'image', src: './zhong.png' },
  { type: 'image', src: './childe.png' },
];

// Lazy loader utility for on-demand loading
export async function lazyLoadAssets(assetGroup) {
  return await globalAssetPreloader.preloadAssets(assetGroup);
}