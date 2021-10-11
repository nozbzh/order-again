import * as React from "react";

import Note from "./Note";
import { NoteInterface } from "types";

interface NoteListProps {
  notes: NoteInterface[];
}

const NoteList = ({ notes = [] }: NoteListProps): JSX.Element => {
  return (
    <div>
      <h1>My Notes</h1>
      {notes.length ? notes.map(note => <Note note={note} />) : "no notes yet"}
    </div>
  );
};

export default NoteList;
