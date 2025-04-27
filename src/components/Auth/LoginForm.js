import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { login } from '../../store/authSlice';
import './AuthForms.css';

const LoginForm = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = useCallback((data) => {
    dispatch(login({
      email: data.email,
      name: 'Пользователь'
    }));
  }, [dispatch]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
      <h2>Вход</h2>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          {...register('email', {
            required: 'Email обязателен',
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
        <label htmlFor="password">Пароль:</label>
        <input
          id="password"
          type="password"
          {...register('password', {
            required: 'Пароль обязателен',
            minLength: {
              value: 6,
              message: 'Пароль должен содержать минимум 6 символов'
            }
          })}
          className={errors.password ? 'error' : ''}
        />
        {errors.password && (
          <span className="error-message">{errors.password.message}</span>
        )}
      </div>
      <button type="submit" className="submit-button">
        Войти
      </button>
    </form>
  );
};

export default LoginForm; 