import type { NextApiRequest, NextApiResponse } from "next";

import Item from "models/Item";
import {
  respondOk,
  respondServerError,
  respondUnprocessableEntity,
  respondCreated,
} from "helpers/Responses";

async function createItem(req: NextApiRequest, res: NextApiResponse) {
  const { establishmentId } = req.query;
  const { name } = req.body;

  const item = await Item.create({ establishmentId, name });

  return respondCreated(res, item);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method } = req;
    const { establishmentId } = req.query;

    switch (method) {
      case "GET":
        const items = await Item.all(establishmentId);
        return respondOk(res, items);
      case "POST":
        return await createItem(req, res);
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
