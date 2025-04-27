import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './Contacts.css';

function Contacts() {
  return (
    <Container className="contacts-container py-5">
      <Row className="mb-5">
        <Col>
          <h1 className="contacts-title text-center">Контакты</h1>
        </Col>
      </Row>
      
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="contact-info">
            <Card className="contact-item mb-4">
              <Card.Body className="d-flex align-items-center justify-content-center">
                <div className="contact-icon me-3">
                  <FaPhone size={24} />
                </div>
                <div className="contact-details text-center">
                  <Card.Title as="h3">Телефон</Card.Title>
                  <Card.Text>+7 (929) 123-45-67</Card.Text>
                </div>
              </Card.Body>
            </Card>
            
            <Card className="contact-item mb-4">
              <Card.Body className="d-flex align-items-center justify-content-center">
                <div className="contact-icon me-3">
                  <FaEnvelope size={24} />
                </div>
                <div className="contact-details text-center">
                  <Card.Title as="h3">Email</Card.Title>
                  <Card.Text>info@asu.ru</Card.Text>
                </div>
              </Card.Body>
            </Card>
            
            <Card className="contact-item">
              <Card.Body className="d-flex align-items-center justify-content-center">
                <div className="contact-icon me-3">
                  <FaMapMarkerAlt size={24} />
                </div>
                <div className="contact-details text-center">
                  <Card.Title as="h3">Адрес</Card.Title>
                  <Card.Text>656049, г. Барнаул, пр. Ленина, 61</Card.Text>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Contacts; 