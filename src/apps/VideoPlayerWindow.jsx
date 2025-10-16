import React, { useState, useEffect, useRef } from 'react';

const VideoPlayerWindow = ({ isMuted, volume }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const videoRef = useRef(null);
  const clickSoundRef = useRef(null);

  useEffect(() => {
    clickSoundRef.current = new Audio('./achievements/audios/click.mp3');
  }, []);

  const playClick = () => {
    if (clickSoundRef.current && !isMuted) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.volume = volume;
      clickSoundRef.current.play().catch(e => console.log('Click sound error:', e));
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume;
    }
  }, [isMuted, volume]);

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setVideoProgress(videoRef.current.currentTime);
      setVideoDuration(videoRef.current.duration);
    }
  };

  const handleVideoSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setVideoProgress(seekTime);
    }
  };

  const toggleVideoPlay = () => {
    playClick();
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const nextVideo = () => {
    playClick();
    if (currentVideoIndex < 4) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      setIsVideoPlaying(false);
      setVideoProgress(0);
    }
  };

  const prevVideo = () => {
    playClick();
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
      setIsVideoPlaying(false);
      setVideoProgress(0);
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(145deg, #1a1a1a, #2d2d2d)',
      fontFamily: 'monospace',
      overflow: 'hidden',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    }}>
      <div style={{
        position: 'relative',
        background: '#000',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        margin: 0,
        padding: 0
      }}>
        <video
          ref={videoRef}
          src={`./achievements/videos/secret${currentVideoIndex + 1}.mp4`}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            objectFit: 'contain',
            margin: 0,
            padding: 0
          }}
          onTimeUpdate={handleVideoTimeUpdate}
          onLoadedMetadata={(e) => {
            setVideoDuration(e.target.duration);
          }}
          onPlay={() => setIsVideoPlaying(true)}
          onPause={() => setIsVideoPlaying(false)}
          onEnded={() => setIsVideoPlaying(false)}
        />
        
        {/* Video Controls Overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          margin: 0,
          boxSizing: 'border-box'
        }}>
          {/* Progress Bar */}
          <input
            type="range"
            min="0"
            max={videoDuration || 0}
            value={videoProgress}
            onChange={handleVideoSeek}
            style={{
              width: '100%',
              height: '4px',
              background: 'linear-gradient(90deg, #D4AF37 0%, #D4AF37 ' + ((videoProgress / videoDuration) * 100 || 0) + '%, #666 ' + ((videoProgress / videoDuration) * 100 || 0) + '%, #666 100%)',
              borderRadius: '2px',
              outline: 'none',
              cursor: 'pointer',
              margin: 0,
              padding: 0
            }}
          />
          
          {/* Control Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#FFF',
            margin: 0,
            padding: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
  onClick={toggleVideoPlay}
  style={{
    background: 'rgba(212, 175, 55, 0.8)',
    border: 'none',
    color: '#000',
    padding: '4px 8px',
    cursor: 'pointer',
    borderRadius: '3px',
    fontSize: '12px',
    fontWeight: 'bold',
    transition: 'all 0.2s ease',
    transform: 'scale(1)'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'scale(1.1)';
    e.currentTarget.style.background = 'rgba(212, 175, 55, 1)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.background = 'rgba(212, 175, 55, 0.8)';
  }}
>
  {isVideoPlaying ? '❚❚' : '▶'}
</button>
              
              <span style={{ fontSize: '11px' }}>
                {formatTime(videoProgress)} / {formatTime(videoDuration)}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Prev button */}
<button
  onClick={prevVideo}
  disabled={currentVideoIndex === 0}
  style={{
    background: currentVideoIndex === 0 ? '#666' : 'rgba(212, 175, 55, 0.8)',
    border: 'none',
    color: currentVideoIndex === 0 ? '#999' : '#000',
    padding: '4px 8px',
    cursor: currentVideoIndex === 0 ? 'not-allowed' : 'pointer',
    borderRadius: '3px',
    fontSize: '12px',
    fontWeight: 'bold',
    transition: 'all 0.2s ease',
    transform: 'scale(1)'
  }}
  onMouseEnter={(e) => {
    if (currentVideoIndex !== 0) {
      e.currentTarget.style.transform = 'scale(1.1)';
      e.currentTarget.style.background = 'rgba(212, 175, 55, 1)';
    }
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'scale(1)';
    if (currentVideoIndex !== 0) {
      e.currentTarget.style.background = 'rgba(212, 175, 55, 0.8)';
    }
  }}
>
  ◀ Prev
</button>
              
              <span style={{ fontSize: '11px', color: '#D4AF37' }}>
                {currentVideoIndex + 1}/5
              </span>
              
              {/* Next button */}
<button
  onClick={nextVideo}
  disabled={currentVideoIndex === 4}
  style={{
    background: currentVideoIndex === 4 ? '#666' : 'rgba(212, 175, 55, 0.8)',
    border: 'none',
    color: currentVideoIndex === 4 ? '#999' : '#000',
    padding: '4px 8px',
    cursor: currentVideoIndex === 4 ? 'not-allowed' : 'pointer',
    borderRadius: '3px',
    fontSize: '12px',
    fontWeight: 'bold',
    transition: 'all 0.2s ease',
    transform: 'scale(1)'
  }}
  onMouseEnter={(e) => {
    if (currentVideoIndex !== 4) {
      e.currentTarget.style.transform = 'scale(1.1)';
      e.currentTarget.style.background = 'rgba(212, 175, 55, 1)';
    }
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'scale(1)';
    if (currentVideoIndex !== 4) {
      e.currentTarget.style.background = 'rgba(212, 175, 55, 0.8)';
    }
  }}
>
  Next ▶
</button>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(180deg, #2d2d2d 0%, #1a1a1a 100%)',
        padding: '12px 16px',
        borderTop: '1px solid #444',
        textAlign: 'center',
        flexShrink: 0,
        margin: 0,
        boxSizing: 'border-box'
      }}>
        <p style={{ 
          color: '#D4AF37', 
          fontSize: '11px',
          margin: 0,
          padding: 0,
          textShadow: '0 0 5px rgba(212, 175, 55, 0.3)'
        }}>
          🎉 Congratulations on completing all achievements! Enjoy these special videos.
        </p>
      </div>
    </div>
  );
};

export default VideoPlayerWindow;