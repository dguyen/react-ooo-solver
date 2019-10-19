import React from 'react';
import './item-list.scss';

interface Props {
  removeHandler: Function,
  selectItem: Function,
  items: Array<ListItem>,
  selectedItem: string | null,
}

export interface ListItem {
  name: string;
  status: string;
}

export enum ItemStatus {
  error = 'redIndicator',
  pause = 'orangeIndicator',
  okay = 'greenIndicator',
  loading = 'loadingIndicator',
}

export default class ItemList extends React.Component<Props> {
  /**
   * Remove an item from the list
   * @param {number} i - the index of the item
   * @param {event} e - the event
   */
  removeItem = (i: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Stops selectItem from firing after deletion
    this.props.removeHandler(i);
  }

  render() {
    const itemList = this.props.items.map((item, i) => {
      return (
        <div
          id="item"
          onClick={() => this.props.selectItem(item.name)}
          className={this.props.selectedItem === item.name ? 'selectedItem' : undefined}
          key={i}
        >
          <div id="indicator" className={item.status}></div>
          <span>{item.name}</span>
          <svg
            id="deleteIcon"
            onClick={(e) => this.removeItem(i, e)}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"viewBox="0 0 24 24">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            <path d="M0 0h24v24H0z" fill="none"/>
          </svg>
        </div>
      )
    });

    return (
      <div id="itemContainer" className="noselect">
        {itemList}
      </div>
    )
  }
}
