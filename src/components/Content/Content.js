import React from 'react';
import { useParams } from 'react-router-dom';
import { labDescriptions, labs } from './labs';
import { Container, Card, Alert } from 'react-bootstrap';

const Content = () => {
  const { labId } = useParams();
  
  const selectedLab = labs.find(lab => 
    lab.replace(/\s+/g, '-').toLowerCase() === labId
  );

  return (
    <Container fluid className="content py-4">
      {selectedLab ? (
        <>
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Body>
              <Card.Title as="h2" className="mb-4">
                {selectedLab}
              </Card.Title>
              <div className="lab-content">
                {React.createElement(labDescriptions[selectedLab])}
              </div>
            </Card.Body>
          </Card>
        </>
      ) : (
        <Alert variant="info" className="mt-4">
          <Alert.Heading>Выберите лабораторную работу из меню вверху</Alert.Heading>
        </Alert>
      )}
    </Container>
  );
};

export default Content;