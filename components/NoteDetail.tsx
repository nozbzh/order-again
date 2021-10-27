import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import startCase from "lodash/startCase";

import { notifyError, notifySuccess, getErrorMessage } from "utils/ui";
import { NoteInterface } from "types";
import { Button, SubTitle, Flex, Body, Heading } from "./StyledComponents";

interface NoteDetailProps {
  note: NoteInterface;
}

const NoteDetail = ({
  note: { title, body, lastUpdatedAt, id }
}: NoteDetailProps): JSX.Element => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleEdit = () => {
    router.push(`/notes/edit/${id}`);
  };

  const handleDelete = async () => {
    const url = `/api/notes/${id}`;
    setLoading(true);
    try {
      await axios.delete(url);
      notifySuccess("Deleted!");
      router.push("/");
    } catch (e: any) {
      notifyError(`Could not delete note: ${getErrorMessage(e)}`);
    }
    setLoading(false);
  };

  return (
    <>
      <Heading>{startCase(title)}</Heading>
      <SubTitle>{`Last updated at: ${new Date(
        lastUpdatedAt
      ).toLocaleString()}`}</SubTitle>
      <Body>{body}</Body>
      <Flex style={{ display: "flex" }}>
        <Button onClick={handleEdit}>Edit</Button>
        <Button onClick={handleDelete} disabled={loading}>
          {loading ? "..." : "Delete"}
        </Button>
      </Flex>
    </>
  );
};

export default NoteDetail;
