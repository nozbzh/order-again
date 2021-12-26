import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import startCase from "lodash/startCase";

import { notifyError, notifySuccess, getErrorMessage } from "utils/ui";
import { Establishment } from "@prisma/client";
import { Button, SubTitle, Flex, Body, Heading } from "../StyledComponents";
import ItemForm from "@/components/item/ItemForm";
import ItemList from "@/components/item/ItemList";

interface EstablishmentDetailProps {
  establishment: Establishment;
}

// TODO: how to model and fetch all associated items?
const EstablishmentDetail = ({
  establishment: { name, address, id },
}: EstablishmentDetailProps): JSX.Element => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [showAddItem, setShowAddItem] = React.useState(false);
  const [refetchItems, setRefetchItems] = React.useState(false);

  const handleEdit = () => {
    router.push(`/establishments/edit/${id}`);
  };

  const handleDelete = async () => {
    const url = `/api/establishments/${id}`;
    setLoading(true);
    try {
      await axios.delete(url);
      notifySuccess("Deleted!");
      router.push("/");
    } catch (e: any) {
      notifyError(`Could not delete establishment: ${getErrorMessage(e)}`);
    }
    setLoading(false);
  };

  return (
    <>
      <Heading>{startCase(name)}</Heading>
      <SubTitle>{address}</SubTitle>
      <Flex>
        <Button onClick={() => setShowAddItem(true)}>Add Item</Button>
        <Button onClick={handleEdit}>Edit</Button>
        <Button onClick={handleDelete} danger={true} disabled={loading}>
          {loading ? "..." : "Delete"}
        </Button>
      </Flex>
      {showAddItem && (
        <ItemForm
          establishmentId={id}
          onSuccess={() => {
            setShowAddItem(false);
            setRefetchItems(true);
          }}
        />
      )}
      <ItemList
        establishmentId={id}
        refetchItems={refetchItems}
        onRefetch={() => setRefetchItems(false)}
      />
    </>
  );
};

export default EstablishmentDetail;
