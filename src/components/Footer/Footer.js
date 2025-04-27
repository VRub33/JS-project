import React from 'react';
import { useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.scss';

const Footer = () => {
  const { user } = useSelector(state => state.auth);

  return (
    <footer className="footer py-1 mt-auto">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs="auto">
            <p className="mb-0 text-center">
              &copy; Лабораторные работы {new Date().getFullYear()}
            </p>
          </Col>
          <Col xs="auto">
            <p className="mb-0 text-center">
              <Link to="/feedback" className="text-decoration-none">Обратная связь</Link>
              {user?.role === 'admin' && ( <Link to="/admin" className="text-decoration-none">Панель администрирования</Link>)}
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;