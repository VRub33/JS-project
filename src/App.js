import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { store } from './store/store';
import { useLoginState } from './hooks/useLoginState';
import Header from './components/Header/Header';
import Content from './components/Content/Content';
import Counter from './components/Counter/Counter';
import ButtonTest from './components/ButtonTest/ButtonTest';
import Footer from './components/Footer/Footer';
import Feedback from './components/Feedback/Feedback';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import About from './components/About/About';
import Contacts from './components/Contacts/Contacts';
import AdminPanel from './components/AdminPanel/AdminPanel';
import { ThemeContext, ThemeProvider } from './context/ThemeContext';
import './App.scss';
import { Container, Row, Col, Button } from 'react-bootstrap';

function AppContent() {
  const [selectedLab, setSelectedLab] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const { isDarkTheme } = useContext(ThemeContext);

  const logged = useLoginState();

  const handleLabSelect = (lab) => {
    setSelectedLab(lab);
  };

  const PrivateRoute = ({ children, roles }) => {
    const { user } = useSelector(state => state.auth);
    
    if (!user) return <Navigate to="/login" />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
    
    return children;
  };

  if (!logged) {
    return (
      <Container fluid className={`auth-container d-flex align-items-center justify-content-center min-vh-100 'bg-darks' : 'bg-light'}`}>
        <Row className="justify-content-center w-100">
          <Col xs={12} sm={10} md={8} lg={6} xl={4}>
            <div className={`p-4 rounded ${isDarkTheme ? 'bg-dark' : 'bg-white'}`}>
              {showRegister ? (
                <RegisterForm />
              ) : (
                <LoginForm />
              )}
              <Button 
                variant="link"
                className="w-100 mt-3"
                onClick={() => setShowRegister(!showRegister)}
              >
                {showRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <div className={`app d-flex flex-column min-vh-100 ${isDarkTheme ? 'bg-dark text-white' : 'bg-light'}`}>
        <Header onLabSelect={handleLabSelect} />
        <div className="content-wrapper flex-grow-1 d-flex flex-column">
          <Container fluid className="flex-grow-1">
            <Row className="h-100">
              <Col md={12} className={`content-column p-4 ${isDarkTheme ? 'bg-dark' : 'bg-white'}`}>
                <Routes>
                  <Route path="/" element={<Navigate to="/labs" replace />} />
                  <Route path="/labs" element={<Content selectedLab={null} />} />
                  <Route path="/labs/:labId" element={<Content />} />
                  <Route path="/counter" element={<Counter />} />
                  <Route path='/buttontest' element={<ButtonTest />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/feedback" element={<Feedback />} />
                  <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminPanel /></PrivateRoute>} />
                </Routes>
              </Col>
            </Row>
          </Container>
        </div>
        <Footer />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;