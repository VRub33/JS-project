import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Offcanvas, ListGroup, Button } from 'react-bootstrap';
import { labs } from '../Content/labs';
import './Menu.scss';
import { FaBars } from 'react-icons/fa';

const Menu = ({ onLabSelect }) => {
  const [show, setShow] = useState(false);
  const location = useLocation();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    handleClose();
  }, [location.pathname]);

  return (
    <>
      <Button 
        variant="outline-light" 
        onClick={handleShow}
        className="menu-toggle"
      >
        <FaBars />
      </Button>
      <Offcanvas show={show} onHide={handleClose} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Список лабораторных работ</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <ListGroup variant="flush">
            <ListGroup.Item 
              action 
              as={Link} 
              to="/counter"
              onClick={() => onLabSelect('Счетчик')}
              className="border-0 rounded-0"
            >
              Счетчик
            </ListGroup.Item>
            
            <ListGroup.Item className="p-0">
              <div className="menu-separator" />
            </ListGroup.Item>
            
            {labs.map((lab) => {
              const labId = lab.replace(/\s+/g, '-').toLowerCase();
              return (
                <ListGroup.Item
                  key={lab}
                  action
                  as={Link}
                  to={`/labs/${labId}`}
                  className="border-0 rounded-0"
                  onClick={() => onLabSelect(lab)}
                >
                  {lab}
                </ListGroup.Item>
              );
            })}

            <ListGroup.Item className="p-0">
              <div className="menu-separator" />
            </ListGroup.Item>

            <ListGroup.Item
              action 
              as={Link} 
              to="/buttontest"
              onClick={() => onLabSelect('Тест')}
              className="border-0 rounded-0" >
                Тест кнопки
            </ListGroup.Item>
          </ListGroup>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Menu;