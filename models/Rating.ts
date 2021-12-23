import prisma from "lib/prisma";
import { InvalidInputError, NotFoundError } from "errors";
import logger from "utils/logger";
import { NOT_FOUND_CODE } from "helpers/constants";
import { RatingInternalData, RatingInterface } from "types";

// TODO: error handling and Types/Interfaces
class Rating {
  id: string;
  note?: string;
  value: string;
  itemId: string;
  userId: string;

  constructor(attributes: Partial<RatingInterface & RatingInternalData>) {
    const { id, value, note, itemId, userId } = attributes;

    if (!value) {
      throw new InvalidInputError("Rating is required");
    }

    if (id) {
      this.id = id;
    }

    this.value = value;
    this.note = note;
    this.itemId = itemId;
    this.userId = userId;
  }

  static async create(rating: {
    value: string;
    note?: string;
    itemId: string;
    userId: string;
  }): Promise<any> {
    try {
      return await prisma.rating.create({
        data: new this(rating),
      });
    } catch (e: any) {
      logger.error(e);
      throw e;
    }
  }

  static async find(id: string): Promise<any> {
    try {
      const rating = await prisma.rating.findFirst({
        where: { id },
      });

      if (!rating) {
        throw new NotFoundError("rating");
      }

      return rating;
    } catch (e: any) {
      logger.error(e);
      throw e;
    }
  }

  static async findByUserAndItem(userId: string, itemId: string): Promise<any> {
    try {
      const rating = await prisma.rating.findFirst({
        where: { itemId, userId },
        select: { id: true, value: true, note: true },
      });

      if (!rating) {
        throw new NotFoundError("rating");
      }

      return rating;
    } catch (e: any) {
      logger.error(e);
      throw e;
    }
  }

  static async all(itemId: string): Promise<any[]> {
    try {
      return await prisma.rating.findMany({ where: { itemId } });
    } catch (e: any) {
      logger.error(e);
      throw e;
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      await prisma.rating.delete({ where: { id } });

      return true;
    } catch (e: any) {
      if (e.code === NOT_FOUND_CODE) {
        throw new NotFoundError("rating");
      }
      logger.error(e);
      throw e;
    }
  }

  static async update(
    rating: Partial<{
      id: string;
      value: string;
      note?: string;
    }>
  ): Promise<any> {
    try {
      return await prisma.rating.update({
        where: { id: rating.id },
        data: rating,
      });
    } catch (e: any) {
      if (e.code === NOT_FOUND_CODE) {
        throw new NotFoundError("rating");
      }
      logger.error(e);
      throw e;
    }
  }
}

export default Rating;
