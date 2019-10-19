import React from 'react';
import './item-info.scss';
import { WikiItem } from '../../../../api/WikipediaAPI';

interface Props {
  itemInfo: WikiItem,
}

const ItemInfo = (props: Props) => {
  const categories = props.itemInfo.categories.map((category) => {
    return <li key={category}>{category}</li>
  });

  return (
    <div id="itemInfoContainer">
      <h2>{props.itemInfo.title}</h2>
      <p>{props.itemInfo.extract}</p>
      <div id="categoryList">
        <p>Related Categories:</p>
        <ul>{categories}</ul>
      </div>
    </div>
  )
}

export default ItemInfo;
