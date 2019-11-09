import React from 'react';
import './item-info.scss';
import { WikiItem } from '../../../../api/WikipediaAPI';

interface MyProps {
  itemInfo: WikiItem,
}

interface MyState {
  reducedExtract: boolean;
}

export default class ItemInfo extends React.Component<MyProps, MyState> {
  state = {
    reducedExtract: true,
  }

  getExtract(): string {
    return this.state.reducedExtract ?
      this.props.itemInfo.extract.substr(0, 200) :
      this.props.itemInfo.extract;
  }

  render() {
    const categories = this.props.itemInfo.categories.map((category) => {
      return <li key={category + 'itemInfo'}>{category}</li>
    });
 
    return (
      <div id="itemInfoContainer">
        <h2>{this.props.itemInfo.title}</h2>
        <p>
          {this.getExtract()}
          <span
            className="expandSpan"
            onClick={() => this.setState({ reducedExtract: !this.state.reducedExtract })}
          >
            {this.state.reducedExtract ? ' more' : ' less'}
          </span>
        </p>
        <div id="categoryList">
          <p>Related Categories:</p>
          <ul>{categories}</ul>
        </div>
      </div>
    )
  }
}
