import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import './ProfileMenu.css';

const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const menuRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="profile-menu" ref={menuRef}>
      <button 
        className="profile-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        Профиль
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <div className="user-info">
            <div className="info-item">
              <span className="label">Имя:</span>
              <span className="value">{user.name}</span>
            </div>
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">{user.email}</span>
            </div>
          </div>
          <button 
            className="logout-button"
            onClick={handleLogout}
          >
            Выйти
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu; 