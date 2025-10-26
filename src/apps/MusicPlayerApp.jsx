/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import './MusicPlayer.css';

// Audio Manager with localStorage support
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
    if (this.initialized) return;
    
    this.initialized = true;
    this.playlist = [...playlist];
    const elements = [];
    
    for (let i = 0; i < playlist.length; i++) {
      const song = playlist[i];
      const audio = new Audio();
      
      const audioPath = song.objectUrl || audioFiles[song.audioId];
      
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
          elements[i] = null;
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
    const firstAvailable = elements.find(el => el !== null);
    if (firstAvailable) {
      const firstIndex = elements.indexOf(firstAvailable);
      this.currentAudioRef = firstAvailable;
      this.currentSongIndex = firstIndex;
    }
  }

  updatePlaylist(newPlaylist) {
    this.playlist = [...newPlaylist];
    this.notify('playlistUpdated', { playlist: this.playlist });
  }

  addAudioElement(audio, songData) {
    this.audioElements.push(audio);
    this.playlist.push(songData);
    
    if (!this.currentAudioRef) {
      const newIndex = this.audioElements.length - 1;
      this.currentAudioRef = audio;
      this.currentSongIndex = newIndex;
      this.notify('songChanged', { 
        currentSongIndex: this.currentSongIndex 
      });
    }
    
    this.notify('playlistUpdated', { playlist: this.playlist });
  }

  removeAudioElement(index) {
    if (index === this.currentSongIndex && this.isPlaying) {
      this.pause();
    }
    
    if (this.audioElements[index]) {
      this.audioElements[index].pause();
      this.audioElements[index].src = '';
    }
    
    this.audioElements.splice(index, 1);
    this.playlist.splice(index, 1);
    
    if (index < this.currentSongIndex) {
      this.currentSongIndex--;
    } else if (index === this.currentSongIndex) {
      if (this.audioElements.length > 0) {
        this.currentSongIndex = Math.min(this.currentSongIndex, this.audioElements.length - 1);
        this.currentAudioRef = this.audioElements[this.currentSongIndex];
      } else {
        this.currentAudioRef = null;
        this.currentSongIndex = 0;
      }
    }
    
    this.notify('playlistUpdated', { playlist: this.playlist });
    this.notify('songChanged', { currentSongIndex: this.currentSongIndex });
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
    let nextIndex = this.currentSongIndex;
    do {
      nextIndex = (nextIndex + 1) % this.audioElements.length;
    } while (!this.audioElements[nextIndex] && nextIndex !== this.currentSongIndex);
    
    if (this.audioElements[nextIndex]) {
      const wasPlaying = this.isPlaying;
      this.selectSong(nextIndex);
      if (wasPlaying) {
        setTimeout(() => this.play(), 100);
      }
    }
  }

  previousSong() {
    let prevIndex = this.currentSongIndex;
    do {
      prevIndex = prevIndex > 0 ? prevIndex - 1 : this.audioElements.length - 1;
    } while (!this.audioElements[prevIndex] && prevIndex !== this.currentSongIndex);
    
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

  const [playlist, setPlaylist] = useState(() => {
    const savedPlaylist = localStorage.getItem('musicPlayerPlaylist');
    const savedUploaded = localStorage.getItem('musicPlayerUploadedSongs');
    
    if (savedPlaylist) {
      const parsed = JSON.parse(savedPlaylist);
      if (savedUploaded) {
        const uploadedData = JSON.parse(savedUploaded);
        return parsed.map(song => {
          if (song.audioId && song.audioId.startsWith('uploaded-')) {
            const uploadedInfo = uploadedData[song.audioId];
            if (uploadedInfo) {
              return { ...song, objectUrl: uploadedInfo.objectUrl };
            }
          }
          return song;
        });
      }
      return parsed;
    }
    return initialPlaylist;
  });

  const [archivedSongs, setArchivedSongs] = useState(() => {
    const saved = localStorage.getItem('musicPlayerArchived');
    return saved ? JSON.parse(saved) : [];
  });

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
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, songIndex: null });
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);

  const fileInputRef = useRef(null);
  const clickSoundRef = useRef(null);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    if (playlist.length > 0) {
      const playlistToSave = playlist.map(song => {
        const { objectUrl, ...rest } = song;
        return rest;
      });
      localStorage.setItem('musicPlayerPlaylist', JSON.stringify(playlistToSave));
      
      const uploadedSongs = {};
      playlist.forEach(song => {
        if (song.audioId && song.audioId.startsWith('uploaded-') && song.objectUrl) {
          uploadedSongs[song.audioId] = {
            objectUrl: song.objectUrl,
            fileName: song.title
          };
        }
      });
      if (Object.keys(uploadedSongs).length > 0) {
        localStorage.setItem('musicPlayerUploadedSongs', JSON.stringify(uploadedSongs));
      }
    }
  }, [playlist]);

  useEffect(() => {
    localStorage.setItem('musicPlayerArchived', JSON.stringify(archivedSongs));
  }, [archivedSongs]);

  useEffect(() => {
    clickSoundRef.current = new Audio('/click.mp3');
    clickSoundRef.current.volume = 0.3;
  }, []);

  useEffect(() => {
    const initializeAudio = async () => {
      setShowLoading(true);
      await globalAudioManager.initialize(playlist, audioFiles);
      setAudioState(globalAudioManager.getState());
      setShowLoading(false);
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
    setShowLibrary(false);
    setDeleteConfirm({ show: false, songIndex: null });
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
      alert('No audio files available to play. Please check your file paths.');
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
      alert('Audio file not found. Please check the file path.');
      return;
    }
    
    showPlayerScreen();
    closePlaylistPopup();
  };

  const showDeleteConfirm = (e, index) => {
    e.stopPropagation();
    playClickSound();
    setDeleteConfirm({ show: true, songIndex: index });
  };

  const cancelDelete = () => {
    playClickSound();
    setDeleteConfirm({ show: false, songIndex: null });
  };

  const confirmRemoveSong = () => {
    playClickSound();
    const index = deleteConfirm.songIndex;
    const song = playlist[index];
    
    if (song.isInApp) {
      setArchivedSongs(prev => [...prev, song]);
    }
    
    const newPlaylist = playlist.filter((_, i) => i !== index);
    setPlaylist(newPlaylist);
    globalAudioManager.removeAudioElement(index);
    globalAudioManager.updatePlaylist(newPlaylist);
    
    setDeleteConfirm({ show: false, songIndex: null });
  };

  const addSongBackToPlaylist = (song) => {
    playClickSound();
    
    setArchivedSongs(prev => prev.filter(s => s.audioId !== song.audioId));
    
    const newPlaylist = [...playlist, song];
    setPlaylist(newPlaylist);
    
    const audio = new Audio();
    const audioPath = audioFiles[song.audioId];
    
    if (audioPath) {
      audio.src = audioPath;
      audio.preload = 'metadata';
      audio.volume = globalAudioManager.volume;
      audio.loop = globalAudioManager.isRepeating;
      
      audio.addEventListener('loadedmetadata', () => {
        console.log(`Loaded: ${song.title}`);
      });
      
      audio.addEventListener('error', (e) => {
        console.log(`Failed to load: ${song.title}`, e);
      });
      
      audio.addEventListener('ended', () => {
        if (globalAudioManager.isRepeating) {
          audio.currentTime = 0;
          audio.play();
        } else {
          globalAudioManager.nextSong();
        }
      });
      
      audio.addEventListener('timeupdate', () => {
        globalAudioManager.currentTime = audio.currentTime;
        globalAudioManager.duration = audio.duration || 0;
        globalAudioManager.notify('timeUpdate', {
          currentTime: globalAudioManager.currentTime,
          duration: globalAudioManager.duration
        });
      });
      
      globalAudioManager.addAudioElement(audio, song);
      globalAudioManager.updatePlaylist(newPlaylist);
    }
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

  const addAudioFiles = (files) => {
    playClickSound();
    const newSongs = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('audio/')) continue;
      
      const objectUrl = URL.createObjectURL(file);
      const song = {
        title: file.name.replace(/\.[^/.]+$/, ""),
        subtitle: 'Uploaded song',
        audioId: `uploaded-${Date.now()}-${i}`,
        artist: 'Unknown',
        coverImage: null,
        coverColor: 'linear-gradient(135deg, #8B4513, #CD853F)',
        file: file,
        objectUrl: objectUrl,
        isInApp: false
      };
      newSongs.push(song);
      
      const audio = new Audio();
      audio.src = objectUrl;
      audio.preload = 'metadata';
      audio.volume = globalAudioManager.volume;
      audio.loop = globalAudioManager.isRepeating;
      
      audio.addEventListener('loadedmetadata', () => {
        console.log(`Loaded uploaded: ${song.title}`);
      });
      
      audio.addEventListener('error', (e) => {
        console.log(`Failed to load uploaded: ${song.title}`, e);
      });
      
      audio.addEventListener('ended', () => {
        if (globalAudioManager.isRepeating) {
          audio.currentTime = 0;
          audio.play();
        } else {
          globalAudioManager.nextSong();
        }
      });
      
      audio.addEventListener('timeupdate', () => {
        globalAudioManager.currentTime = audio.currentTime;
        globalAudioManager.duration = audio.duration || 0;
        globalAudioManager.notify('timeUpdate', {
          currentTime: globalAudioManager.currentTime,
          duration: globalAudioManager.duration
        });
      });
      
      globalAudioManager.addAudioElement(audio, song);
    }
    
    if (newSongs.length > 0) {
      const newPlaylist = [...playlist, ...newSongs];
      setPlaylist(newPlaylist);
      globalAudioManager.updatePlaylist(newPlaylist);
      
      alert(`Added ${newSongs.length} song(s) to playlist!`);
    } else {
      alert('No valid audio files were selected.');
    }
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
                <button className="control-btn library-btn" onClick={openLibrary}>
                  ★ LIBRARY
                </button>
              </div>

              <div className="song-list">
                {playlist.map((song, index) => {
                  const isFavorite = favorites.has(index);
                  const isAvailable = globalAudioManager.audioElements[index] !== null;
                  const isCurrentlyPlaying = index === audioState.currentSongIndex;
                  
                  return (
                    <div 
                      key={index}
                      className={`song-item ${isCurrentlyPlaying ? 'playing' : ''}`}
                      onClick={() => isAvailable && selectSong(index)}
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
                          <button 
                            className="delete-btn-circle"
                            onClick={(e) => showDeleteConfirm(e, index)}
                            title="Remove song"
                          >
                            <svg viewBox="0 0 24 24" width="16" height="16">
                              <path 
                                fill="currentColor" 
                                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                              />
                            </svg>
                          </button>
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
                ★
                <div className="close-btn" onClick={closePlaylistPopup}>×</div>
              </div>
              
              <div className="playlist-controls">
                <button className="control-btn" onClick={openPlaylist}>
                  ← BACK TO PLAYLIST
                </button>
              </div>

              <div className="song-list">
                {archivedSongs.length === 0 ? (
                  <div className="empty-library">
                    <div style={{ fontSize: '14px', textAlign: 'center', padding: '20px', color: '#1E1A19' }}>
                      no archived songs ^0^
                    </div>
                  </div>
                ) : (
                  archivedSongs.map((song, index) => (
                    <div 
                      key={index}
                      className="song-item archived-song"
                      onClick={() => addSongBackToPlaylist(song)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div>{song.title}</div>
                          <div style={{ fontSize: '10px', opacity: 0.8 }}>
                            {song.subtitle}
                          </div>
                        </div>
                        <div style={{ fontSize: '10px', color: '#7C8B6A' }}>Click to restore</div>
                      </div>
                    </div>
                  ))
                )}
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

          {deleteConfirm.show && (
            <div className="delete-confirm-overlay" onClick={cancelDelete}>
              <div className="delete-confirm-popup" onClick={(e) => e.stopPropagation()}>
                <div className="delete-confirm-header">
                  Remove this song from playlist?
                </div>
                <div className="delete-confirm-message">
                  {playlist[deleteConfirm.songIndex]?.isInApp 
                    ? "removing in-app songs will move them to library" 
                    : "your uploaded songs are deleted fr fr, upload them again if u want it back!"}
                </div>
                <div className="delete-confirm-buttons">
                  <button className="confirm-btn-yes" onClick={confirmRemoveSong}>
                    YES, REMOVE
                  </button>
                  <button className="confirm-btn-no" onClick={cancelDelete}>
                    CANCEL
                  </button>
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