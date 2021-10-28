import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import styled from "styled-components";

import { NoteInterface } from "types";
import { notifyError, notifySuccess, getErrorMessage } from "utils/ui";
import { Flex, Button } from "components/StyledComponents";

interface NoteFormProps {
  note?: NoteInterface;
}

const BodyInput = styled.textarea`
  min-height: 200px;
  margin-bottom: 1em;
`;

const ErrorMessage = styled.span`
  color: red;
`;

const NoteForm = ({ note }: NoteFormProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const isEdit = Boolean(note);

  const onSubmit = async noteData => {
    setLoading(true);
    try {
      if (isEdit) {
        const url = `/api/notes/${note.id}`;
        await axios.patch(url, noteData);
        notifySuccess("Saved!");
      } else {
        const url = `/api/notes`;
        await axios.post(url, noteData);
        notifySuccess("Created!");
      }
      router.push("/");
    } catch (e: any) {
      notifyError(`Operation failed: ${getErrorMessage(e)}`);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex style={{ flexDirection: "column" }}>
        <label htmlFor="title">Title</label>
        <input
          data-testid="title-field"
          defaultValue={isEdit ? note.title : ""}
          {...register("title", { required: true })}
        />
        {errors.title && <ErrorMessage>Title is required</ErrorMessage>}

        <label htmlFor="body">Body</label>
        <BodyInput
          data-testid="body-field"
          defaultValue={isEdit ? note.body : ""}
          {...register("body", { required: true })}
        />
        {errors.body && <ErrorMessage>Body is required</ErrorMessage>}

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
