import * as React from "react";

import { NoteInterface } from "types";

interface NoteProps {
  note: NoteInterface;
}

const Note = ({ note }: NoteProps): JSX.Element => {
  return (
    <div>
      <h1>{note.title}</h1>
      <p>{note.body}</p>
    </div>
  );
};

export default Note;
