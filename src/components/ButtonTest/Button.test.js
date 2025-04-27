import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ButtonTestPage from './ButtonTest';

describe('ButtonTestPage', () => {
  test('renders button and click counter', () => {
    render(<ButtonTestPage />);
    
    const button = screen.getByTestId('test-button');
    expect(button).toBeInTheDocument();
    expect(screen.getByText(/Количество нажатий:/i)).toBeInTheDocument();
    expect(screen.getByTestId('click-count')).toHaveTextContent('0');
  });

  test('increments counter when button clicked', () => {
    render(<ButtonTestPage />);
    
    const button = screen.getByTestId('test-button');
    fireEvent.click(button);
    fireEvent.click(button);
    
    expect(screen.getByTestId('click-count')).toHaveTextContent('2');
  });

  test('disables button when toggle clicked', () => {
    render(<ButtonTestPage />);
    
    const toggleButton = screen.getByText('Отключить кнопку');
    fireEvent.click(toggleButton);
    
    const mainButton = screen.getByTestId('test-button');
    expect(mainButton).toBeDisabled();
    expect(screen.getByText('Кнопка отключена')).toBeInTheDocument();
  });
});
