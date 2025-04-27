import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../store/authSlice';
import { useRegisterUserMutation } from '../../store/api';
import { Form, Button, Alert, Spinner, Card } from 'react-bootstrap';
import './AuthForms.scss';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const [registerUser, { isLoading, isError, error: registerError }] = useRegisterUserMutation();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      const userData = await registerUser(data).unwrap(); 
      dispatch(setUser(userData.user));
    } catch (err) {
      console.error('Ошибка регистрации:', err);
    }
  };

  return (
    <Card className="auth-card">
      <Card.Body>
        <h2 className="text-center mb-4">Регистрация</h2>
        
        {isError && <Alert variant="danger">{registerError?.data?.message}</Alert>}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Имя</Form.Label>
            <Form.Control
              type="text"
              isInvalid={!!errors.name}
              {...register('name', {
                required: 'Имя обязательно',
                minLength: {
                  value: 2,
                  message: 'Имя должно содержать минимум 2 символа'
                }
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              isInvalid={!!errors.email}
              {...register('email', {
                required: 'Email обязателен',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Введите корректный email'
                }
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              isInvalid={!!errors.password}
              {...register('password', {
                required: 'Пароль обязателен',
                minLength: {
                  value: 6,
                  message: 'Пароль должен содержать минимум 6 символов'
                }
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4" controlId="confirmPassword">
            <Form.Label>Подтверждение пароля</Form.Label>
            <Form.Control
              type="password"
              isInvalid={!!errors.confirmPassword}
              {...register('confirmPassword', {
                required: 'Подтверждение пароля обязательно',
                validate: value => value === password || 'Пароли не совпадают'
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.confirmPassword?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-grid">
            <Button 
              variant="primary" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span className="ms-2">Регистрация...</span>
                </>
              ) : 'Зарегистрироваться'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default RegisterForm;