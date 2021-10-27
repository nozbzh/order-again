import { v4 as uuid } from "uuid";

import Note from "../../models/Note";
import * as dataFunctions from "../../data";
import logger from "../../utils/logger";
import { InvalidInputError, NotFoundError } from "errors";

jest.mock("../../data");
jest.mock("uuid");
jest.mock("../../utils/logger", () => ({
  error: jest.fn()
}));

const { insertEntry, findEntry, getAllEntries, deleteEntry } = dataFunctions;

const dateInMs = 12345;
const id = "abc";

beforeEach(() => {
  uuid.mockImplementation(() => id);
  jest.spyOn(Date, "now").mockImplementation(() => dateInMs);
});

afterEach(() => {
  jest.clearAllMocks();
});

const err = new Error("not again!");
const title = "hi";
const body = "world";

const mockNote = {
  title,
  body,
  id,
  lastUpdatedAt: dateInMs
};

describe("Note", () => {
  describe("constructor", () => {
    describe("with invalid attributes", () => {
      it("throws a InvalidInputError when title and body are missing", () => {
        expect(() => {
          // @ts-ignore
          new Note({});
        }).toThrow("Title and body are required");
      });

      it("throws a InvalidInputError when title is missing", () => {
        expect(() => {
          // @ts-ignore
          new Note({ body });
        }).toThrow("Title is required");
      });

      it("throws a InvalidInputError when body is missing", () => {
        expect(() => {
          // @ts-ignore
          new Note({ title });
        }).toThrow("Body is required");
      });
    });
    it("generates an id if it is missing", () => {
      const note = new Note({ title, body });
      expect(note.id).toEqual(id);
    });

    it("does not generate an id if it is already present", () => {
      const note = new Note({ title, body, id: "someId" });
      expect(note.id).toEqual("someId");
    });

    it("assigns lastUpdatedAt if is passed in", () => {
      const note = new Note({ title, body, lastUpdatedAt: 789 });
      expect(note.lastUpdatedAt).toEqual(789);
    });
  });

  describe("asJson", () => {
    it("returns an object with all the attributes", () => {
      const note = new Note({ title, body, id: "theId", lastUpdatedAt: 789 });
      expect(note).toEqual({ title, body, id: "theId", lastUpdatedAt: 789 });
    });
  });

  describe("static methods", () => {
    describe("update", () => {
      const updatedAttributes = { id, title: "hello" };

      describe("when the note is found", () => {
        beforeEach(() => {
          (findEntry as jest.Mock).mockImplementation(() => {
            return Promise.resolve(mockNote);
          });
        });

        it("calls `insertEntry` with expected arguments", async () => {
          jest.spyOn(Date, "now").mockImplementation(() => dateInMs + 10);

          await Note.update(updatedAttributes);

          expect(insertEntry).toHaveBeenCalledWith({
            title: "hello",
            body,
            id,
            lastUpdatedAt: dateInMs + 10
          });
        });

        it("returns the note with new lastUpdatedAt, updated attributes and other attributes untouched", async () => {
          jest.spyOn(Date, "now").mockImplementation(() => dateInMs + 10);
          const note = await Note.update(updatedAttributes);

          expect(note).toEqual({
            title: "hello",
            body,
            id,
            lastUpdatedAt: dateInMs + 10
          });
        });
      });

      describe("when the note is not found", () => {
        beforeEach(() => {
          (findEntry as jest.Mock).mockImplementation(() => {
            return Promise.resolve(undefined);
          });
        });

        it("throws a NotFoundError", async () => {
          await expect(Note.update(updatedAttributes)).rejects.toThrow(
            new NotFoundError("note")
          );
        });
      });

      describe("when there is an error", () => {
        it("logs the error before re-throwing it", async () => {
          (findEntry as jest.Mock).mockImplementation(() => {
            throw err;
          });

          await expect(Note.update(updatedAttributes)).rejects.toThrow(err);
          expect(logger.error).toHaveBeenCalledWith(err);
        });
      });
    });
    describe("create", () => {
      describe("when creation is a success", () => {
        it("calls `insertEntry` with expected arguments", () => {
          Note.create({ title, body });
          expect(insertEntry).toHaveBeenCalledWith({
            title,
            body,
            id,
            lastUpdatedAt: dateInMs
          });
        });

        it("returns the note", async () => {
          const note = await Note.create({ title, body });
          expect(note).toEqual({
            title,
            body,
            id,
            lastUpdatedAt: dateInMs
          });
        });
      });
      describe("when there is an error", () => {
        it("logs the error before re-throwing it", async () => {
          (insertEntry as jest.Mock).mockImplementation(() => {
            throw err;
          });

          await expect(Note.create({ title, body })).rejects.toThrow(err);
          expect(logger.error).toHaveBeenCalledWith(err);
        });
      });
    });

    describe("find", () => {
      describe("when the note is found", () => {
        beforeEach(() => {
          (findEntry as jest.Mock).mockImplementation(() => {
            return Promise.resolve(mockNote);
          });
        });

        it("calls `findEntry` with expected arguments", () => {
          Note.find(id);
          expect(findEntry).toHaveBeenCalledWith(id);
        });

        it("returns the note", async () => {
          const note = await Note.find(id);
          expect(note).toEqual(mockNote);
        });
      });

      describe("when the note is not found", () => {
        beforeEach(() => {
          (findEntry as jest.Mock).mockImplementation(() => {
            return Promise.resolve(undefined);
          });
        });

        it("throws a NotFoundError", async () => {
          await expect(Note.find(id)).rejects.toThrow(
            new NotFoundError("note")
          );
        });
      });

      describe("when there is an error", () => {
        it("logs the error before re-throwing it", async () => {
          (findEntry as jest.Mock).mockImplementation(() => {
            throw err;
          });

          await expect(Note.find(id)).rejects.toThrow(err);
          expect(logger.error).toHaveBeenCalledWith(err);
        });
      });
    });

    describe("all", () => {
      describe("when there is data", () => {
        const oldestNote = {
          title,
          body,
          id,
          lastUpdatedAt: dateInMs
        };

        const oldNote = {
          title,
          body,
          id: `${id}1`,
          lastUpdatedAt: dateInMs + 1
        };

        const middleAgedNote = {
          title,
          body,
          id: `${id}2`,
          lastUpdatedAt: dateInMs + 2
        };

        const teenageNote = {
          title,
          body,
          id: `${id}3`,
          lastUpdatedAt: dateInMs + 3
        };

        const newestNote = {
          title,
          body,
          id: `${id}4`,
          lastUpdatedAt: dateInMs + 4
        };

        const mockNotes = {
          [oldestNote.id]: oldestNote,
          [oldNote.id]: oldNote,
          [middleAgedNote.id]: middleAgedNote,
          [teenageNote.id]: teenageNote,
          [newestNote.id]: newestNote
        };

        beforeEach(() => {
          (getAllEntries as jest.Mock).mockImplementation(() => {
            return Promise.resolve(mockNotes);
          });
        });

        it("calls `getAllEntries`", () => {
          Note.all();
          expect(getAllEntries).toHaveBeenCalled();
        });

        it("returns the notes sorted by most recently edited", async () => {
          const notes = await Note.all();
          expect(notes[0].id).toEqual(newestNote.id);
          expect(notes[4].id).toEqual(oldestNote.id);
        });
      });

      describe("when there is an error", () => {
        it("logs the error before re-throwing it", async () => {
          (getAllEntries as jest.Mock).mockImplementation(() => {
            throw err;
          });

          await expect(Note.all()).rejects.toThrow(err);
          expect(logger.error).toHaveBeenCalledWith(err);
        });
      });
    });

    describe("delete", () => {
      describe("when the note is found", () => {
        beforeEach(() => {
          (findEntry as jest.Mock).mockImplementation(() => {
            return Promise.resolve(mockNote);
          });
        });

        it("calls `deleteEntry` with expected arguments", async () => {
          await Note.delete(id);
          expect(deleteEntry).toHaveBeenCalledWith(id);
        });

        it("returns true", async () => {
          const returnValue = await Note.delete(id);
          expect(returnValue).toEqual(true);
        });
      });

      describe("when the note is not found", () => {
        beforeEach(() => {
          (findEntry as jest.Mock).mockImplementation(() => {
            return Promise.resolve(undefined);
          });
        });

        it("throws a NotFoundError", async () => {
          await expect(Note.delete(id)).rejects.toThrow(
            new NotFoundError("note")
          );
        });
      });

      describe("when there is an error", () => {
        it("logs the error before re-throwing it", async () => {
          (findEntry as jest.Mock).mockImplementation(() => {
            return Promise.resolve(mockNote);
          });

          (deleteEntry as jest.Mock).mockImplementation(() => {
            throw err;
          });

          await expect(Note.delete(id)).rejects.toThrow(err);
          expect(logger.error).toHaveBeenCalledWith(err);
        });
      });
    });
  });
});
