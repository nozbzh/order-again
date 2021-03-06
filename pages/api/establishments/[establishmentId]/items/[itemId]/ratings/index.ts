import type { NextApiRequest, NextApiResponse } from "next";

import Rating from "models/Rating";
import {
  respondOk,
  respondServerError,
  respondUnprocessableEntity,
  respondCreated,
  respondUnauthorized,
} from "helpers/Responses";
import { getUserIdFromJWT } from "helpers/jwt";

async function createRating(req: NextApiRequest, res: NextApiResponse) {
  const { itemId } = req.query;
  const { value, note } = req.body;

  const userId = await getUserIdFromJWT(req);

  const rating = await Rating.create({
    userId: userId as string,
    itemId: itemId as string,
    value,
    note,
  });

  return respondCreated(res, rating);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const userId = await getUserIdFromJWT(req);
    if (!userId) {
      return respondUnauthorized(res);
    }

    const { method } = req;
    const { itemId } = req.query;

    switch (method) {
      case "GET":
        const ratings = await Rating.all(itemId as string);
        return respondOk(res, ratings);
      case "POST":
        return await createRating(req, res);
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (e: any) {
    if (e.name === "InvalidInputError") {
      return respondUnprocessableEntity(res, e.message);
    }

    return respondServerError(res, e);
  }
}
