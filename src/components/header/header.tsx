import React from 'react';
import UserInput from '../user-input/user-input';
import './header.scss';

interface Props {
  addInput: Function,
  solve: Function,
}

const Header = (props: Props) => (
  <div id="container">
    <div id="titleContainer">
      <h1>Odd One Out Solver</h1>
      <p>Solve Odd One Out questions online</p>
    </div>
  
    <UserInput addInput={props.addInput} solve={props.solve}/>
  </div>
)

export default Header;
