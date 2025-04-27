import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', isDarkTheme ? 'dark' : 'light');
    
    const root = document.documentElement;
    if (isDarkTheme) {
      root.style.setProperty('--header-bg', '#2c2c2c');
      root.style.setProperty('--menu-bg', '#333333');
      root.style.setProperty('--primary-color', '#579cb8');
    } else {
      root.style.setProperty('--header-bg', '#ceac4d');
      root.style.setProperty('--menu-bg', '#aad1df');
      root.style.setProperty('--primary-color', '#579cb8');
    }
  }, [isDarkTheme]);

  const toggleTheme = () => {
    setIsDarkTheme(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};