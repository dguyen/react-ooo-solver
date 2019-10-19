import React from 'react';
import { WikiItem } from '../../api/WikipediaAPI';
import './content.scss';

// Components
import ItemList from './item-list/item-list';
import Item404 from './item-content/item-404/item-404';
import ItemAmbiguous from './item-content/item-ambiguous/item-ambiguous';
import ItemInfo from './item-content/item-info/item-info';

interface Props {
  items: Array<string>,
  removeHandler: Function,
  selectItem: Function,
  selectedItem: string | null,
  wikiItems: { [id: string]: WikiItem; };
}

export default class Content extends React.Component<Props> {
  getContent() {
    if (!this.props.selectedItem) {
      return 'Loading';
    }
    const item = this.props.wikiItems[this.props.selectedItem];
    if (!item) {
      return 'Loading';
    } else if (item.isAmbiguous) {
      return <ItemAmbiguous itemInfo={item} />
    } else if (item.exists) {
      return <ItemInfo itemInfo={item} />
    } else {
      return <Item404 itemName={this.props.selectedItem} />
    }
  }

  render() {
    return (
      <div id="contentContainer">
        <div id="contentCard">
          <div id="inputListContainer">
            <ItemList
              items={this.props.items}
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
