import React from 'react';
import { Wikipedia, WikiItem } from '../api/WikipediaAPI';

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
  WikipediaAPI: Wikipedia = new Wikipedia();

  state = {
    userInputs: [] as Array<string>,
    selectedItem: null,
    wikiItems: {} as {[id: string]: WikiItem}
  }

  /**
   * Add an item to user inputs
   * @param {string} itemName - the name of the item to be added  
   * @param {number} index (optional) - the index to insert the item, default (-1) is end of list 
   */
  addItem = (itemName: string, index: number = -1) => {
    if (this.state.userInputs.includes(itemName)) { return }

    this.setState((prev) => {
      const newUpdate: MyState = Object.assign(prev);
      if (index < 0) {
        newUpdate.userInputs.push(itemName);
      } else {
        newUpdate.userInputs.splice(index, 0, itemName);
      }
      newUpdate.selectedItem = itemName;
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
    this.WikipediaAPI.getInfo(itemName).then((data: WikiItem) => {
      if (data.isAmbiguous) {
        this.WikipediaAPI.getAmbiguousLinks(itemName).then((links: string[]) => {
          this.setState((prev) => {
            let update = Object.assign(prev.wikiItems);
            update[itemName] = data;
            update[itemName].links = links;
            return { wikiItems: update };
          });
        });
      } else {
        this.setState((prev) => {
          let newWikiItems = Object.assign(prev.wikiItems);
          newWikiItems[itemName] = data;
          return { wikiItems: newWikiItems }
        });  
      }
    })
  }

  /**
   * Replaces the given item with a new item
   * @param item item to be addded
   * @param oldItem item to be replaced
   */
  replaceItem = (newItem: string, oldItem: string) => {
    const oldIndex = this.state.userInputs.indexOf(oldItem);
    if (oldIndex >= 0) {
      this.removeItem(oldIndex);
    }
    if (!this.state.userInputs.includes(newItem)) {
      this.addItem(newItem, oldIndex);
    }
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
    // Todo: Solve
  }

  render() {
    let showContent = null;
    if (this.state.userInputs.length > 0) {
      showContent = (
        <Content 
          items={this.state.userInputs}
          wikiItems={this.state.wikiItems}
          selectedItem={this.state.selectedItem}
          selectItem={this.selectItem}
          replaceItemHandler={this.replaceItem}
          removeHandler={this.removeItem} />
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
