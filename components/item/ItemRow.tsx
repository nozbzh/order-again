import React from "react";
import styled from "styled-components";

// import { Item } from "@prisma/client";
import Item from "models/Item";
import Ratings from "components/rating/Ratings";

interface ItemRowProps {
  item: Item;
  establishmentId: string;
}

const ListItem = styled.li`
  display: flex;
  // justify-content: space-between;
  margin-right: 2rem;
`;

const ItemRow = ({
  item: { id, name, ratings },
  establishmentId,
}: ItemRowProps): JSX.Element => {
  return (
    <li>
      <ListItem>
        <div>{name}</div>
        <Ratings
          ratings={ratings}
          itemId={id}
          establishmentId={establishmentId}
        />
      </ListItem>
    </li>
  );
};

export default ItemRow;
