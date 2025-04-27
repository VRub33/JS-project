import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import './Feedback.css';

const Feedback = ({ isVisible, onClose }) => {
  const [reviews, setReviews] = useState([]);
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      message: ''
    }
  });

  useEffect(() => {
    const savedReviews = localStorage.getItem('reviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('reviews', JSON.stringify(reviews));
  }, [reviews]);

  const onSubmit = useCallback((data) => {
    const newReview = {
      id: Date.now(),
      ...data,
      date: new Date().toLocaleDateString()
    };
    setReviews(prev => [newReview, ...prev]);
    reset();
  }, [reset]);

  return (
    <div className={`feedback-container ${isVisible ? 'show' : ''}`}>
      <div className="feedback-content">
        <div className="feedback-header">
          <h2>Обратная связь</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="feedback-form">
          <div className="form-group">
            <label htmlFor="name">Имя:</label>
            <input
              id="name"
              {...register('name', { 
                required: 'Имя обязательно',
                minLength: {
                  value: 2,
                  message: 'Имя должно содержать минимум 2 символа'
                }
              })}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && (
              <span className="error-message">{errors.name.message}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              {...register('email', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Введите корректный email'
                }
              })}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="message">Сообщение:</label>
            <textarea/>
            {errors.message && (
              <span className="error-message">{errors.message.message}</span>
            )}
          </div>
          <button type="submit" className="submit-button">
            Отправить отзыв
          </button>
        </form>

        <div className="reviews-section">
          <h3>Отзывы</h3>
          <div className="reviews-list">
            {reviews.map(review => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <span className="review-name">{review.name}</span>
                  <span className="review-date">{review.date}</span>
                </div>
                {review.email && <div className="review-email">{review.email}</div>}
                <div className="review-message">{review.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback; 