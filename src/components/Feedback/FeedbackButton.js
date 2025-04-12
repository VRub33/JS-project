import React from 'react';
import './FeedbackButton.css';

const FeedbackButton = ({ onClick, isVisible }) => {
  return (
    <button 
      className={`feedback-button ${isVisible ? '' : 'hidden'}`} 
      onClick={onClick}
    >
      Отзывы
    </button>
  );
};

export default FeedbackButton; 