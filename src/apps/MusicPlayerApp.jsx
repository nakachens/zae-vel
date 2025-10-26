/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import './MusicPlayer.css'

// IndexedDB helper for storing audio files
const DB_NAME = 'MusicPlayerDB';
const DB_VERSION = 1;
const STORE_NAME = 'audioFiles';

const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

const saveAudioFile = async (id, file) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({ id, file });
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

const getAudioFile = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);
    
    request.onsuccess = () => resolve(request.result?.file);
    request.onerror = () => reject(request.error);
  });
};

const deleteAudioFile = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Audio manager
class AudioManager {
  constructor() {
    this.audioElements = [];
    this.currentAudioRef = null;
    this.isPlaying = false;
    this.currentSongIndex = 0;
    this.currentTime = 0;
    this.duration = 0;
    this.volume = 1.0;
    this.listeners = new Set();
    this.isRepeating = false;
    this.initialized = false;
    this.playlist = [];
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(eventType, data) {
    this.listeners.forEach(callback => callback(eventType, data));
  }

  async initialize(playlist, audioFiles) {
    this.initialized = false;
    this.playlist = [...playlist];
    const elements = [];
    
    for (let i = 0; i < playlist.length; i++) {
      const song = playlist[i];
      const audio = new Audio();
      let audioPath = audioFiles[song.audioId];
      
      if (song.audioId.startsWith('uploaded-')) {
        try {
          const file = await getAudioFile(song.audioId);
          if (file) {
            audioPath = URL.createObjectURL(file);
          }
        } catch (error) {
          console.error('Failed to load uploaded file:', error);
        }
      }
      
      if (audioPath) {
        audio.src = audioPath;
        audio.preload = 'metadata';
        audio.volume = this.volume;
        audio.loop = this.isRepeating;
        
        audio.addEventListener('loadedmetadata', () => {
          console.log(`Loaded: ${song.title}`);
        });
        
        audio.addEventListener('error', (e) => {
          console.log(`Failed to load: ${song.title}`, e);
        });
        
        audio.addEventListener('ended', () => {
          if (this.isRepeating) {
            audio.currentTime = 0;
            audio.play();
          } else {
            this.nextSong();
          }
        });
        
        audio.addEventListener('timeupdate', () => {
          this.currentTime = audio.currentTime;
          this.duration = audio.duration || 0;
          this.notify('timeUpdate', {
            currentTime: this.currentTime,
            duration: this.duration
          });
        });
        
        elements.push(audio);
      } else {
        elements.push(null);
      }
    }
    
    this.audioElements = elements;
    
    if (this.currentSongIndex >= elements.length) {
      this.currentSongIndex = 0;
    }
    
    const firstAvailable = elements.find(el => el !== null);
    if (firstAvailable) {
      const firstIndex = elements.indexOf(firstAvailable);
      this.currentAudioRef = elements[this.currentSongIndex] || firstAvailable;
      if (!elements[this.currentSongIndex]) {
        this.currentSongIndex = firstIndex;
      }
    } else {
      this.currentAudioRef = null;
      this.currentSongIndex = 0;
    }
    
    this.initialized = true;
    this.notify('initialized', {});
  }

  updatePlaylist(newPlaylist) {
    this.playlist = [...newPlaylist];
    this.notify('playlistUpdated', { playlist: this.playlist });
  }

  getCurrentSong() {
    return this.playlist[this.currentSongIndex] || {};
  }

  async play() {
    if (!this.currentAudioRef) return false;
    
    try {
      this.currentAudioRef.volume = this.volume;
      await this.currentAudioRef.play();
      this.isPlaying = true;
      this.notify('playStateChanged', { isPlaying: true });
      return true;
    } catch (error) {
      console.log('Play failed:', error);
      this.isPlaying = false;
      this.notify('playStateChanged', { isPlaying: false });
      return false;
    }
  }

  pause() {
    if (this.currentAudioRef) {
      this.currentAudioRef.pause();
      this.isPlaying = false;
      this.notify('playStateChanged', { isPlaying: false });
    }
  }

  async togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      await this.play();
    }
  }

  selectSong(index) {
    if (!this.audioElements[index]) return false;
    
    if (this.currentAudioRef) {
      this.currentAudioRef.pause();
      this.currentAudioRef.currentTime = 0;
    }
    
    this.currentSongIndex = index;
    this.currentAudioRef = this.audioElements[index];
    
    if (this.currentAudioRef) {
      this.currentAudioRef.volume = this.volume;
    }
    
    this.notify('songChanged', { 
      currentSongIndex: this.currentSongIndex 
    });
    
    return true;
  }

  nextSong() {
    if (this.audioElements.length === 0) return;
    
    let nextIndex = this.currentSongIndex;
    let attempts = 0;
    do {
      nextIndex = (nextIndex + 1) % this.audioElements.length;
      attempts++;
    } while (!this.audioElements[nextIndex] && attempts < this.audioElements.length);
    
    if (this.audioElements[nextIndex]) {
      const wasPlaying = this.isPlaying;
      this.selectSong(nextIndex);
      if (wasPlaying) {
        setTimeout(() => this.play(), 100);
      }
    }
  }

  previousSong() {
    if (this.audioElements.length === 0) return;
    
    let prevIndex = this.currentSongIndex;
    let attempts = 0;
    do {
      prevIndex = prevIndex > 0 ? prevIndex - 1 : this.audioElements.length - 1;
      attempts++;
    } while (!this.audioElements[prevIndex] && attempts < this.audioElements.length);
    
    if (this.audioElements[prevIndex]) {
      const wasPlaying = this.isPlaying;
      this.selectSong(prevIndex);
      if (wasPlaying) {
        setTimeout(() => this.play(), 100);
      }
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.audioElements.forEach(audio => {
      if (audio) audio.volume = this.volume;
    });
    this.notify('volumeChanged', { volume: this.volume });
  }

  seekTo(percentage) {
    if (this.currentAudioRef && this.duration) {
      this.currentAudioRef.currentTime = percentage * this.duration;
    }
  }

  setRepeat(repeat) {
    this.isRepeating = repeat;
    this.audioElements.forEach(audio => {
      if (audio) audio.loop = repeat;
    });
    this.notify('repeatChanged', { isRepeating: repeat });
  }

  getState() {
    return {
      isPlaying: this.isPlaying,
      currentSongIndex: this.currentSongIndex,
      currentTime: this.currentTime,
      duration: this.duration,
      volume: this.volume,
      isRepeating: this.isRepeating,
      hasCurrentSong: !!this.currentAudioRef,
      currentSong: this.getCurrentSong()
    };
  }

  destroy() {
    this.pause();
    this.audioElements.forEach(audio => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    });
    this.audioElements = [];
    this.currentAudioRef = null;
    this.listeners.clear();
    this.initialized = false;
    this.playlist = [];
  }
}

