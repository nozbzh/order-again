import { promises as fs } from "fs";
import { v4 as uuid } from "uuid";

import { InvalidInputError, NotFoundError } from "../errors";
import logger from "../utils/logger";
import { NoteInterface, NoteInput } from "../types";

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

  constructor(input: NoteInput & NotesInternalData) {
    const { title, body, id, lastUpdatedAt } = input;

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

  private static get getDataFileName(): string {
    return `${process.cwd()}/data/NotesData.json`;
  }

  private static async getData(): Promise<NotesData> {
    try {
      const rawData = await fs.readFile(this.getDataFileName, "utf8");
      return JSON.parse(rawData);
    } catch (e: any) {
      logger.error(e);
      return {};
    }
  }

  private static async setData(data): Promise<void> {
    await fs.writeFile(this.getDataFileName, JSON.stringify(data));
  }

  static async create(note: NoteInput): Promise<NoteInterface> {
    try {
      const data = await this.getData();
      const newNote = new this(note);
      newNote.lastUpdatedAt = +Date.now();

      data[newNote.id] = newNote;
      await this.setData(data);

      return newNote.asJson();
    } catch (e: any) {
      logger.error(e);
      throw e;
    }
  }

  static async find(id: string): Promise<NoteInterface> {
    try {
      const data = await this.getData();
      const noteData = data[id];

      if (!noteData) {
        throw new NotFoundError("note");
      }

      return new this(noteData).asJson();
    } catch (e: any) {
      logger.error(e);
      throw e;
    }
  }

  static async all(): Promise<NoteInterface[]> {
    try {
      const allData = await this.getData();

      return Object.values(allData)
        .sort((a, b) => b.lastUpdatedAt - a.lastUpdatedAt)
        .map(data => new this(data).asJson());
    } catch (e: any) {
      logger.error(e);
      throw e;
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const data = await this.getData();

      // make sure note exists (will throw if does not exist)
      await this.find(id);

      delete data[id];
      await this.setData(data);

      return true;
    } catch (e: any) {
      logger.error(e);
      throw e;
    }
  }

  static async update(note: NoteInterface): Promise<NoteInterface> {
    try {
      const data = await this.getData();
      const existingNote = await this.find(note.id);

      if (!existingNote) {
        throw new NotFoundError("note");
      }

      const updatedNote = new this({ ...existingNote, ...note });
      updatedNote.lastUpdatedAt = +Date.now();
      data[updatedNote.id] = updatedNote;
      await this.setData(data);

      return updatedNote.asJson();
    } catch (e: any) {
      logger.error(e);
      throw e;
    }
  }
}

export default Note;
