import React from 'react';
import WikipediaAPI, { WikiItem } from '../api/WikipediaAPI';

// Components
import Header from '../components/header/header';
import Content from '../components/content/content';
import Footer from '../components/footer/footer';

interface MyState {
  userInputs: Array<string>,
  selectedItem: string | null,
  wikiItems: {[id: string]: WikiItem}
}

export default class App extends React.Component<undefined, MyState> {
  state = {
    userInputs: [] as Array<string>,
    selectedItem: null,
    wikiItems: {} as {[id: string]: WikiItem}
  }

  /**
   * Add an item to user inputs
   * @param {string} itemName - the name of the item to be added  
   */
  addItem = (itemName: string) => {
    if (this.state.userInputs.includes(itemName)) { return }
    this.setState((prev) => {
      let newUpdate = {
        userInputs: prev.userInputs.concat([itemName]),
        selectedItem: prev.userInputs.length <= 0 ? itemName : prev.selectedItem
      }
      return newUpdate;
    });

    // If item has never been inputted before
    if (!this.state.wikiItems.hasOwnProperty(itemName)) {
      this.setItemCategories(itemName);
    }
  }

  /**
   * Find the categories of an item and set it into WikiItems
   * @param itemName the name of the item to set categories
   */
  setItemCategories = (itemName: string) => {
    WikipediaAPI.getCategories(itemName).then((data) => {
      if (data.isAmbiguous) {
        // Todo: Get potiential links
      }
      this.setState((prev) => {
        let newWikiItems = Object.assign(prev.wikiItems);
        newWikiItems[itemName] = data;
        return { wikiItems: newWikiItems }
      })
    }).catch((err) => {
      // Todo: Handle missing page error
      console.log(err);
    })
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
