import React from 'react';
import { useParams } from 'react-router-dom';
import { labDescriptions, labs } from './labs';

const Content = () => {
  const { labId } = useParams();
  
  const selectedLab = labs.find(lab => 
    lab.replace(/\s+/g, '-').toLowerCase() === labId
  );

  return (
    <main className="content">
      {selectedLab ? (
        <>
          <h2>{selectedLab}</h2>
          {React.createElement(labDescriptions[selectedLab])}
        </>
      ) : (
        <p>Выберите лабораторную работу из меню слева</p>
      )}
    </main>
  );
};

export default Content;