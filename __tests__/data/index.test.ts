import { promises as fs } from "fs";
import * as dataFunctions from "../../data";

const {
  insertEntry,
  findEntry,
  getAllEntries,
  deleteEntry,
  deleteAll,
  getDataFilePath
} = dataFunctions;

const id = "1";
const name = "one";
const entry = { id, name };

beforeAll(async () => {
  await deleteAll();
});

afterAll(async () => {
  await deleteAll();
});

describe("Data access", () => {
  describe("insertEntry", () => {
    it("writes the entry to file", async () => {
      await insertEntry(entry);

      const rawData = await fs.readFile(getDataFilePath(), "utf8");
      const parsed = JSON.parse(rawData);

      const retrievedEntry = parsed[id];
      expect(retrievedEntry).toEqual(entry);
    });

    it("throws an error when the entry has no id property", async () => {
      const invalidEntry = { name };
      // @ts-ignore
      await expect(insertEntry(invalidEntry)).rejects.toThrow(
        "objects need an id to be persisted"
      );
    });
  });

  describe("getAllEntries", () => {
    it("returns all entries", async () => {
      const otherEntry = { id: "2", name: "two" };

      await insertEntry(entry);
      await insertEntry(otherEntry);
      const entries = await getAllEntries();

      expect(entries).toEqual({
        [entry.id]: entry,
        [otherEntry.id]: otherEntry
      });
    });
  });

  describe("findEntry", () => {
    it("finds the entry", async () => {
      await insertEntry(entry);
      const retrievedEntry = await findEntry(id);

      expect(retrievedEntry).toEqual(entry);
    });
  });

  describe("deleteEntry", () => {
    it("deletes the entry", async () => {
      await insertEntry(entry);
      let retrievedEntry = await findEntry(id);

      expect(retrievedEntry).not.toBeUndefined();

      await deleteEntry(id);
      retrievedEntry = await findEntry(id);

      expect(retrievedEntry).toBeUndefined();
    });
  });

  describe("deleteAll", () => {
    it("deletes all entries", async () => {
      const otherEntry = { id: "2", name: "two" };

      await insertEntry(entry);
      await insertEntry(otherEntry);

      const retrievedEntry = await findEntry(id);
      expect(retrievedEntry).toEqual(entry);

      await deleteAll();

      const allEntries = await getAllEntries();

      expect(allEntries).toEqual({});
    });
  });
});
