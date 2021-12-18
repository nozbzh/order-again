import prisma from "lib/prisma";
import { InvalidInputError, NotFoundError } from "errors";
import logger from "utils/logger";
import { NOT_FOUND_CODE } from "helpers/constants";
import { ItemInterface, ItemInternalData, RatingInterface } from "types";

// TODO: error handling and Types/Interfaces

// interface NotesData {
//   [key: string]: NoteInterface;
// }

// interface NotesInternalData {
//   id?: number;
//   lastUpdatedAt?: Date;
// }

class Item {
  id: string;
  name: string;
  establishmentId: string;
  ratings: RatingInterface[];

  constructor(attributes: Partial<ItemInterface & ItemInternalData>) {
    const { id, name, establishmentId } = attributes;

    if (!name) {
      throw new InvalidInputError("Name is required");
    }

    if (id) {
      this.id = id;
    }

    this.name = name;
    this.establishmentId = establishmentId;
  }

  static async create(item: {
    name: string;
    establishmentId: string;
  }): Promise<any> {
    try {
      return await prisma.item.create({
        data: new this(item),
      });
    } catch (e: any) {
      logger.error(e);
      throw e;
    }
  }

  static async find(id: string): Promise<any> {
    try {
      const item = await prisma.item.findFirst({
        where: { id },
      });

      if (!item) {
        throw new NotFoundError("item");
      }

      return item;
    } catch (e: any) {
      logger.error(e);
      throw e;
    }
  }

  static async all(establishmentId: string): Promise<any[]> {
    try {
      return await prisma.item.findMany({ where: { establishmentId } });
    } catch (e: any) {
      logger.error(e);
      throw e;
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      await prisma.item.delete({ where: { id } });

      return true;
    } catch (e: any) {
      if (e.code === NOT_FOUND_CODE) {
        throw new NotFoundError("item");
      }
      logger.error(e);
      throw e;
    }
  }

  static async update(
    item: Partial<{
      id: string;
      name: string;
      address: string;
    }>
  ): Promise<any> {
    try {
      return await prisma.item.update({
        where: { id: item.id },
        data: item,
      });
    } catch (e: any) {
      if (e.code === NOT_FOUND_CODE) {
        throw new NotFoundError("item");
      }
      logger.error(e);
      throw e;
    }
  }
}

export default Item;
