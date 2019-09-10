import React from 'react';
import PropTypes from 'prop-types';
import InputList from './input-list/input-list';
import './content.scss';

class Content extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedItem: ''
    }
  }

  /**
   * Select an item
   * @param {string} item - a string representing an item 
   */
  selectItem = (item) => {
    this.setState({
      selectedItem: item
    })
  }

  render() {
    return (
      <div id="contentContainer">
      <div id="contentCard">
        <div id="inputListContainer">
          <InputList
            inputs={this.props.inputs}
            removeHandler={this.props.removeHandler}
            selectedItem={this.state.selectedItem}
            selectItem={this.selectItem}
          />
        </div>
        <div id="rightSideContent">RightSideContent</div>
      </div>
    </div>
    )
  }
}

Content.propTypes = {
  inputs: PropTypes.array,
  removeHandler: PropTypes.func,
}

export default Content;
