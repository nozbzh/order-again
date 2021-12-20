import type { NextApiRequest, NextApiResponse } from "next";

import Establishment from "models/Establishment";
import {
  respondOk,
  respondServerError,
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

    switch (method) {
      case "GET":
        const { q } = req.query;
        const establishments = await Establishment.findByNameAndType(q);
        return respondOk(res, establishments);
      default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (e: any) {
    return respondServerError(res, e);
  }
}
