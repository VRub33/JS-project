import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './About.css';

function About() {
  return (
    <Container className="about-container py-5">
      <Row className="mb-5">
        <Col>
          <h1 className="about-title text-center">О нас</h1>
        </Col>
      </Row>
      
      <Row className="justify-content-center mb-5">
        <Col md={10} lg={8}>
          <div className="about-content text-center">
            <p className="lead">
              Мы - никто.
            </p>
          </div>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col>
          <h2 className="about-title text-center">Команда</h2>
        </Col>
      </Row>
      
      <Row className="justify-content-center g-4">
        <Col md={4} className="d-flex justify-content-center">
          <Card className="team-member h-100">
            <Card.Body className="text-center">
              <Card.Title>Рубцов Владислав</Card.Title>
              <Card.Text>Разработчик</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default About; 