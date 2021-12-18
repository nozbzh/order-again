import prisma from "lib/prisma";
import { InvalidInputError, NotFoundError } from "errors";
import logger from "utils/logger";
import {
  EstablishmentInterface,
  EstablishmentInternalData,
  ItemInterface,
} from "types";

const NOT_FOUND_CODE = "P2025";

// TODO: error handling and Types/Interfaces

// interface NotesData {
//   [key: string]: NoteInterface;
// }

// interface NotesInternalData {
//   id?: number;
//   lastUpdatedAt?: Date;
// }

class Establishment {
  id: string;
  name: string;
  address: string;
  // latitude: string;
  // longitude: string;
  items: ItemInterface[];

  constructor(
    attributes: Partial<EstablishmentInterface & EstablishmentInternalData>
  ) {
    const { id, name, address } = attributes;

    if (!name && !address) {
      throw new InvalidInputError("Name and address are required");
    }

    if (!name) {
      throw new InvalidInputError("Name is required");
    }

    if (!address) {
      throw new InvalidInputError("Address is required");
    }

    // if (title.length > 150) {
    //   throw new InvalidInputError("Title max length is 150 characters");
    // }

    // if (body.length > 5000) {
    //   throw new InvalidInputError("Body max length is 5000 characters");
    // }

    if (id) {
      this.id = id;
    }

    this.name = name;
    this.address = address;
  }

  // asJson(): NoteInterface {
  //   const { id, title, body, lastUpdatedAt } = this;
  //   return { id, title, body, lastUpdatedAt: Date.parse(lastUpdatedAt) };
  // }

  static async create(establishment: {
    name: string;
    address: string;
  }): Promise<any> {
    try {
      return await prisma.establishment.create({
        data: new this(establishment),
      });
    } catch (e: any) {
      logger.error(e);
      throw e;
    }
  }

  static async find(id: string): Promise<any> {
    try {
      const establishment = await prisma.establishment.findFirst({
        where: { id },
      });

      if (!establishment) {
        throw new NotFoundError("establishment");
      }

      return establishment;
    } catch (e: any) {
      logger.error(e);
      throw e;
    }
  }

  static async all(): Promise<any[]> {
    try {
      return await prisma.establishment.findMany({});
    } catch (e: any) {
      logger.error(e);
      throw e;
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      await prisma.establishment.delete({ where: { id } });

      return true;
    } catch (e: any) {
      if (e.code === NOT_FOUND_CODE) {
        throw new NotFoundError("establishment");
      }
      logger.error(e);
      throw e;
    }
  }

  static async update(
    establishment: Partial<{
      id: string;
      name: string;
      address: string;
    }>
  ): Promise<any> {
    try {
      return await prisma.establishment.update({
        where: { id: establishment.id },
        data: establishment,
      });
    } catch (e: any) {
      if (e.code === NOT_FOUND_CODE) {
        throw new NotFoundError("establishment");
      }
      logger.error(e);
      throw e;
    }
  }
}

export default Establishment;
