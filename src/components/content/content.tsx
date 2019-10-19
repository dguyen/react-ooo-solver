import React from 'react';
import { WikiItem } from '../../api/WikipediaAPI';
import './content.scss';

// Components
import ItemList, { ListItem, ItemStatus } from './item-list/item-list';
import Item404 from './item-content/item-404/item-404';
import ItemAmbiguous from './item-content/item-ambiguous/item-ambiguous';
import ItemInfo from './item-content/item-info/item-info';

interface Props {
  items: Array<string>,
  removeHandler: Function,
  selectItem: Function,
  replaceItemHandler: Function,
  selectedItem: string | null,
  wikiItems: { [id: string]: WikiItem; };
}

export default class Content extends React.Component<Props> {
  /**
   * Returns the type of content to be shown
   */
  getContent() {
    if (!this.props.selectedItem) {
      return 'Loading';
    }
    const item = this.props.wikiItems[this.props.selectedItem];
    const replaceHandler = (newItem: string) => {
      this.props.replaceItemHandler(newItem, item.originalTitle)
    }
    if (!item) {
      return 'Loading';
    } else if (item.isAmbiguous) {
      return <ItemAmbiguous itemInfo={item} replaceItem={replaceHandler} />
    } else if (item.exists) {
      return <ItemInfo itemInfo={item} />
    } else {
      return <Item404 itemName={this.props.selectedItem} />
    }
  }

  /**
   * Returns a string representing the status of the item
   * @param itemInfo the wiki item to get the status from
   */
  getStatus(itemInfo: WikiItem | null): string {
    if (itemInfo) {
      if (!itemInfo.exists) {
        return ItemStatus.error;
      } else if (itemInfo.isAmbiguous) {
        return ItemStatus.pause;
      } else {
        return ItemStatus.okay;
      }
    } else {
      return ItemStatus.loading;
    }
  }

  /**
   * Returns a list of active items and their status
   */
  getActiveItems(): ListItem[] {
    return this.props.items.map((title: string) => {
      const tmp = this.props.wikiItems[title]
      return {
        name: tmp ? tmp.originalTitle : title,
        status: this.getStatus(tmp),
      }
    });
  }

  render() {
    return (
      <div id="contentContainer">
        <div id="contentCard">
          <div id="inputListContainer">
            <ItemList
              items={this.getActiveItems()}
              removeHandler={this.props.removeHandler}
              selectedItem={this.props.selectedItem}
              selectItem={this.props.selectItem}
            />
          </div>
          <div id="rightSideContent">
            {this.getContent()}
          </div>
        </div>
      </div>
    )
  }
}
