import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import styled from "styled-components";

import { EstablishmentInterface } from "types";
import { notifyError, notifySuccess, getErrorMessage } from "utils/ui";
import { Flex, Button } from "components/StyledComponents";

interface EstablishmentFormProps {
  establishment?: EstablishmentInterface;
}

const ErrorMessage = styled.span`
  color: red;
`;

const NoteForm = ({ establishment }: EstablishmentFormProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const isEdit = Boolean(establishment);

  const onSubmit = async (establishmentData: EstablishmentInterface) => {
    setLoading(true);
    try {
      if (isEdit) {
        const url = `/api/establishments/${establishment.id}`;
        await axios.patch(url, establishmentData);
        notifySuccess("Saved!");
      } else {
        const url = `/api/establishments`;
        await axios.post(url, establishmentData);
        notifySuccess("Created!");
      }
      router.push("/");
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
          defaultValue={isEdit ? establishment.name : ""}
          {...register("name", { required: true })}
        />
        {errors.name && <ErrorMessage>Name is required</ErrorMessage>}

        <label htmlFor="address">Address</label>
        <input
          data-testid="address-field"
          defaultValue={isEdit ? establishment.address : ""}
          {...register("address", { required: true })}
        />
        {errors.address && <ErrorMessage>Address is required</ErrorMessage>}

        <Flex style={{ alignItems: "flex-end", flexDirection: "column" }}>
          <Button style={{ maxWidth: "10em" }} onClick={handleSubmit(onSubmit)}>
            {loading ? "..." : "Submit"}
          </Button>
        </Flex>
      </Flex>
    </form>
  );
};

export default NoteForm;
