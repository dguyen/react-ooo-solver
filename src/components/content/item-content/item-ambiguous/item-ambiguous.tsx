import React from 'react';
import './item-ambiguous.scss';
import { WikiItem } from '../../../../api/WikipediaAPI';

interface Props {
  itemInfo: WikiItem,
}

const ItemAmbiguous = (props: Props) => {
  const links = props.itemInfo.categories.map((link) => {
    return <li>{link}</li>
  });

  return (
    <div id="itemAmbigContainer">
      <h2>Ambiguous Item</h2>
      <p>The item <span>{props.itemInfo.title}</span> can have multiple meanings. Do you mean:</p>
      <ul>
        {links}
      </ul>
    </div>
  )
}

export default ItemAmbiguous;
