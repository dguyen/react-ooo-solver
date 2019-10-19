import React from 'react';
import './item-404.scss';

interface Props {
  itemName: string,
}

const Item404 = (props: Props) => (
  <div id="item404Container">
    <h2>Item not found</h2>
    <p>The item <span>{props.itemName}</span> was unable to be found, please double check the spelling or try another word</p>
  </div>
)

export default Item404;
