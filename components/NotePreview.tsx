import React from "react";
import styled from "styled-components";
import axios from "axios";
import startCase from "lodash/startCase";
import { useRouter } from "next/router";
import Link from "next/link";

import { notifyError, notifySuccess, getErrorMessage } from "utils/ui";
import { NoteInterface } from "types";
import { Button, Flex, SubTitle } from "./StyledComponents";

interface NoteProps {
  note: NoteInterface;
  onDelete: () => void;
}

const Wrapper = styled.div`
  cursor: pointer;
  border: 1px solid #ccc;
  padding: 1em;
  margin: 1em 0;
  box-shadow: 0 0px 5px rgb(0 0 0 / 20%);
`;

const Truncate = styled.p`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NotePreview = ({
  note: { title, body, id },
  onDelete
}: NoteProps): JSX.Element => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleEdit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    router.push(`/notes/edit/${id}`);
  };

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const url = `/api/notes/${id}`;
    setLoading(true);
    try {
      await axios.delete(url);
      notifySuccess("Deleted!");
      onDelete();
    } catch (e: any) {
      notifyError(`Could not delete note: ${getErrorMessage(e)}`);
    }
    setLoading(false);
  };

  return (
    <Link href={`/notes/${id}`} passHref>
      <Wrapper>
        <SubTitle>{startCase(title)}</SubTitle>
        <Truncate>{body}</Truncate>
        <Flex>
          <Button onClick={handleEdit}>Edit</Button>
          <Button onClick={handleDelete} danger={true} disabled={loading}>
            {loading ? "..." : "Delete"}
          </Button>
        </Flex>
      </Wrapper>
    </Link>
  );
};

export default NotePreview;
