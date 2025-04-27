import React, { useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { setUser } from '../../store/authSlice';
import { useLoginUserMutation } from '../../store/api';
import { Form, Button, Alert, Spinner, Card } from 'react-bootstrap';
import './AuthForms.scss';

const LoginForm = () => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const [loginUser, { isError, isLoading, isSuccess }] = useLoginUserMutation();

  const [showSuccess, setShowSuccess] = useState(false);

  const onSubmit = async (data) => {
    try {
      const userData = await loginUser(data).unwrap(); 
      dispatch(setUser(userData.user));
      setShowSuccess(true);
    } catch (err) {
      console.error('Ошибка авторизации:', err);
    }
  }

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);


  return (
    <Card className="auth-card ">
      <Card.Body>
        <h2 className="text-center mb-4">Вход</h2>
        
        {isError && <Alert variant="danger">
          {isError?.data?.message || 'Ошибка авторизации'}
        </Alert>}

        {showSuccess && (
          <Alert variant="success">Успешный вход!</Alert>
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
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
            <Form.Control.Feedback type="invalid">,
              {errors.email?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4" controlId="password">
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
                  <span className="ms-2">Загрузка...</span>
                </>
              ) : 'Войти'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default LoginForm;