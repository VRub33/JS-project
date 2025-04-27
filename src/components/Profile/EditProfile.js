import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { setUser } from '../../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useUpdateUserMutation } from '../../store/api';
import { Modal, Form, Button, Spinner, Alert } from 'react-bootstrap';
import './EditProfile.scss';


const EditProfile = ({ onClose }) => {
  const dispatch = useDispatch();
  const { user, error: authError } = useSelector((state) => state.auth);

  const [updateUserProfile, { isLoading, isError, error: updateError }] = useUpdateUserMutation();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const updatedUser = await updateUserProfile({ userId: user.id, ...data }).unwrap();
      dispatch(setUser(updatedUser.user));
      onClose();
    } catch (err) {
      console.error('Ошибка при обновлении профиля:', err);
    }
  };

  return (
    <Modal show={true} onHide={onClose} centered backdrop="static" className='edit-profile-modal'>
      <Modal.Header closeButton>
        <Modal.Title>Редактировать профиль</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Имя</Form.Label>
            <Form.Control
              type="text"
              isInvalid={!!errors.name}
              {...register('name', {
                required: 'Имя обязательно для заполнения',
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
                required: 'Email обязателен для заполнения',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Введите корректный email адрес'
                }
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email?.message}
            </Form.Control.Feedback>
          </Form.Group>

          {(isError || authError) && (
            <Alert variant="danger" className="mt-3">
              {updateError?.data?.message || authError}
            </Alert>
          )}

          <div className="d-grid gap-2 mt-4">
            <Button 
              variant="primary" 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  <span className="ms-2">Обновление...</span>
                </>
              ) : 'Сохранить'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditProfile;