import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { login } from '../../store/authSlice';
import './AuthForms.css';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const password = watch('password');

  const onSubmit = useCallback((data) => {
    dispatch(login({
      email: data.email,
      name: data.name
    }));
  }, [dispatch]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
      <h2>Регистрация</h2>
      <div className="form-group">
        <label htmlFor="name">Имя:</label>
        <input
          id="name"
          type="text"
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
      <div className="form-group">
        <label htmlFor="confirmPassword">Подтверждение пароля:</label>
        <input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword', {
            required: 'Подтверждение пароля обязательно',
            validate: value => value === password || 'Пароли не совпадают'
          })}
          className={errors.confirmPassword ? 'error' : ''}
        />
        {errors.confirmPassword && (
          <span className="error-message">{errors.confirmPassword.message}</span>
        )}
      </div>
      <button type="submit" className="submit-button">
        Зарегистрироваться
      </button>
    </form>
  );
};

export default RegisterForm; 