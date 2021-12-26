import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import styled from "styled-components";

import { Item } from "@prisma/client";
import { notifyError, notifySuccess, getErrorMessage } from "utils/ui";
import { Flex, Button } from "components/StyledComponents";

interface ItemFormProps {
  item?: Item;
  establishmentId: string;
  onSuccess: () => void;
}

const ErrorMessage = styled.span`
  color: red;
`;

const ItemForm = ({
  item,
  establishmentId,
  onSuccess,
}: ItemFormProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = React.useState(false);

  const isEdit = Boolean(item);

  const onSubmit = async (itemData: Item) => {
    setLoading(true);
    try {
      if (isEdit) {
        const url = `/api/establishments/${establishmentId}/items/${item.id}`;
        await axios.patch(url, itemData);
        notifySuccess("Saved!");
      } else {
        const url = `/api/establishments/${establishmentId}/items`;
        await axios.post(url, itemData);
        notifySuccess("Created!");
      }
      onSuccess();
    } catch (e: any) {
      notifyError(`Operation failed: ${getErrorMessage(e)}`);
    }
    setLoading(false);
  };

  return (
    <form>
      <Flex style={{ flexDirection: "column" }}>
        <label htmlFor="name">Name</label>
        <input
          data-testid="name-field"
          defaultValue={isEdit ? item.name : ""}
          {...register("name", { required: true })}
        />
        {errors.name && <ErrorMessage>Name is required</ErrorMessage>}
        <Flex style={{ alignItems: "flex-end", flexDirection: "column" }}>
          <Button
            disabled={loading}
            style={{ maxWidth: "10em" }}
            onClick={handleSubmit(onSubmit)}
          >
            {loading ? "..." : "Submit"}
          </Button>
        </Flex>
      </Flex>
    </form>
  );
};

export default ItemForm;
