import React from 'react';
import PropTypes from 'prop-types';
import InputList from './input-list/input-list';
import './content.scss';

class Content extends React.Component {
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

Content.propTypes = {
  inputs: PropTypes.array,
  selectedItem: PropTypes.string,
  selectItem: PropTypes.func,
  removeHandler: PropTypes.func,
}

export default Content;
