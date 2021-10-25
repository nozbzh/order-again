import * as React from "react";
// import styled from 'styled-components';
import axios from "axios";

import NotePreview from "./NotePreview";
// import { NoteInterface } from "../types";

// interface NoteListProps {
//   notes: NoteInterface[];
// }

const NoteList = (): JSX.Element => {
  const [loading, setLoading] = React.useState(false);
  const [notes, setNotes] = React.useState([]);

  const fetchNotes = async () => {
    setLoading(true);
    const url = "/api/notes";

    try {
      const response = await axios.get(url);
      setNotes(response?.data?.payload || []);
    } catch (e: any) {
      // notifyError(`Error while fetching app configs: ${getErrorMessage(err)}`);
      throw e;
    }

    setLoading(false);
  };

  React.useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <>
      {loading ? (
        "loading..."
      ) : (
        <div>
          {notes.length
            ? notes.map(note => (
                <NotePreview onDelete={fetchNotes} key={note.id} note={note} />
              ))
            : "no notes yet"}
        </div>
      )}
    </>
  );
};

export default NoteList;
