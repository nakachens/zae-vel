/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { questionsData, friends } from './data';

const AchievementsApp = ({ onOpenExternalWindow }) => {
  const [completedAnswers, setCompletedAnswers] = useState({});
  const [likedAnswers, setLikedAnswers] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null);
  
  const bgMusicRef = useRef(null);
  const clickSoundRef = useRef(null);

  const questions = questionsData;

  const generateAnswers = (questionId) => {
    const question = questionsData.find(q => q.id === questionId);
    return question ? question.answers.map((answer, index) => ({
      id: `q${questionId}-a${index}`,
      questionId,
      friend: answer.friend,
      content: answer.content
    })) : [];
  };

  const playClick = () => {
    if (clickSoundRef.current && !isMuted) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.volume = volume;
      clickSoundRef.current.play().catch(e => console.log('Click sound error:', e));
    }
  };

  useEffect(() => {
    bgMusicRef.current = new Audio('./achievements/audios/bgmusic.mp3');
    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = volume * 0.3;
    
    clickSoundRef.current = new Audio('./achievements/audios/click.mp3');
    
    if (!isMuted) {
      bgMusicRef.current.play().catch(e => console.log('BG music error:', e));
    }

    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = isMuted ? 0 : volume * 0.3;
    }
  }, [isMuted, volume]);

  const getProgress = (questionId) => {
    const answers = completedAnswers[questionId] || [];
    return Math.round((answers.length / 12) * 100);
  };

  const getTotalProgress = () => {
    const total = questions.reduce((sum, q) => sum + getProgress(q.id), 0);
    return Math.round(total / questions.length);
  };

  const markAnswerAsRead = (questionId, answerIndex) => {
    setCompletedAnswers(prev => {
      const questionAnswers = prev[questionId] || [];
      if (!questionAnswers.includes(answerIndex)) {
        return {
          ...prev,
          [questionId]: [...questionAnswers, answerIndex]
        };
      }
      return prev;
    });
  };

  const toggleLike = (questionId, answerIndex) => {
    playClick();
    const answer = generateAnswers(questionId)[answerIndex];
    const likeId = `q${questionId}-a${answerIndex}`;
    
    setLikedAnswers(prev => {
      const exists = prev.find(a => a.id === likeId);
      if (exists) {
        return prev.filter(a => a.id !== likeId);
      } else {
        return [...prev, {
          id: likeId,
          questionId,
          answerIndex,
          questionText: questions.find(q => q.id === questionId)?.text || `Question ${questionId}`,
          friend: answer.friend,
          content: answer.content
        }];
      }
    });
  };

  const isLiked = (questionId, answerIndex) => {
    const likeId = `q${questionId}-a${answerIndex}`;
    return likedAnswers.some(a => a.id === likeId);
  };

  const openQuestion = (question) => {
    playClick();
    
    if (onOpenExternalWindow) {
      onOpenExternalWindow({
        type: 'answer',
        questionId: question.id,
        questionText: question.text,
        currentAnswerIndex: 0,
        generateAnswers,
        completedAnswers,
        likedAnswers,
        markAnswerAsRead,
        toggleLike,
        isLiked,
        isMuted,
        volume
      });
    }
  };

  const openLikedAnswer = (likedAnswer) => {
    playClick();
    
    if (onOpenExternalWindow) {
      const question = questions.find(q => q.id === likedAnswer.questionId);
      onOpenExternalWindow({
        type: 'answer',
        questionId: likedAnswer.questionId,
        questionText: likedAnswer.questionText,
        currentAnswerIndex: likedAnswer.answerIndex,
        generateAnswers,
        completedAnswers,
        likedAnswers,
        markAnswerAsRead,
        toggleLike,
        isLiked,
        isMuted,
        volume
      });
    }
  };

  const toggleFavorites = () => {
    playClick();
    setShowFavorites(!showFavorites);
  };

  const toggleSettings = () => {
    playClick();
    setShowSettings(!showSettings);
  };

  const openSecretVideos = () => {
    playClick();
    
    if (onOpenExternalWindow) {
      onOpenExternalWindow({
        type: 'video',
        isMuted,
        volume
      });
    }
  };

  const nextCards = () => {
    playClick();
    const nextIndex = (currentCardIndex + 3) % questions.length;
    setCurrentCardIndex(nextIndex);
  };

  const prevCards = () => {
    playClick();
    const prevIndex = (currentCardIndex - 3 + questions.length) % questions.length;
    setCurrentCardIndex(prevIndex);
  };

  const toggleMute = () => {
    playClick();
    setIsMuted(!isMuted);
  };

  const visibleQuestions = [];
  for (let i = 0; i < 3; i++) {
    const index = (currentCardIndex + i) % questions.length;
    visibleQuestions.push(questions[index]);
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #6B4423 0%, #3E2723 50%, #2C1810 100%)',
      fontFamily: 'monospace',
      overflow: 'auto',
      position: 'relative',
      pointerEvents: 'auto'
    }}>
      {/* Header */}
      <div style={{
        padding: '6px 10px',
        borderBottom: '2px solid #8B6914',
        background: 'linear-gradient(180deg, #4A3728 0%, #3E2723 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pointerEvents: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '14px' }}>🏆</span>
          <div>
            <h1 style={{ margin: 0, color: '#F4E4C1', fontSize: '11px', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
              Achievements
            </h1>
            <p style={{ margin: '2px 0 0 0', color: '#C9A961', fontSize: '8px' }}>
              Completed: {getTotalProgress()}%
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {getTotalProgress() === 100 && (
            <button
              onClick={openSecretVideos}
              style={{
                padding: '3px 6px',
                background: 'linear-gradient(145deg, #8B6914, #6B5214)',
                border: '2px solid',
                borderColor: '#D4AF37 #5C4A1A #5C4A1A #D4AF37',
                color: '#F4E4C1',
                cursor: 'pointer',
                fontSize: '10px',
                borderRadius: '3px',
                boxShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                transition: 'all 0.2s ease',
                transform: 'scale(1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '2px 2px 4px rgba(0,0,0,0.5)';
                e.currentTarget.style.background = 'linear-gradient(145deg, #A67B16, #7D5F16)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '1px 1px 2px rgba(0,0,0,0.3)';
                e.currentTarget.style.background = 'linear-gradient(145deg, #8B6914, #6B5214)';
              }}
            >
              🎬
            </button>
          )}
          <button
            onClick={toggleFavorites}
            style={{
              padding: '3px 6px',
              background: 'linear-gradient(145deg, #8B4513, #6B3410)',
              border: '2px solid',
              borderColor: '#D2691E #4A2410 #4A2410 #D2691E',
              color: '#F4E4C1',
              cursor: 'pointer',
              fontSize: '10px',
              borderRadius: '3px',
              boxShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              transition: 'all 0.2s ease',
              transform: 'scale(1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '2px 2px 4px rgba(0,0,0,0.5)';
              e.currentTarget.style.background = 'linear-gradient(145deg, #A65417, #7D3F12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '1px 1px 2px rgba(0,0,0,0.3)';
              e.currentTarget.style.background = 'linear-gradient(145deg, #8B4513, #6B3410)';
            }}
          >
            ❤
          </button>
          <button
            onClick={toggleSettings}
            style={{
              padding: '3px 6px',
              background: 'linear-gradient(145deg, #5C4A3A, #4A3828)',
              border: '2px solid',
              borderColor: '#8B7355 #3E2723 #3E2723 #8B7355',
              color: '#F4E4C1',
              cursor: 'pointer',
              fontSize: '10px',
              borderRadius: '3px',
              boxShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              transition: 'all 0.2s ease',
              transform: 'scale(1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '2px 2px 4px rgba(0,0,0,0.5)';
              e.currentTarget.style.background = 'linear-gradient(145deg, #6D5B4B, #5B4939)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '1px 1px 2px rgba(0,0,0,0.3)';
              e.currentTarget.style.background = 'linear-gradient(145deg, #5C4A3A, #4A3828)';
            }}
          >
            ⚙
          </button>
        </div>
      </div>

      {/* Swipeable Cards Container */}
      <div style={{
        padding: '15px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100% - 80px)',
        gap: '12px',
        pointerEvents: 'auto'
      }}>
        {/* Left Arrow */}
        <button
          onClick={prevCards}
          style={{
            padding: '8px 6px',
            background: 'linear-gradient(145deg, #8B6914, #6B5214)',
            border: '2px solid',
            borderColor: '#D4AF37 #5C4A1A #5C4A1A #D4AF37',
            color: '#F4E4C1',
            cursor: 'pointer',
            fontSize: '14px',
            borderRadius: '6px',
            boxShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            transition: 'all 0.2s ease',
            transform: 'scale(1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '3px 3px 6px rgba(0,0,0,0.5)';
            e.currentTarget.style.background = 'linear-gradient(145deg, #A67B16, #7D5F16)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '2px 2px 4px rgba(0,0,0,0.3)';
            e.currentTarget.style.background = 'linear-gradient(145deg, #8B6914, #6B5214)';
          }}
        >
          ◀
        </button>

        {/* Cards Display */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          flex: 1,
          maxWidth: '450px'
        }}>
          {visibleQuestions.map((question, index) => {
            const progress = getProgress(question.id);
            const isCenter = index === 1;
            
            const shouldBeEnlarged = hoveredCardIndex !== null ? hoveredCardIndex === index : isCenter;
            const scale = shouldBeEnlarged ? 1.15 : 0.85;
            const opacity = shouldBeEnlarged ? 1 : 0.6;
            
            return (
              <div
                key={question.id}
                onClick={() => shouldBeEnlarged && openQuestion(question)}
                onMouseEnter={() => setHoveredCardIndex(index)}
                onMouseLeave={() => setHoveredCardIndex(null)}
                style={{
                  background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 280'%3E%3Cpath d='M20,10 Q10,10 10,20 L10,240 Q10,250 20,250 L90,250 L100,270 L110,250 L180,250 Q190,250 190,240 L190,20 Q190,10 180,10 Z' fill='%23C19A6B' stroke='%235C4A3A' stroke-width='3'/%3E%3Cpath d='M25,15 Q15,15 15,25 L15,235 Q15,245 25,245 L92,245 L100,262 L108,245 L175,245 Q185,245 185,235 L185,25 Q185,15 175,15 Z' fill='%23E8D5B7' stroke='%238B7355' stroke-width='2'/%3E%3C/svg%3E") center/contain no-repeat`,
                  padding: '28px 18px 22px 18px',
                  cursor: shouldBeEnlarged ? 'pointer' : 'default',
                  transition: 'all 0.3s ease',
                  minHeight: '165px',
                  width: '120px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  position: 'relative',
                  filter: `drop-shadow(2px 2px 4px rgba(0,0,0,0.4))`,
                  transform: `scale(${scale})`,
                  opacity: opacity,
                  pointerEvents: 'auto'
                }}
              >
                <div style={{
                  color: '#3E2723',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  textShadow: '1px 1px 1px rgba(255,255,255,0.5)',
                  lineHeight: '1.4',
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  wordBreak: 'break-word'
                }}>
                  {question.text}
                </div>
                <div style={{
                  width: '100%',
                  background: 'linear-gradient(180deg, #8B7355 0%, #6B5845 100%)',
                  borderRadius: '3px',
                  padding: '2px',
                  marginTop: '8px'
                }}>
                  <div style={{
                    width: '100%',
                    background: '#4A3828',
                    height: '12px',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: `${progress}%`,
                      height: '100%',
                      background: progress === 100 
                        ? 'linear-gradient(90deg, #D4AF37, #FFD700, #D4AF37)'
                        : 'linear-gradient(90deg, #8B6914, #B8860B)',
                      transition: 'width 0.5s ease',
                      boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3)'
                    }} />
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#F4E4C1',
                      fontSize: '8px',
                      fontWeight: 'bold',
                      textShadow: '1px 1px 1px rgba(0,0,0,0.8)'
                    }}>
                      {progress}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={nextCards}
          style={{
            padding: '8px 6px',
            background: 'linear-gradient(145deg, #8B6914, #6B5214)',
            border: '2px solid',
            borderColor: '#D4AF37 #5C4A1A #5C4A1A #D4AF37',
            color: '#F4E4C1',
            cursor: 'pointer',
            fontSize: '14px',
            borderRadius: '6px',
            boxShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            transition: 'all 0.2s ease',
            transform: 'scale(1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '3px 3px 6px rgba(0,0,0,0.5)';
            e.currentTarget.style.background = 'linear-gradient(145deg, #A67B16, #7D5F16)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '2px 2px 4px rgba(0,0,0,0.3)';
            e.currentTarget.style.background = 'linear-gradient(145deg, #8B6914, #6B5214)';
          }}
        >
          ▶
        </button>
      </div>

      {/* Card Counter */}
      <div style={{
        position: 'fixed',
        bottom: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'linear-gradient(145deg, #8B7355, #6B5845)',
        border: '2px solid',
        borderColor: '#D2B48C #3E2723 #3E2723 #D2B48C',
        borderRadius: '16px',
        padding: '4px 10px',
        color: '#F4E4C1',
        fontSize: '9px',
        fontWeight: 'bold',
        boxShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        pointerEvents: 'none'
      }}>
        {Math.floor(currentCardIndex / 3) + 1} / {Math.ceil(questions.length / 3)}
      </div>

      {/* Favorites Window */}
      {showFavorites && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '10px',
          pointerEvents: 'none'
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #8B7355, #6B5845)',
            border: '3px solid',
            borderColor: '#D2B48C #3E2723 #3E2723 #D2B48C',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '450px',
            maxHeight: '70vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '4px 4px 8px rgba(0,0,0,0.5)',
            pointerEvents: 'auto'
          }}>
            <div style={{
              background: 'linear-gradient(180deg, #4A3728 0%, #3E2723 100%)',
              padding: '8px 12px',
              borderBottom: '2px solid #2C1810',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: '5px 5px 0 0'
            }}>
              <span style={{ color: '#F4E4C1', fontWeight: 'bold', fontSize: '12px' }}>
                ❤ Favorite Answers ({likedAnswers.length})
              </span>
              <button
                onClick={toggleFavorites}
                style={{
                  background: '#8B4513',
                  border: '2px solid',
                  borderColor: '#D2691E #4A2410 #4A2410 #D2691E',
                  color: '#F4E4C1',
                  padding: '2px 8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  borderRadius: '3px',
                  fontSize: '12px',
                  transition: 'all 0.2s ease',
                  transform: 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.background = '#A65417';
                  e.currentTarget.style.boxShadow = '2px 2px 4px rgba(0,0,0,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = '#8B4513';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                ✕
              </button>
            </div>

            <div style={{
              flex: 1,
              overflow: 'auto',
              padding: '12px'
            }}>
              {likedAnswers.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  color: '#F4E4C1',
                  padding: '20px',
                  fontSize: '12px'
                }}>
                  No favorite answers yet. Start exploring! 💛
                </div>
              ) : (
                likedAnswers.map(answer => (
                  <div
                    key={answer.id}
                    onClick={() => openLikedAnswer(answer)}
                    style={{
                      background: 'linear-gradient(145deg, #F4E4C1, #E8D5B7)',
                      border: '2px solid',
                      borderColor: '#8B7355 #4A3828 #4A3828 #8B7355',
                      borderRadius: '4px',
                      padding: '10px',
                      marginBottom: '8px',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      boxShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <div style={{
                      color: '#4A3728',
                      fontWeight: 'bold',
                      marginBottom: '4px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '11px'
                    }}>
                      <span>{answer.questionText}</span>
                      <span style={{ color: '#8B4513' }}>❤</span>
                    </div>
                    <div style={{
                      color: '#6B5845',
                      fontSize: '10px',
                      marginBottom: '2px'
                    }}>
                      By: {answer.friend}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings Window */}
      {showSettings && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '10px',
          pointerEvents: 'none'
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #8B7355, #6B5845)',
            border: '3px solid',
            borderColor: '#D2B48C #3E2723 #3E2723 #D2B48C',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '300px',
            boxShadow: '4px 4px 8px rgba(0,0,0,0.5)',
            pointerEvents: 'auto'
          }}>
            <div style={{
              background: 'linear-gradient(180deg, #4A3728 0%, #3E2723 100%)',
              padding: '8px 12px',
              borderBottom: '2px solid #2C1810',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: '5px 5px 0 0'
            }}>
              <span style={{ color: '#F4E4C1', fontWeight: 'bold', fontSize: '12px' }}>
                ⚙ Audio Settings
              </span>
              <button
                onClick={toggleSettings}
                style={{
                  background: '#8B4513',
                  border: '2px solid',
                  borderColor: '#D2691E #4A2410 #4A2410 #D2691E',
                  color: '#F4E4C1',
                  padding: '2px 8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  borderRadius: '3px',
                  fontSize: '12px',
                  transition: 'all 0.2s ease',
                  transform: 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.background = '#A65417';
                  e.currentTarget.style.boxShadow = '2px 2px 4px rgba(0,0,0,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = '#8B4513';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                ✕
              </button>
            </div>

            <div style={{
              padding: '15px',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }}>
              <div>
                <div style={{
                  color: '#F4E4C1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px'
                }}>
                  <span 
                    onClick={toggleMute}
                    style={{ 
                      fontSize: '20px', 
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    {isMuted ? '🔇' : '🔊'}
                  </span>
                  <span>{isMuted ? 'Muted' : 'Sound On'}</span>
                </div>
              </div>

              <div>
                <div style={{
                  color: '#F4E4C1',
                  fontSize: '11px',
                  marginBottom: '8px'
                }}>
                  Volume: {Math.round(volume * 100)}%
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  disabled={isMuted}
                  style={{
                    width: '100%',
                    height: '6px',
                    background: isMuted ? '#5C4A3A' : 'linear-gradient(90deg, #8B6914, #D4AF37)',
                    borderRadius: '3px',
                    outline: 'none',
                    opacity: isMuted ? 0.5 : 1
                  }}
                />
              </div>

              <div style={{
                background: 'linear-gradient(145deg, #4A3728, #3E2723)',
                border: '2px solid #2C1810',
                borderRadius: '4px',
                padding: '8px',
                textAlign: 'center'
              }}>
                <div style={{ color: '#D4AF37', fontSize: '10px', marginBottom: '4px' }}>
                  Progress: {getTotalProgress()}%
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: '#2C1810',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${getTotalProgress()}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #8B6914, #D4AF37)',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsApp;