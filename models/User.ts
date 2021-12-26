import prisma from "lib/prisma";
import { InvalidInputError, NotFoundError } from "errors";
import logger from "utils/logger";
import { User as PrismaUser } from "@prisma/client";

// TODO: error handling and Types/Interfaces
class User {
  id: string;
  name: string;
  email: string;

  constructor(attributes: Partial<PrismaUser>) {
    const { id, name, email } = attributes;

    if (!email) {
      throw new InvalidInputError("Email is required");
    }

    if (id) {
      this.id = id;
    }

    this.name = name;
    this.email = email;
  }

  static async create(user: {
    name: string;
    email: string;
  }): Promise<PrismaUser> {
    try {
      return await prisma.user.create({
        data: new this(user),
      });
    } catch (e: any) {
      logger.error(e);
      throw e;
    }
  }

  static async find(id: string): Promise<PrismaUser> {
    try {
      const user = await prisma.user.findFirst({
        where: { id },
      });

      if (!user) {
        throw new NotFoundError("user");
      }

      return user;
    } catch (e: any) {
      logger.error(e);
      throw e;
    }
  }

  static async findByEmail(email: string): Promise<PrismaUser> {
    try {
      return await prisma.user.findFirst({
        where: { email },
      });
    } catch (e: any) {
      logger.error(e);
      throw e;
    }
  }
}

export default User;
