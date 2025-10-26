/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';

const AnswerWindow = ({ 
  questionId, 
  questionText, 
  initialAnswerIndex = 0,
  totalAnswers = 12,
  generateAnswers,
  completedAnswers,
  likedAnswers,
  markAnswerAsRead,
  toggleLike,
  isLiked,
  isMuted,
  volume,
  onTitleChange
}) => {
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(initialAnswerIndex);
  const [isCurrentLiked, setIsCurrentLiked] = useState(false);
  const clickSoundRef = useRef(null);

  // Get actual answers and their count
  const answers = generateAnswers(questionId);
  const actualTotalAnswers = answers.length;

  // Custom short titles for each question
  const getQuestionTitle = (qId) => {
    const titleMap = {
      1: "First Meet",
      2: "Her Personality",
      3: "First Impression",
      4: "Changed View",
      5: "Color Match",
      6: "Song Vibe",
      7: "Reading Emotions",
      8: "Know Her",
      9: "Room Improve",
      10: "Face Talk",
      11: "Down Times",
      12: "Happy Moments",
      13: "Future Meet",
      14: "Good Friend",
      15: "Helped Out",
      16: "Birthday Wish"
    };
    return titleMap[qId] || "Question " + qId;
  };

  useEffect(() => {
    clickSoundRef.current = new Audio('./achievements/audios/click.mp3');
  }, []);

  useEffect(() => {
    if (onTitleChange) {
      const shortTitle = getQuestionTitle(questionId);
      onTitleChange(`📖 ${shortTitle} - Answer ${currentAnswerIndex + 1}/${actualTotalAnswers}`);
    }
  }, [currentAnswerIndex, questionId, actualTotalAnswers, onTitleChange]);

  useEffect(() => {
    setIsCurrentLiked(isLiked(questionId, currentAnswerIndex));
  }, [currentAnswerIndex, questionId, isLiked, likedAnswers]);

  const playClick = () => {
    if (clickSoundRef.current && !isMuted) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.volume = volume;
      clickSoundRef.current.play().catch(e => console.log('Click sound error:', e));
    }
  };

  const nextAnswer = () => {
    playClick();
    // Loop back to first answer if at the end
    if (currentAnswerIndex >= actualTotalAnswers - 1) {
      setCurrentAnswerIndex(0);
      markAnswerAsRead(questionId, 0);
    } else {
      const newIndex = currentAnswerIndex + 1;
      setCurrentAnswerIndex(newIndex);
      markAnswerAsRead(questionId, newIndex);
    }
  };

  const prevAnswer = () => {
    playClick();
    // Loop to last answer if at the beginning
    if (currentAnswerIndex === 0) {
      setCurrentAnswerIndex(actualTotalAnswers - 1);
      markAnswerAsRead(questionId, actualTotalAnswers - 1);
    } else {
      const newIndex = currentAnswerIndex - 1;
      setCurrentAnswerIndex(newIndex);
      markAnswerAsRead(questionId, newIndex);
    }
  };

  const handleToggleLike = () => {
    playClick();
    toggleLike(questionId, currentAnswerIndex);
    setIsCurrentLiked(!isCurrentLiked);
  };

  useEffect(() => {
    if (questionId && currentAnswerIndex >= 0) {
      markAnswerAsRead(questionId, currentAnswerIndex);
    }
  }, [questionId, currentAnswerIndex]);

  // Safety check - make sure we have a valid answer
  const currentAnswer = answers[currentAnswerIndex];

  if (!currentAnswer) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F4E4C1',
        fontFamily: 'monospace',
        color: '#2C1810'
      }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>⚠️</div>
          <div>No answer available at this index</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(145deg, #8B7355, #6B5845)',
      fontFamily: 'monospace',
      overflow: 'hidden',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    }}>
      <div style={{
        flex: 1,
        overflow: 'auto',
        background: '#F4E4C1',
        padding: '20px',
        margin: '0',
        borderRadius: '0',
        boxShadow: 'none',
        boxSizing: 'border-box'
      }}>
        <div style={{
          color: '#2C1810',
          lineHeight: '22px',
          fontSize: '11px',
          fontFamily: 'Courier New, monospace'
        }}>
          <div style={{
            fontSize: '13px',
            fontWeight: 'bold',
            marginBottom: '11px',
            color: '#4A3728'
          }}>
            From: {currentAnswer.friend}
          </div>
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {currentAnswer.content}
          </div>
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(180deg, #6B5845 0%, #5C4A3A 100%)',
        padding: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '2px solid #4A3828',
        flexShrink: 0,
        margin: 0,
        boxSizing: 'border-box'
      }}>
        <button
          onClick={prevAnswer}
          style={{
            padding: '6px 12px',
            background: 'linear-gradient(145deg, #8B6914, #6B5214)',
            border: '2px solid',
            borderColor: '#D4AF37 #5C4A1A #5C4A1A #D4AF37',
            color: '#F4E4C1',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '11px',
            borderRadius: '4px',
            transition: 'all 0.2s ease',
            transform: 'scale(1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '2px 2px 4px rgba(0,0,0,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          ← Prev
        </button>

        <button
          onClick={handleToggleLike}
          style={{
            padding: '6px 12px',
            background: isCurrentLiked
              ? 'linear-gradient(145deg, #DC143C, #A52A2A)'
              : 'linear-gradient(145deg, #8B4513, #6B3410)',
            border: '2px solid',
            borderColor: isCurrentLiked
              ? '#FF6B6B #8B0000 #8B0000 #FF6B6B'
              : '#D2691E #4A2410 #4A2410 #D2691E',
            color: '#F4E4C1',
            cursor: 'pointer',
            fontSize: '14px',
            borderRadius: '4px',
            boxShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            transition: 'all 0.2s ease',
            transform: 'scale(1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.15)';
            e.currentTarget.style.boxShadow = '3px 3px 6px rgba(0,0,0,0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '1px 1px 2px rgba(0,0,0,0.3)';
          }}
        >
          {isCurrentLiked ? '❤' : '♡'}
        </button>

        <button
          onClick={nextAnswer}
          style={{
            padding: '6px 12px',
            background: 'linear-gradient(145deg, #8B6914, #6B5214)',
            border: '2px solid',
            borderColor: '#D4AF37 #5C4A1A #5C4A1A #D4AF37',
            color: '#F4E4C1',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '11px',
            borderRadius: '4px',
            transition: 'all 0.2s ease',
            transform: 'scale(1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '2px 2px 4px rgba(0,0,0,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default AnswerWindow;