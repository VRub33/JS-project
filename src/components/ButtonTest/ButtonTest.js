import React, { useState } from 'react';
import { Button, Card, Alert } from 'react-bootstrap';

const ButtonTestPage = () => {
  const [clickCount, setClickCount] = useState(0);
  const [disabled, setDisabled] = useState(false);

  const handleClick = () => {
    setClickCount(prev => prev + 1);
  };

  return (
    <Card className="mt-4">
      <Card.Body>
        <Card.Title>Тестирование кнопки</Card.Title>
        
        <div className="mb-3">
          <Button 
            onClick={handleClick}
            disabled={disabled}
            data-testid="test-button"
          >
            {disabled ? 'Кнопка отключена' : 'Нажми меня'}
          </Button>
        </div>
        
        <Alert variant="info">
          Количество нажатий: <span data-testid="click-count">{clickCount}</span>
        </Alert>
        
        <Button 
          variant="outline-secondary" 
          onClick={() => setDisabled(!disabled)}
          size="sm"
        >
          {disabled ? 'Включить кнопку' : 'Отключить кнопку'}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ButtonTestPage;