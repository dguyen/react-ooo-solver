import React from 'react';
import PropTypes from 'prop-types';
import UserInput from '../user-input/user-input';
import './header.scss';

const Header = (props) => (
  <div id="container">
    <div id="titleContainer">
      <h1>Odd One Out Solver</h1>
      <p>Solve Odd One Out questions online</p>
    </div>
  
    <UserInput addInput={props.addInput} solve={props.solve}/>
  </div>
)

Header.propTypes = {
  addInput: PropTypes.func,
  solve: PropTypes.func
};

export default Header;
