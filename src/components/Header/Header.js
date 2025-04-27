import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { useLoginState } from '../../hooks/useLoginState';
import ProfileMenu from '../Profile/ProfileMenu';
import Navigation from '../Navigation/Navigation';
import { Navbar, Container, Button, Stack } from 'react-bootstrap';
import './Header.scss';
import Menu from '../Menu/Menu';

const Header = ({ onLabSelect }) => {
  const isLoggedIn = useLoginState();
  const { toggleTheme } = useContext(ThemeContext);

  return (
    <Navbar className="header py-2">
      <Container fluid className="d-flex align-items-center">
        <Menu onLabSelect={onLabSelect} />
        <Navbar.Brand href="/" className="me-4">
          Лабораторные<br className="d-sm-none" /> работы
        </Navbar.Brand>
        <Navigation />
      

        <Stack direction="horizontal" gap={3} className="ms-3">
          <Button 
            variant="outline-light" 
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Toggle theme"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          </Button>
          
          {isLoggedIn && <ProfileMenu />}
        </Stack>
      </Container>
    </Navbar>
  );
};

export default Header;