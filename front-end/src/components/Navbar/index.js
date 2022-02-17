import React from 'react';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink
} from './Navbar';

const Navbar = () => {
  
  if (localStorage.getItem("userId") === null) {
    return (
      <>
        <Nav>
          <NavMenu>
          </NavMenu>
          <NavBtn>
            <NavBtnLink to='/login'>Login</NavBtnLink>
            <NavBtnLink to='/register'>Register</NavBtnLink>
          </NavBtn>
        </Nav>
      </>
    );
  } 

  return (
    <>
      <Nav>
        <NavMenu>
        </NavMenu>
        <NavBtn>
          <NavBtnLink to='/logout'>logout</NavBtnLink>
        </NavBtn>
      </Nav>
    </>
  );

  
};

export default Navbar;