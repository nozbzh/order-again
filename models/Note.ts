import { v4 as uuid } from "uuid";

import { deleteEntry, insertEntry, findEntry, getAllEntries } from "data";
import { InvalidInputError, NotFoundError } from "errors";
import logger from "utils/logger";
import { NoteInterface, NoteInput } from "types";

interface NotesData {
  [key: string]: NoteInterface;
}

interface NotesInternalData {
  id?: string;
  lastUpdatedAt?: number;
}

class Note {
  title: string;
  body: string;
  id: string;
  lastUpdatedAt: number;

  constructor(attributes: NoteInput & NotesInternalData) {
    const { title, body, id, lastUpdatedAt } = attributes;

    if (!title && !body) {
      throw new InvalidInputError("Title and body are required");
    }

    if (!title) {
      throw new InvalidInputError("Title is required");
    }

    if (!body) {
      throw new InvalidInputError("Body is required");
    }

    if (!id) {
      this.id = uuid();
    } else {
      this.id = id;
    }

    this.title = title;
    this.body = body;
    this.lastUpdatedAt = lastUpdatedAt;
  }

  asJson(): NoteInterface {
    const { id, title, body, lastUpdatedAt } = this;
    return { id, title, body, lastUpdatedAt };
  }

  static async create(note: NoteInput): Promise<NoteInterface> {
    try {
      const newNote = new this(note);
      newNote.lastUpdatedAt = +Date.now();

      const jsonNote = newNote.asJson();

      await insertEntry<NoteInterface>(jsonNote);

      return jsonNote;
    } catch (e: any) {
      logger.error(e);
      throw e;
    }
  }

  static async find(id: string): Promise<NoteInterface> {
    try {
      const noteData = await findEntry<NoteInterface>(id);

      if (!noteData) {
        throw new NotFoundError("note");
      }

      return noteData;
    } catch (e: any) {
      logger.error(e);
      throw e;
    }
  }

  static async all(): Promise<NoteInterface[]> {
    try {
      const allNotes = await getAllEntries<NotesData>();

      return Object.values(allNotes).sort(
        (a, b) => b.lastUpdatedAt - a.lastUpdatedAt
      );
    } catch (e: any) {
      logger.error(e);
      throw e;
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      // make sure note exists (will throw if does not exist)
      await this.find(id);
      await deleteEntry<NoteInterface>(id);

      return true;
    } catch (e: any) {
      logger.error(e);
      throw e;
    }
  }

  static async update(note: NoteInterface): Promise<NoteInterface> {
    try {
      // make sure note exists (will throw if does not exist)
      const existingNote = await this.find(note.id);

      const updatedNote = new this({ ...existingNote, ...note });
      updatedNote.lastUpdatedAt = +Date.now();
      const jsonNote = updatedNote.asJson();

      await insertEntry<NoteInterface>(jsonNote);
      return jsonNote;
    } catch (e: any) {
      logger.error(e);
      throw e;
    }
  }
}

export default Note;
