import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Menu.css';
import { labs } from '../Content/labs';

const Menu = ({ onLabSelect, selectedLab }) => {
  const location = useLocation();

  return (
    <nav className="menu">
      <h2>Лабораторные работы</h2>
      <ul>
        <li className={location.pathname === '/counter' ? 'active' : ''}>
          <Link to="/counter">Счетчик</Link>
        </li>
        <li className="menu-separator"></li>
        {labs.map((lab) => {
          const labId = lab.replace(/\s+/g, '-').toLowerCase();
          return (
            <li 
              key={lab}
              className={location.pathname === `/labs/${labId}` ? 'active' : ''}
            >
              <Link to={`/labs/${labId}`} onClick={() => onLabSelect(lab)}>
                {lab}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Menu;