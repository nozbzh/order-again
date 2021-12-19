import type { NextApiRequest, NextApiResponse } from "next";

import Establishment from "models/Establishment";
import {
  respondOk,
  respondServerError,
  respondUnprocessableEntity,
  respondCreated,
  respondUnauthorized,
} from "helpers/Responses";
import { getUserIdFromJWT } from "helpers/jwt";

async function createEstablishment(req: NextApiRequest, res: NextApiResponse) {
  const { name, address } = req.body;

  const establishment = await Establishment.create({ name, address });

  return respondCreated(res, establishment);
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
        const establishments = await Establishment.all();
        return respondOk(res, establishments);
      case "POST":
        return await createEstablishment(req, res);
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
