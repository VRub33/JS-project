import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Navigation.scss';
import { Offcanvas } from 'react-bootstrap';

function Navigation() {
  return (
    <>
      <Nav className="me-auto d-none d-md-flex navigation-desktop">
        <Nav.Link as={Link} to="/about" className="nav-link">
          О нас
        </Nav.Link>
        <Nav.Link as={Link} to="/contacts" className="nav-link">
          Контакты
        </Nav.Link>
      </Nav>

      <div className="d-md-none">
        <Navbar.Offcanvas
          id="mobile-navigation"
          aria-labelledby="mobile-navigation-label"
          placement="end"
        >
          <Offcanvas.Body>
            <Nav className="flex-column navigation-mobile">
              <Nav.Link as={Link} to="/about" className="nav-link">
                О нас
              </Nav.Link>
              <Nav.Link as={Link} to="/contacts" className="nav-link">
                Контакты
              </Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </div>
    </>
  );
}

export default Navigation;