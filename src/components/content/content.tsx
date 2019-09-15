import React from 'react';
import InputList from './input-list/input-list';
import './content.scss';

interface Props {
  inputs: Array<string>,
  removeHandler: Function,
  selectItem: Function,
  selectedItem: string | null,
}

export default class Content extends React.Component<Props> {
  render() {
    return (
      <div id="contentContainer">
        <div id="contentCard">
          <div id="inputListContainer">
            <InputList
              inputs={this.props.inputs}
              removeHandler={this.props.removeHandler}
              selectedItem={this.props.selectedItem}
              selectItem={this.props.selectItem}
            />
          </div>
          <div id="rightSideContent">{this.props.selectedItem}</div>
        </div>
      </div>
    )
  }
}
