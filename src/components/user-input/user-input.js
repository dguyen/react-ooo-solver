import React from 'react';
import './user-input.scss';

class UserInput extends React.Component {
  render() {
    return (
      <div id="inputContainer">
        <div id="userInput">
          <input type="text"/>
          <button class="noselect">Enter</button>
        </div>

        <button id="submitButton">Solve</button>
      </div>
    )
  }
}

export default UserInput;
