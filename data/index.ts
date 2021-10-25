import { promises as fs } from "fs";
import logger from "utils/logger";

function getDataFilePath(): string {
  return `${process.cwd()}/data/NotesData.json`;
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

export async function getAllEntries<T>() {
  return getData<T>();
}

export async function deleteEntry<T>(id: string): Promise<void> {
  const allData = await getData<{ [key: string]: T }>();
  delete allData[id];
  await setData<{ [key: string]: T }>(allData);
}

export async function insertEntry<T>(data: T): Promise<T> {
  const allData = await getData<{ [key: string]: T }>();
  // TODO: how to handle this case?
  allData[data.id] = data;
  await setData<{ [key: string]: T }>(allData);
  return data;
}

export async function findEntry<T>(id: string): Promise<T> {
  const allData = await getData<{ [key: string]: T }>();
  return allData[id];
}
