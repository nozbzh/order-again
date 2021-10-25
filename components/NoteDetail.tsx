import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import startCase from "lodash/startCase";

import { NoteInterface } from "types";

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
      router.push("/");
    } catch (e: any) {
      throw e;
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>{startCase(title)}</h1>
      <h4>{`Last updated at: ${new Date(lastUpdatedAt).toLocaleString()}`}</h4>
      <p>{body}</p>
      <div style={{ display: "flex" }}>
        <button onClick={handleEdit}>Edit</button>
        <button onClick={handleDelete} disabled={loading}>
          {loading ? "..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default NoteDetail;
