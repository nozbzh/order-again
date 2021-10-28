import * as React from "react";

import NoteForm from "components/NoteForm";
import logger from "utils/logger";
import Note from "models/Note";
import { NoteInterface } from "types";

interface EditNoteProps {
  note: NoteInterface;
}

export async function getServerSideProps(context) {
  const {
    params: { id }
  } = context;

  let note = {};

  try {
    note = await Note.find(id);
  } catch (e: any) {
    logger.error(e);
  }

  return {
    props: { note }
  };
}

const EditNote = ({ note }: EditNoteProps): JSX.Element => {
  return <NoteForm note={note} />;
};

export default EditNote;
