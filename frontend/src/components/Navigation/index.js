import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
// import LoginFormModal from '../LoginFormModal';
import tickety_logo from '../../images/tickety_logo.png'
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <ProfileButton user={sessionUser} />
    );
  } else {
    sessionLinks = (
      <>
        <div className='navbar-sign-up-btn'>
          <NavLink exact to="/signup">Sign Up</NavLink>
        </div>
        <div className='navbar-login-btn'>
          <NavLink exact to="/login">Log In</NavLink>
        </div>
        {/* <LoginFormModal /> */}
      </>
    );
  }

  return (
    <nav className='navbar-top'>
          <NavLink exact to="/" className='navbar-logo'>
            <span><img src={tickety_logo} alt='logo'></img></span>
            Tickety
          </NavLink>
          {isLoaded && sessionLinks}
    </nav>
  );
}

export default Navigation;
