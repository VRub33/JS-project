import React, { useState, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import Header from './components/Header/Header';
import Menu from './components/Menu/Menu';
import Content from './components/Content/Content';
import Counter from './components/Counter/Counter';
import Footer from './components/Footer';
import { ThemeContext, ThemeProvider } from './context/ThemeContext';
import { store } from './store/store';
import './App.css';

function AppContent() {
  const [selectedLab, setSelectedLab] = useState(null);
  const { isDarkTheme } = useContext(ThemeContext);

  useEffect(() => {
    console.log('Компонент смонтирован');
    
    return () => {
      console.log('Компонент будет размонтирован');
    };
  }, []);

  
  const handleLabSelect = (lab) => {
    setSelectedLab(lab);
  };

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
        </div>
        <Footer />
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

