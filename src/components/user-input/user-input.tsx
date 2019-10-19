import React from 'react';
import './user-input.scss';

interface Props {
  solve: Function,
  addInput: Function,
}

class UserInput extends React.Component<Props> {
  /**
   * Adds a new input
   */
  addNewInput = () => {
    let newInputRef = (document.getElementById('userInputField') as HTMLInputElement);
  
    if (newInputRef && this.validateInput(newInputRef.value)) {
      this.props.addInput(newInputRef.value);
      newInputRef.value = '';
    }
  }

  /**
   * Validates an input
   * @param {string} newInput - an input to be validated 
   */
  validateInput(newInput: string) {
    if (newInput.length <= 0) {
      return false;
    }
    return true;
  }

  /**
   * Handles key enter down on input
   */
  handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.addNewInput();
    }
  }

  render() {
    return (
      <div id="inputContainer">
        <div id="userInput">
          <input id="userInputField" type="text" onKeyDown={this.handleKeyDown} />
          <button className="noselect" onClick={this.addNewInput}>Enter</button>
        </div>

        <button id="submitButton" onClick={() => this.props.solve()}>Solve</button>
      </div>
    )
  }
}

export default UserInput;
