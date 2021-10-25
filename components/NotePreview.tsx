import React from "react";
import styled from "styled-components";
import axios from "axios";
import startCase from "lodash/startCase";
import { useRouter } from "next/router";
import Link from "next/link";

import { NoteInterface } from "../types";

interface NoteProps {
  note: NoteInterface;
  onDelete: () => void;
}

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
      onDelete();
    } catch (e: any) {
      throw e;
    }
    setLoading(false);
  };

  // const actions = (
  //   <div style={{ display: "flex" }}>
  //     <button onClick={handleEdit}>Edit</button>
  //     <button onClick={handleDelete} disabled={loading}>
  //       {loading ? "..." : "Delete"}
  //     </button>
  //   </div>
  // );

  return (
    <Link href={`/notes/${id}`}>
      <div>
        <h3>{startCase(title)}</h3>
        <Truncate>{body}</Truncate>
        <div style={{ display: "flex" }}>
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete} disabled={loading}>
            {loading ? "..." : "Delete"}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default NotePreview;
