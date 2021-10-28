import React from "react";
import axios from "axios";
import get from "lodash/get";

import { notifyError, getErrorMessage } from "utils/ui";
import NotePreview from "./NotePreview";

const NoteList = (): JSX.Element => {
  const [loading, setLoading] = React.useState(false);
  const [notes, setNotes] = React.useState([]);

  const fetchNotes = async () => {
    setLoading(true);
    const url = "/api/notes";

    try {
      const response = await axios.get(url);
      setNotes(get(response, "data.payload", []));
    } catch (e: any) {
      notifyError(`Could not fetch notes: ${getErrorMessage(e)}`);
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
        <>
          {notes.length
            ? notes.map(note => (
                <NotePreview onDelete={fetchNotes} key={note.id} note={note} />
              ))
            : "No notes yet"}
        </>
      )}
    </>
  );
};

export default NoteList;
