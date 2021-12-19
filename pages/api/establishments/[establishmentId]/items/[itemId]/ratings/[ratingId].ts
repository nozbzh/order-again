import type { NextApiRequest, NextApiResponse } from "next";

import {
  respondServerError,
  respondUnprocessableEntity,
  respondNotFound,
  respondOk,
  respondUnauthorized,
} from "helpers/Responses";
import { getUserIdFromJWT } from "helpers/jwt";

import Rating from "models/Rating";

async function updateRating(req: NextApiRequest, res: NextApiResponse) {
  const { ratingId } = req.query;
  const { value, note } = req.body;
  // const userId = getUserIdFromSession()

  // `String(ratingId)` to coerce `string | string[]` to `string`
  const rating = await Rating.update({
    id: String(ratingId),
    value,
    note,
  });

  return respondOk(res, rating);
}

async function findRating(req: NextApiRequest, res: NextApiResponse) {
  const { ratingId } = req.query;
  const rating = await Rating.find(String(ratingId));

  return respondOk(res, rating);
}

async function deleteRating(req: NextApiRequest, res: NextApiResponse) {
  const { ratingId } = req.query;
  const deleted = await Rating.delete(String(ratingId));

  if (!deleted) {
    return respondServerError(res, new Error("could not delete rating"));
  }

  return respondOk(res, { deleted: true });
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

    switch (method) {
      case "GET":
        return await findRating(req, res);
      case "PATCH":
        return await updateRating(req, res);
      case "DELETE":
        return await deleteRating(req, res);
      default:
        res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (e: any) {
    if (e.name === "NotFoundError") {
      return respondNotFound(res, e.message);
    }

    if (e.name === "InvalidInputError") {
      return respondUnprocessableEntity(res, e.message);
    }

    return respondServerError(res, e);
  }
}
