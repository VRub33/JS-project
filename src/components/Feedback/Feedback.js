import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useAddReviewMutation, useDeleteReviewMutation, useGetReviewsQuery } from '../../store/api';
import './Feedback.css';

const Feedback = () => {
  const { data: reviews = [], isLoading, isError, error, refetch } = useGetReviewsQuery();
  const sortedReviews = [...reviews].sort((a, b) => b.id - a.id);

  const [addReview, {isLoading: isAdding, isSuccess}] = useAddReviewMutation();
  const [deleteReview, { isLoading: isDeleting}] = useDeleteReviewMutation();

  const [showSuccess, setShowSuccess] = useState(false);

  const { user } = useSelector(state => state.auth);

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      message: ''
    }
  });

  useEffect(() => {
    reset({
      name: user?.name || '',
      email: user?.email || '',
      message: ''
    });
  }, [user, reset]);
  
  const onSubmit = async (data) => {
    try {
      const reviewData = {
        ...data,
        date: new Date().toLocaleDateString(),
        userId: user?.id
      };
      await addReview(reviewData).unwrap();
      reset();
      setShowSuccess(true);
    } catch (err) {
      console.error('Не удалось добавить отзыв:', err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId).unwrap();
      refetch();
    } catch (err) {
     console.error('Не удалось удалить отзыв:', err);
    }
  };
  
  useEffect(() => {
      if (isSuccess) {
        const timer = setTimeout(() => setShowSuccess(false), 3000);
        return () => clearTimeout(timer);
      }
    }, [isSuccess]);

  if (isError) return <Alert variant="danger">{error.message}</Alert>;
  
  return (
    <Container className="feedback-page-container py-5">
      <Row className="mb-5">
        <Col>
          <h1 className="feedback-page-title text-center">Обратная связь</h1>
        </Col>
      </Row>
      
      {showSuccess && (
        <Alert variant="success" className="text-center">
          Отзыв успешно отправлен!
        </Alert>
      )}

      <Row className="justify-content-center mb-5">
        <Col md={8} lg={6}>
          <Card className="feedback-form-card">
            <Card.Body>
              <Card.Title className="text-center mb-4">Отправить отзыв</Card.Title>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                  <Form.Label>Имя:</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('name', { 
                      required: 'Имя обязательно',
                      minLength: {
                        value: 2,
                        message: 'Имя должно содержать минимум 2 символа'
                      }
                    })}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    type="email"
                    {...register('email', {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Введите корректный email'
                      }
                    })}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Сообщение:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    {...register('message', { 
                      required: 'Сообщение обязательно',
                    })}
                    isInvalid={!!errors.message}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.message?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={isAdding}
                    className="submit-button"
                  >
                    {isAdding ? (
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
                    ) : 'Отправить отзыв'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <h2 className="text-center mb-4">Отзывы</h2>
          
          {reviews.length === 0 ? (
            <Alert variant="info" className="text-center">
              Отзывов пока нет.
            </Alert>
          ) : (
            <div className="reviews-list">
              {sortedReviews.map(review => (
                <Card key={review.id} className="review-card mb-3">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <Card.Title className="review-name">{review.name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                          {review.date}
                          {review.email && ` • ${review.email}`}
                        </Card.Subtitle>
                      </div>
                      {user && review.userId === user.id && (
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteReview(review.id)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? 'Удаление...' : 'Удалить'}
                        </Button>
                      )}
                    </div>
                    <Card.Text className="review-message">
                    {review.block ? (
                      <span className="text-muted fst-italic">Отзыв заблокирован</span>
                    ) : (
                        review.message
                    )}
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Feedback; 