const globalAudioManager = new AudioManager();

const RetroAutumnMusicPlayer = ({ onAppClose, isClosing }) => {
  const initialPlaylist = [
    {
      title: "Been You",
      subtitle: "be it the friend from high school, gaming friend, sharing friend, its always been u man.",
      audioId: "song-1",
      artist: "Justin Beiber",
      coverImage: "./albums/2.jpg",
      coverColor: "linear-gradient(135deg, #FF6B6B, #FF8E53)",
      isInApp: true
    },
    {
      title: "love for you",
      subtitle: "this song because you(r feet) prolly tastes like strawberry choco",
      audioId: "song-2",
      artist: "loveli lori & ovg!",
      coverImage: "./albums/1.jpg",
      coverColor: "linear-gradient(135deg, #4ECDC4, #44A08D)",
      isInApp: true
    },
    {
      title: "BBBlue",
      subtitle: "not you my baby blue~",
      audioId: "song-3",
      artist: "Olivver the Kid",
      coverImage: "./albums/3.jpg",
      coverColor: "linear-gradient(135deg, #845EC2, #B39BC8)",
      isInApp: true
    },
    {
      title: "Sapna",
      subtitle: "if we ever go out for a picnic lets make a mini movie on this song..",
      audioId: "song-4",
      artist: "Bayaan",
      coverImage: "./albums/4.jfif",
      coverColor: "linear-gradient(135deg, #FFC75F, #F9CA24)",
      isInApp: true
    },
    {
      title: "Tek It (Sped Up)",
      subtitle: "me when i look at the moon and its not zai",
      audioId: "song-5",
      artist: "Cafuné",
      coverImage: "./albums/4.jpg",
      coverColor: "linear-gradient(135deg, #6C5CE7, #A29BFE)",
      isInApp: true
    },
    {
      title: "How Long",
      subtitle: "how long has it been since we called each other~",
      audioId: "song-6",
      artist: "Charlie Puth",
      coverImage: "./albums/5.jpg",
      coverColor: "linear-gradient(135deg, #FD79A8, #FDCB6E)",
      isInApp: true
    },
    {
      title: "Passionfruit",
      subtitle: "looking at your passion makes me wanna be passionate about my life too~",
      audioId: "song-7",
      artist: "Drake",
      coverImage: "./albums/7.png",
      coverColor: "linear-gradient(135deg, #FD79A8, #FDCB6E)",
      isInApp: true
    }
  ];

  const audioFiles = {
    "song-1": "./soundzz/Been You.mp3",
    "song-2": "./soundzz/loveli lori & ovg! - love for you (Official Audio).mp3",
    "song-3": "./soundzz/BBBlue.mp3",
    "song-4": "./soundzz/Sapna.mp3",
    "song-5": "./soundzz/Cafuné - Tek It (Sped Up) [Official Audio].mp3",
    "song-6": "./soundzz/Charlie Puth - How Long (Lyrics).mp3",
    "song-7": "./soundzz/Drake - Passionfruit (Lyrics).mp3"
  };

  const [playlist, setPlaylist] = useState([]);
  const [library, setLibrary] = useState([]);
  const [audioState, setAudioState] = useState(globalAudioManager.getState());
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffledPlaylist, setShuffledPlaylist] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [showHome, setShowHome] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [hoveredSong, setHoveredSong] = useState(null);
  const [removePopup, setRemovePopup] = useState(null);
  const [addBackPopup, setAddBackPopup] = useState(null);
  const [uploadPopup, setUploadPopup] = useState(null);

  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);

  const fileInputRef = useRef(null);
  const clickSoundRef = useRef(null);
  const unsubscribeRef = useRef(null);
  const isInitializing = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedPlaylistMeta = localStorage.getItem('musicPlayerPlaylistMeta');
        const savedLibrary = localStorage.getItem('musicPlayerLibrary');
        
        let playlistMeta = [];
        let libraryData = [];
        
        if (savedPlaylistMeta) {
          playlistMeta = JSON.parse(savedPlaylistMeta);
        }
        
        if (savedLibrary) {
          libraryData = JSON.parse(savedLibrary);
        }
        
        const inAppSongsInPlaylist = initialPlaylist.filter(song => 
          !libraryData.some(libSong => libSong.audioId === song.audioId)
        );
        
        const uploadedSongsMeta = playlistMeta.filter(song => !song.isInApp);
        
        setPlaylist([...inAppSongsInPlaylist, ...uploadedSongsMeta]);
        setLibrary(libraryData);
      } catch (error) {
        console.error('Error loading from localStorage:', error);
        setPlaylist(initialPlaylist);
        setLibrary([]);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    try {
      const playlistMeta = playlist.map(song => ({
        ...song,
        file: undefined
      }));
      
      localStorage.setItem('musicPlayerPlaylistMeta', JSON.stringify(playlistMeta));
      localStorage.setItem('musicPlayerLibrary', JSON.stringify(library));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [playlist, library]);

  useEffect(() => {
    clickSoundRef.current = new Audio('/click.mp3');
    clickSoundRef.current.volume = 0.3;
  }, []);

  useEffect(() => {
    const initializeAudio = async () => {
      if (isInitializing.current || playlist.length === 0) return;
      
      isInitializing.current = true;
      setShowLoading(true);
      
      await globalAudioManager.initialize(playlist, audioFiles);
      setAudioState(globalAudioManager.getState());
      setShowLoading(false);
      isInitializing.current = false;
    };

    initializeAudio();

    const unsubscribe = globalAudioManager.subscribe((eventType, data) => {
      switch (eventType) {
        case 'playStateChanged':
        case 'songChanged':
        case 'timeUpdate':
        case 'volumeChanged':
        case 'repeatChanged':
        case 'playlistUpdated':
        case 'initialized':
          setAudioState(globalAudioManager.getState());
          break;
      }
    });

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [playlist]);

  useEffect(() => {
    if (audioState.isPlaying && showHome) {
      setShowMiniPlayer(true);
    } else if (showPlayer) {
      setShowMiniPlayer(false);
    }
  }, [audioState.isPlaying, showHome, showPlayer]);

  useEffect(() => {
    if (isClosing) {
      globalAudioManager.destroy();
    }
    
    return () => {};
  }, [isClosing]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.target.tagName === 'INPUT') return;
      
      switch(event.code) {
        case 'Space':
          event.preventDefault();
          globalAudioManager.togglePlayPause();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          globalAudioManager.previousSong();
          break;
        case 'ArrowRight':
          event.preventDefault();
          globalAudioManager.nextSong();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleGlobalMouseMove = (event) => {
      if (isDraggingProgress) {
        const progressContainer = document.querySelector('.progress-container');
        if (progressContainer) {
          const rect = progressContainer.getBoundingClientRect();
          const clickX = event.clientX - rect.left;
          const percentage = Math.max(0, Math.min(1, clickX / rect.width));
          if (audioState.hasCurrentSong && audioState.duration) {
            globalAudioManager.seekTo(percentage);
          }
        }
      }
      
      if (isDraggingVolume) {
        const volumeSlider = document.querySelector('.volume-slider');
        if (volumeSlider) {
          const rect = volumeSlider.getBoundingClientRect();
          const clickX = event.clientX - rect.left;
          const percentage = Math.max(0, Math.min(1, clickX / rect.width));
          globalAudioManager.setVolume(percentage);
        }
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDraggingProgress(false);
      setIsDraggingVolume(false);
    };

    if (isDraggingProgress || isDraggingVolume) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDraggingProgress, isDraggingVolume, audioState.hasCurrentSong, audioState.duration]);

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playClickSound = () => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(error => {
        console.log("Click sound play failed:", error);
      });
    }
  };

  const openPlaylist = () => {
    playClickSound();
    setShowPlaylist(true);
    setShowLibrary(false);
  };

  const openLibrary = () => {
    playClickSound();
    setShowLibrary(true);
    setShowPlaylist(false);
  };

  const closePlaylistPopup = () => {
    playClickSound();
    setShowPlaylist(false);
  };

  const closeLibraryPopup = () => {
    playClickSound();
    setShowLibrary(false);
  };

  const goHome = () => {
    playClickSound();
    setShowPlayer(false);
    setShowHome(true);
    if (audioState.isPlaying) {
      setShowMiniPlayer(true);
    }
  };

  const showPlayerScreen = () => {
    playClickSound();
    setShowHome(false);
    setShowPlayer(true);
    setShowMiniPlayer(false);
  };

  const toggleShuffle = () => {
    playClickSound();
    const newShuffled = !isShuffled;
    setIsShuffled(newShuffled);
    
    if (newShuffled) {
      const availableIndices = playlist
        .map((_, index) => index)
        .filter(i => globalAudioManager.audioElements[i] !== null);
      setShuffledPlaylist(availableIndices.sort(() => Math.random() - 0.5));
    }
  };

  const playAll = () => {
    playClickSound();
    const availableSongs = playlist.filter((song, index) => globalAudioManager.audioElements[index] !== null);
    if (availableSongs.length === 0) {
      return;
    }
    
    if (isShuffled && shuffledPlaylist.length === 0) {
      const availableIndices = playlist
        .map((_, index) => index)
        .filter(i => globalAudioManager.audioElements[i] !== null);
      setShuffledPlaylist(availableIndices.sort(() => Math.random() - 0.5));
    }
    
    const firstIndex = isShuffled ? shuffledPlaylist[0] : 
                     playlist.findIndex((song, index) => globalAudioManager.audioElements[index] !== null);
    
    selectSong(firstIndex);
    closePlaylistPopup();
    setTimeout(() => globalAudioManager.play(), 100);
  };

  const selectSong = (index) => {
    playClickSound();
    if (!globalAudioManager.selectSong(index)) {
      return;
    }
    
    showPlayerScreen();
    closePlaylistPopup();
  };

  const handleRemoveSong = (index, song) => {
    playClickSound();
    setRemovePopup({ index, song });
  };

  const confirmRemoveSong = async () => {
    if (!removePopup) return;
    
    const { index, song } = removePopup;
    
    if (song.isInApp) {
      setLibrary(prev => [...prev, song]);
    } else {
      try {
        await deleteAudioFile(song.audioId);
      } catch (error) {
        console.error('Failed to delete audio file:', error);
      }
    }
    
    const newPlaylist = playlist.filter((_, i) => i !== index);
    setPlaylist(newPlaylist);
    
    isInitializing.current = false;
    
    setRemovePopup(null);
    playClickSound();
  };

  const cancelRemoveSong = () => {
    playClickSound();
    setRemovePopup(null);
  };

  const handleAddBackToPlaylist = (song) => {
    playClickSound();
    setAddBackPopup(song);
  };

  const confirmAddBack = async () => {
    if (!addBackPopup) return;
    
    const song = addBackPopup;
    
    setLibrary(prev => prev.filter(s => s.audioId !== song.audioId));
    
    const newPlaylist = [...playlist, song];
    setPlaylist(newPlaylist);
    
    isInitializing.current = false;
    
    setAddBackPopup(null);
    playClickSound();
  };

  const cancelAddBack = () => {
    playClickSound();
    setAddBackPopup(null);
  };

  const handleProgressInteraction = (event, isDragging = false) => {
    if (!isDragging) playClickSound();
    if (audioState.hasCurrentSong && audioState.duration) {
      const rect = event.currentTarget.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
      globalAudioManager.seekTo(percentage);
    }
  };

  const handleProgressMouseDown = (event) => {
    setIsDraggingProgress(true);
    handleProgressInteraction(event);
  };

  const handleVolumeInteraction = (event, isDragging = false) => {
    if (!isDragging) playClickSound();
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    globalAudioManager.setVolume(percentage);
  };

  const handleVolumeMouseDown = (event) => {
    setIsDraggingVolume(true);
    handleVolumeInteraction(event);
  };

  const toggleRepeat = () => {
    playClickSound();
    globalAudioManager.setRepeat(!audioState.isRepeating);
  };

  const toggleFavorite = () => {
    playClickSound();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(audioState.currentSongIndex)) {
      newFavorites.delete(audioState.currentSongIndex);
    } else {
      newFavorites.add(audioState.currentSongIndex);
    }
    setFavorites(newFavorites);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
  };

  const handleDrop = (event) => {
    event.preventDefault();
    playClickSound();
    event.currentTarget.classList.remove('dragover');
    const files = event.dataTransfer.files;
    addAudioFiles(files);
  };

  const handleFileSelect = (event) => {
    playClickSound();
    const files = event.target.files;
    addAudioFiles(files);
    event.target.value = '';
  };

  const addAudioFiles = async (files) => {
    const validFiles = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('audio/')) {
        validFiles.push(file);
      }
    }
    
    if (validFiles.length === 0) {
      setUploadPopup({ count: 0, success: false });
      return;
    }
    
    const newSongs = [];
    
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const audioId = `uploaded-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`;
      
      try {
        await saveAudioFile(audioId, file);
      } catch (error) {
        console.error('Failed to save audio file:', error);
        continue;
      }
      
      const song = {
        title: file.name.replace(/\.[^/.]+$/, ""),
        subtitle: 'Uploaded song',
        audioId: audioId,
        artist: 'Unknown',
        coverImage: null,
        coverColor: 'linear-gradient(135deg, #8B4513, #CD853F)',
        isInApp: false
      };
      
      newSongs.push(song);
    }
    
    if (newSongs.length > 0) {
      const newPlaylist = [...playlist, ...newSongs];
      setPlaylist(newPlaylist);
      
      isInitializing.current = false;
      
      setUploadPopup({ count: newSongs.length, success: true });
    } else {
      setUploadPopup({ count: 0, success: false });
    }
  };

  const closeUploadPopup = () => {
    playClickSound();
    setUploadPopup(null);
  };

  const getCurrentSong = () => {
    return audioState.currentSong || playlist[audioState.currentSongIndex] || {};
  };

  return (
    <>
      <div className="music-player-container">
        <div className="app-container">
          {showLoading && (
            <div className="loading-message">Loading audio...</div>
          )}

          {showMiniPlayer && (
            <div className="mini-player" onClick={showPlayerScreen}>
              <div>♪ {getCurrentSong().title || 'No song playing'}</div>
            </div>
          )}

          {showHome && (
            <div className="home-screen">
              <div className="app-title">MUSICPLAYER<br />Zai's</div>
              
              <div className="character-placeholder">
                <img 
                  src="./assets/kaoru2.gif" 
                  alt="Kaoru Character"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '6px'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = 'oh no.. image not loading.. <br/> cri';
                  }}
                />
              </div>

              <button className="playlist-btn" onClick={openPlaylist}>PLAYLIST</button>
            </div>
          )}

          {showPlaylist && (
            <div className="playlist-popup">
              <div className="popup-header">
                MY PLAYLIST
                <div className="close-btn" onClick={closePlaylistPopup}>×</div>
              </div>
              
              <div className="playlist-controls">
                <button 
                  className={`control-btn ${isShuffled ? 'shuffle-active' : ''}`} 
                  onClick={toggleShuffle}
                >
                  SHUFFLE
                </button>
                <button className="control-btn" onClick={playAll}>PLAY ALL</button>
                <button className="control-btn" onClick={openLibrary} style={{ background: 'linear-gradient(145deg, #7C8B6A, #5A6B4A)' }}>
                  ᯓ‎𝄞 ˎˊ˗
                </button>
              </div>

              <div className="song-list">
                {playlist.map((song, index) => {
                  const isFavorite = favorites.has(index);
                  const isAvailable = globalAudioManager.audioElements[index] !== null;
                  const isCurrentlyPlaying = index === audioState.currentSongIndex;
                  
                  return (
                    <div 
                      key={`${song.audioId}-${index}`}
                      className={`song-item ${isCurrentlyPlaying ? 'playing' : ''}`}
                      onClick={() => isAvailable && selectSong(index)}
                      onMouseEnter={() => setHoveredSong(index)}
                      onMouseLeave={() => setHoveredSong(null)}
                      style={{
                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                        opacity: isAvailable ? 1 : 0.5,
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                          <div>{song.title}</div>
                          <div style={{ fontSize: '10px', opacity: 0.8 }}>
                            {song.subtitle} {!isAvailable ? '(File not found)' : ''}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ fontSize: '10px', color: isFavorite ? '#FF6347' : 'transparent' }}>♥</div>
                          {hoveredSong === index && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveSong(index, song);
                              }}
                              style={{
                                width: '14px',
                                height: '14px',
                                borderRadius: '50%',
                                background: '#8B2A2A',
                                border: '1px solid #1E1A19',
                                color: '#E5DCC8',
                                fontSize: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                padding: 0,
                                lineHeight: 1,
                                fontWeight: 'bold'
                              }}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div 
                className="upload-area" 
                onClick={() => {
                  playClickSound();
                  fileInputRef.current?.click();
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div>+ ADD MUSIC FILES</div>
                <div style={{ fontSize: '5px', marginTop: '5px' }}>Drop MP3 files here or click to browse</div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="audio/*" 
                  multiple 
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />
              </div>
            </div>
          )}

          {showLibrary && (
            <div className="playlist-popup">
              <div className="popup-header">
                LIBRARY - ARCHIVED SONGS
                <div className="close-btn" onClick={closeLibraryPopup}>×</div>
              </div>

              <div className="song-list" style={{ maxHeight: '280px' }}>
                {library.length === 0 ? (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '40px 20px', 
                    color: '#1E1A19',
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}>
                    no archived songs ^0^
                    <br />
                    <span style={{ fontSize: '10px', opacity: 0.7 }}>
                      Songs removed from playlist appear hereee~
                    </span>
                  </div>
                ) : (
                  library.map((song, index) => (
                    <div 
                      key={`${song.audioId}-lib-${index}`}
                      className="song-item"
                      onClick={() => handleAddBackToPlaylist(song)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div>{song.title}</div>
                          <div style={{ fontSize: '10px', opacity: 0.8 }}>
                            {song.subtitle}
                          </div>
                        </div>
                        <div style={{ fontSize: '10px', color: '#7C8B6A' }}>+ Add</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {library.length > 0 && (
                <div style={{ 
                  padding: '12px',
                  textAlign: 'center',
                  fontSize: '10px',
                  color: '#3E2B27',
                  borderTop: '2px solid #3E2B27'
                }}>
                  Click on any song to add it back to playlist
                </div>
              )}
            </div>
          )}

          {removePopup && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '260px',
              background: 'linear-gradient(145deg, #C6C1B5, #A3B1A2)',
              border: '4px solid #3E2B27',
              borderRadius: '12px',
              padding: '15px',
              zIndex: 200,
              boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
            }}>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: 'bold', 
                marginBottom: '10px',
                color: '#1E1A19',
                textAlign: 'center'
              }}>
                Remove this song from playlist?
              </div>
              
              <div style={{ 
                fontSize: '10px', 
                marginBottom: '15px',
                color: '#3E2B27',
                textAlign: 'center',
                lineHeight: '1.4'
              }}>
                {removePopup.song.isInApp 
                  ? "Removing in-app songs will move them to library. You can add them back anytime!"
                  : "Your uploaded songs are deleted fr fr, upload them again if u want it back!"}
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  onClick={confirmRemoveSong}
                  className="control-btn"
                  style={{ 
                    background: 'linear-gradient(145deg, #8B2A2A, #6B1F1F)',
                    padding: '8px 16px'
                  }}
                >
                  YES
                </button>
                <button
                  onClick={cancelRemoveSong}
                  className="control-btn"
                  style={{ 
                    background: 'linear-gradient(145deg, #7C8B6A, #5A6B4A)',
                    padding: '8px 16px'
                  }}
                >
                  NO
                </button>
              </div>
            </div>
          )}

          {addBackPopup && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '260px',
              background: 'linear-gradient(145deg, #C6C1B5, #A3B1A2)',
              border: '4px solid #3E2B27',
              borderRadius: '12px',
              padding: '15px',
              zIndex: 200,
              boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
            }}>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: 'bold', 
                marginBottom: '10px',
                color: '#1E1A19',
                textAlign: 'center'
              }}>
                Add back to playlist?
              </div>
              
              <div style={{ 
                fontSize: '10px', 
                marginBottom: '15px',
                color: '#3E2B27',
                textAlign: 'center',
                lineHeight: '1.4'
              }}>
                "{addBackPopup.title}" will be added back to your playlist!
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  onClick={confirmAddBack}
                  className="control-btn"
                  style={{ 
                    background: 'linear-gradient(145deg, #7C8B6A, #5A6B4A)',
                    padding: '8px 16px'
                  }}
                >
                  YES
                </button>
                <button
                  onClick={cancelAddBack}
                  className="control-btn"
                  style={{ 
                    background: 'linear-gradient(145deg, #8B2A2A, #6B1F1F)',
                    padding: '8px 16px'
                  }}
                >
                  NO
                </button>
              </div>
            </div>
          )}

          {uploadPopup && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '260px',
              background: 'linear-gradient(145deg, #C6C1B5, #A3B1A2)',
              border: '4px solid #3E2B27',
              borderRadius: '12px',
              padding: '15px',
              zIndex: 200,
              boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
            }}>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: 'bold', 
                marginBottom: '10px',
                color: '#1E1A19',
                textAlign: 'center'
              }}>
                {uploadPopup.success ? 'Songs Added! ♪' : 'Oops!'}
              </div>
              
              <div style={{ 
                fontSize: '10px', 
                marginBottom: '15px',
                color: '#3E2B27',
                textAlign: 'center',
                lineHeight: '1.4'
              }}>
                {uploadPopup.success 
                  ? `Successfully added ${uploadPopup.count} song${uploadPopup.count > 1 ? 's' : ''} to your playlist! (◕‿◕)`
                  : "No valid audio files were selected. Please choose MP3 or other audio files!"}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={closeUploadPopup}
                  className="control-btn"
                  style={{ 
                    background: 'linear-gradient(145deg, #7C8B6A, #5A6B4A)',
                    padding: '8px 16px'
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          )}

          {showPlayer && (
            <div className="player-screen">
              <button className="back-btn" onClick={goHome}>←</button>
              
              <div className="cd-container">
                <div 
                  className={`album-cover ${audioState.isPlaying ? 'playing' : ''} ${getCurrentSong().audioId?.startsWith('uploaded-') ? 'uploaded-cover' : ''}`}
                  style={{ 
                    background: getCurrentSong().coverImage 
                      ? `url(${getCurrentSong().coverImage}) center/cover no-repeat, ${getCurrentSong().coverColor || 'linear-gradient(135deg, #8B4513, #CD853F)'}`
                      : getCurrentSong().coverColor || 'linear-gradient(135deg, #8B4513, #CD853F)'
                  }}
                >
                  {!getCurrentSong().coverImage && (getCurrentSong().title?.toUpperCase() || 'SELECT A SONG FROM PLAYLIST')}
                </div>
              </div>

              <div className="song-info">
                <div className="song-title">{getCurrentSong().title || 'Select a song'}</div>
                <div className="song-subtitle">{getCurrentSong().subtitle || 'Choose from playlist'}</div>
              </div>

              <div className="time-display">
                <span>{formatTime(audioState.currentTime)}</span>
                <span>{formatTime(audioState.duration)}</span>
              </div>

              <div 
                className="progress-container" 
                onMouseDown={handleProgressMouseDown}
                style={{ cursor: isDraggingProgress ? 'grabbing' : 'pointer' }}
              >
                <div 
                  className="progress-bar" 
                  style={{ width: audioState.duration ? `${(audioState.currentTime / audioState.duration) * 100}%` : '0%' }}
                ></div>
              </div>

              <div className="player-controls">
                <button className="nav-btn" onClick={() => globalAudioManager.previousSong()}>‹</button>
                <button className="play-pause-btn" onClick={() => globalAudioManager.togglePlayPause()}>
                  {audioState.isPlaying ? '⏸' : '▶'}
                </button>
                <button className="nav-btn" onClick={() => globalAudioManager.nextSong()}>›</button>
              </div>

              <div className="extra-controls">
                <button 
                  className={`extra-btn ${audioState.isRepeating ? 'active' : ''}`} 
                  onClick={toggleRepeat} 
                  title="Repeat"
                >
                  🔁
                </button>
                <button 
                  className={`extra-btn ${favorites.has(audioState.currentSongIndex) ? 'active' : ''}`} 
                  onClick={toggleFavorite} 
                  title="Favorite"
                >
                  ♥
                </button>
              </div>

              <div className="volume-controls">
                <span className="volume-label">VOL</span>
                <div 
                  className="volume-slider" 
                  onMouseDown={handleVolumeMouseDown}
                  style={{ cursor: isDraggingVolume ? 'grabbing' : 'pointer' }}
                >
                  <div 
                    className="volume-fill" 
                    style={{ width: `${audioState.volume * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RetroAutumnMusicPlayer;