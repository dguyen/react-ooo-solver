import React from 'react';

// Components
import Header from '../components/header/header';
import Content from '../components/content/content';
import Footer from '../components/footer/footer';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      userInputs: [],
      selectedItem: null
    }
  }

  /**
   * Add an item to user inputs
   * @param {string} itemName - the name of the item to be added  
   */
  addItem = (itemName) => {
    if (this.state.userInputs.includes(itemName)) {
      return;
    }
    this.setState((prev) => {
      let newUpdate = {
        userInputs: prev.userInputs.concat([itemName])        
      }
      if (this.state.userInputs.length <= 0) {
        newUpdate['selectedItem'] = itemName;
      }
      return newUpdate;
    });
  }

  /**
   * Select an item
   * @param {string} item - a string representing an item 
   */
  selectItem = (item) => {
    this.setState({
      selectedItem: item ? item : this.state.inputs[0]
    })
  }

  /**
   * Remove an item from the user inputs
   * @param {number} itemIndex - the index of the item to be removed  
   */
  removeItem = (itemIndex) => {
    if (this.state.userInputs.length < itemIndex) {
      return;
    }

    this.setState((prev) => {
      let newInput = {
        userInputs: prev.userInputs.slice(0, itemIndex).concat((prev.userInputs.slice(itemIndex + 1)))
      }
      if (prev.userInputs[itemIndex] === prev.selectedItem && newInput['userInputs'].length >= 1) {
        newInput['selectedItem'] = newInput['userInputs'][0];
      }
      return newInput;
    });
  }

  solve = () => {
    console.log('Todo: Solve inputs' + this.state.userInputs.toString());
  }

  render() {
    let showContent = null;
    if (this.state.userInputs.length > 0) {
      showContent = (
        <Content 
          inputs={this.state.userInputs}
          selectedItem={this.state.selectedItem}
          selectItem={this.selectItem}
          removeHandler={this.removeItem}/>
      );
    }

    return (
      <div style={{width: '100%', height: '100%', position: 'absolute', top:0, left: 0}}>
        <Header addInput={this.addItem} solve={this.solve} />
        {showContent}
        <Footer />
      </div>
    )
  }
}

export default App;
