import { v4 as uuid } from "uuid";

import prisma from "lib/prisma";
import { deleteEntry, insertEntry, findEntry, getAllEntries } from "data";
import { InvalidInputError, NotFoundError } from "errors";
import logger from "utils/logger";
import { NoteInterface, NoteInput } from "types";

interface NotesData {
  [key: string]: NoteInterface;
}

interface NotesInternalData {
  id?: number;
  lastUpdatedAt?: Date;
}

class Note {
  title: string;
  body: string;
  id: number;
  lastUpdatedAt: Date;

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

    if (title.length > 150) {
      throw new InvalidInputError("Title max length is 150 characters");
    }

    if (body.length > 5000) {
      throw new InvalidInputError("Body max length is 5000 characters");
    }

    if (id) {
      this.id = id;
    }

    this.title = title;
    this.body = body;
    this.lastUpdatedAt = lastUpdatedAt;
  }

  asJson(): NoteInterface {
    const { id, title, body, lastUpdatedAt } = this;
    return { id, title, body, lastUpdatedAt: Date.parse(lastUpdatedAt) };
  }

  static async create(note: NoteInput): Promise<NoteInterface> {
    try {
      const newNote = new this(note);

      const jsonNote = newNote.asJson();

      await prisma.note.create({ data: jsonNote });

      return jsonNote;
    } catch (e: any) {
      logger.error(e);
      throw e;
    }
  }

  static async find(id: number): Promise<NoteInterface> {
    try {
      const note = await prisma.note.findFirst({
        where: { id: +id },
      });

      // const noteData = await findEntry<NoteInterface>(id);

      if (!note) {
        throw new NotFoundError("note");
      }

      return new this(note).asJson();
    } catch (e: any) {
      logger.error(e);
      throw e;
    }
  }

  static async all(): Promise<NoteInterface[]> {
    try {
      const allNotes = await prisma.note.findMany({
        orderBy: {
          lastUpdatedAt: "desc",
        },
      });

      return allNotes;
    } catch (e: any) {
      logger.error(e);
      throw e;
    }
  }

  static async delete(id: number): Promise<boolean> {
    try {
      // make sure note exists (will throw if does not exist)
      await this.find(id);
      // await deleteEntry<NoteInterface>(id);
      await prisma.note.delete({ where: { id: +id } });

      return true;
    } catch (e: any) {
      logger.error(e);
      throw e;
    }
  }

  static async update(note: Partial<NoteInterface>): Promise<NoteInterface> {
    try {
      const { id } = note;
      delete note.id;

      await this.find(id);

      // const updatedNote = new this({ ...existingNote, ...note });
      // // updatedNote.lastUpdatedAt = +Date.now();
      // updatedNote.lastUpdatedAt = new Date().toISOString();
      // const jsonNote = updatedNote.asJson();

      // await insertEntry<NoteInterface>(jsonNote);

      const updateNote = await prisma.note.update({
        where: { id: +id },
        data: note,
      });

      return updateNote;
    } catch (e: any) {
      logger.error(e);
      throw e;
    }
  }
}

export default Note;
