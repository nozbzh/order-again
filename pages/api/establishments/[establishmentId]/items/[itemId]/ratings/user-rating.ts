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
        const rating = await Rating.findByUserAndItem(
          userId as string,
          itemId as string
        );
        return respondOk(res, rating);
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (e: any) {
    return respondServerError(res, e);
  }
}
