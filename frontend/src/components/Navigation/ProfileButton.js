import React, { useState, useEffect } from "react";
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import anonymous_user from '../../images/anonymous_user.jpeg';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => {
      setShowMenu(false);
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  return (
    <>
      <button onClick={openMenu} className={`navbar-profile-btn ${showMenu && 'navbar-profile-btn-active'}`}>
        <img src={`${ user.avatar_url ? user.avatar_url : anonymous_user}`} alt='User profile'></img>
      </button>
      {showMenu && (
        <div className="profile-dropdown">
          <div className="mini-profile">
            <div className="mini-profile-left">
              <div className="mini-profile-img">
                <img src={`${ user.avatar_url ? user.avatar_url : anonymous_user}`} alt='User profile'></img>
              </div>
            </div>
            <div className="mini-profile-right">
              <p className="name">{user.name}</p>
              <p className="username">{user.username}</p>
              <p className="title">{user.title}</p>
            </div>
          </div>
          <NavLink exact to="/account-setting">Settings</NavLink>
          <button type="button" onClick={logout}>Log Out</button>
        </div>
      )}
    </>
  );
}

export default ProfileButton;
