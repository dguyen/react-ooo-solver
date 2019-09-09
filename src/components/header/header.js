import React from 'react';
import './header.scss';
import UserInput from '../user-input/user-input';

const Header = (props) => (
  <div id="container">
    <div id="titleContainer">
      <h1>Odd One Out Solver</h1>
      <p>Solve Odd One Out questions online</p>
    </div>
  
    <UserInput />
  </div>
)

export default Header;
