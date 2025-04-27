import React, { useState, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useLoginState } from './hooks/useLoginState';
import Header from './components/Header/Header';
import Menu from './components/Menu/Menu';
import Content from './components/Content/Content';
import Counter from './components/Counter/Counter';
import Footer from './components/Footer';
import Feedback from './components/Feedback/Feedback';
import FeedbackButton from './components/Feedback/FeedbackButton';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import { ThemeContext, ThemeProvider } from './context/ThemeContext';
import './App.css';

function AppContent() {
  const [selectedLab, setSelectedLab] = useState(null);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { isDarkTheme } = useContext(ThemeContext);

  useEffect(() => {
    console.log('Компонент смонтирован');
    
    return () => {
      console.log('Компонент будет размонтирован');
    };
  }, []);

  const isLoggedIn = useLoginState();

  const handleLabSelect = (lab) => {
    setSelectedLab(lab);
  };

  const toggleFeedback = () => {
    setIsFeedbackVisible(!isFeedbackVisible);
  };

  if (!isLoggedIn) {
    return (
      <div className="auth-container">
        {showRegister ? (
          <RegisterForm />
        ) : (
          <LoginForm />
        )}
        <button 
          className="toggle-form-button"
          onClick={() => setShowRegister(!showRegister)}
        >
          {showRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
        </button>
      </div>
    );
  }

  return (
    <div className="app" data-theme={isDarkTheme ? 'dark' : 'light'}>
      <Router>
        <Header />
        <div className="main-container">
          <Menu onLabSelect={handleLabSelect} selectedLab={selectedLab} />
          <Routes>
            <Route path="/" element={<Navigate to="/labs" replace />} />
            <Route path="/labs" element={<Content selectedLab={null} />} />
            <Route path="/labs/:labId" element={<Content />} />
            <Route path="/counter" element={<Counter />} />
          </Routes>
          <Feedback isVisible={isFeedbackVisible} onClose={toggleFeedback} />
        </div>
        <Footer />
        <FeedbackButton 
          onClick={toggleFeedback} 
          isVisible={!isFeedbackVisible} 
        />
      </Router>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

export default App;

