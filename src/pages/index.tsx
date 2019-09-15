import React from 'react';

// Components
import Header from '../components/header/header';
import Content from '../components/content/content';
import Footer from '../components/footer/footer';

interface MyState {
  userInputs: Array<string>,
  selectedItem: string | null
}

export default class App extends React.Component<undefined, MyState> {

  constructor(props: any) {
    super(props);
    this.state = {
      userInputs: [],
      selectedItem: null
    }
  }

  /**
   * Add an item to user inputs
   * @param {string} itemName - the name of the item to be added  
   */
  addItem = (itemName: string) => {
    if (this.state.userInputs.includes(itemName)) {
      return;
    }
    this.setState((prev) => {
      let newUpdate = {
        userInputs: prev.userInputs.concat([itemName]),
        selectedItem: prev.userInputs.length <= 0 ? itemName : prev.selectedItem
      }
      return newUpdate;
    });
  }

  /**
   * Select an item
   * @param {string} item - a string representing an item 
   */
  selectItem = (item: string) => {
    this.setState({
      selectedItem: item ? item : this.state.userInputs[0]
    })
  }

  /**
   * Remove an item from the user inputs
   * @param {number} itemIndex - the index of the item to be removed  
   */
  removeItem = (itemIndex: number) => {
    if (this.state.userInputs.length < itemIndex) {
      return;
    }

    this.setState((prev) => {            
      let newInput = {
        userInputs: prev.userInputs.slice(0, itemIndex).concat((prev.userInputs.slice(itemIndex + 1))),
        selectedItem: prev.selectedItem
      }
      if (prev.userInputs[itemIndex] === prev.selectedItem && newInput.userInputs.length >= 1) {
        newInput.selectedItem = newInput.userInputs[0]
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
