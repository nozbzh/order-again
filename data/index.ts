import { promises as fs } from "fs";
import logger from "utils/logger";

interface Insertable {
  id: string;
}

export function getDataFilePath(): string {
  // Quick and dirty way to test while keeping main file clean
  const path =
    process.env.NODE_ENV === "test"
      ? "__tests__/data/TestNotesData.json"
      : "data/NotesData.json";
  return `${process.cwd()}/${path}`;
}

async function getData<T>(): Promise<T> {
  try {
    const rawData = await fs.readFile(getDataFilePath(), "utf8");
    return JSON.parse(rawData);
  } catch (e: any) {
    logger.error(e);
    return {} as T;
  }
}

async function setData<T>(data: T): Promise<void> {
  await fs.writeFile(getDataFilePath(), JSON.stringify(data));
}

export async function getAllEntries<T>(): Promise<T> {
  return getData<T>();
}

export async function deleteAll(): Promise<void> {
  return setData({});
}

export async function deleteEntry<T>(id: string): Promise<void> {
  const allData = await getData<{ [key: string]: T }>();
  delete allData[id];
  await setData<{ [key: string]: T }>(allData);
}

export async function insertEntry<T extends Insertable>(data: T): Promise<T> {
  if (!data.id) {
    throw new Error("objects need an id to be persisted");
  }

  const allData = await getData<{ [key: string]: T }>();
  allData[data.id] = data;
  await setData<{ [key: string]: T }>(allData);
  return data;
}

export async function findEntry<T>(id: string): Promise<T | undefined> {
  const allData = await getData<{ [key: string]: T }>();
  return allData[id];
}
