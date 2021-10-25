import React from "react";

import Note from "../../data/Note";
import NoteDetail from "../../components/NoteDetail";

import { NoteInterface } from "../../types";
import logger from "utils/logger";

interface NotePageProps {
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

const NotePage = ({ note }: NotePageProps): JSX.Element => {
  return <NoteDetail note={note} />;
};

export default NotePage;
