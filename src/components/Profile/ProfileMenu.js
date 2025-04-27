import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import EditProfile from './EditProfile';
import { Dropdown, ListGroup, Button } from 'react-bootstrap';
import './ProfileMenu.scss';

const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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
      <Dropdown show={isOpen} onToggle={setIsOpen}>
        <Dropdown.Toggle 
          variant="outline-light" 
          id="dropdown-profile"
          className="d-flex align-items-center"
        >
          Профиль
        </Dropdown.Toggle>

        <Dropdown.Menu className="p-0 dropdown-menu-end">
          <ListGroup variant="flush">
            <ListGroup.Item className="user-info px-3 py-2">
              <div className="d-flex justify-content-between">
                <span className="fw-bold">Имя:</span>
                <span>{user.name}</span>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <span className="fw-bold">Email:</span>
                <span>{user.email}</span>
              </div>
            </ListGroup.Item>
            
            <ListGroup.Item className="px-0 py-0">
              <Button 
                variant="link" 
                className="w-100 text-start px-3 py-2 text-decoration-none"
                onClick={() => {
                  setIsEditing(true);
                  setIsOpen(false);
                }}
              >
                Редактировать профиль
              </Button>
            </ListGroup.Item>
            
            <ListGroup.Item className="px-0 py-0">
              <Button 
                variant="link" 
                className="w-100 text-start px-3 py-2 text-decoration-none text-danger"
                onClick={handleLogout}
              >
                Выйти
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Dropdown.Menu>
      </Dropdown>

      {isEditing && (
        <EditProfile onClose={() => setIsEditing(false)} />
      )}
    </div>
  );
};

export default ProfileMenu;