import React from "react";
import axios from "axios";
import get from "lodash/get";

import { notifyError, getErrorMessage } from "utils/ui";
import ItemRow from "./ItemRow";

interface ItemListProps {
  establishmentId: string;
  refetchItems: boolean;
  onRefetch: () => void;
}

const ItemList = ({
  establishmentId,
  refetchItems,
  onRefetch,
}: ItemListProps): JSX.Element => {
  const [loading, setLoading] = React.useState(false);
  const [items, setItems] = React.useState([]);

  const fetchItems = async () => {
    setLoading(true);
    const url = `/api/establishments/${establishmentId}/items`;

    try {
      const response = await axios.get(url);
      setItems(get(response, "data.payload", []));
    } catch (e: any) {
      notifyError(`Could not fetch items: ${getErrorMessage(e)}`);
    }

    setLoading(false);
  };

  React.useEffect(() => {
    fetchItems();
  }, []);

  React.useEffect(() => {
    if (refetchItems) {
      const refetch = async () => {
        await fetchItems();
        onRefetch();
      };
      refetch();
    }
  }, [refetchItems]);

  return (
    <>
      {loading ? (
        "loading..."
      ) : (
        <ul>
          {items.length
            ? items.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  establishmentId={establishmentId}
                />
              ))
            : "No items yet"}
        </ul>
      )}
    </>
  );
};

export default ItemList;
