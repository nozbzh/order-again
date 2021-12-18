import type { NextApiRequest, NextApiResponse } from "next";

import {
  respondServerError,
  respondUnprocessableEntity,
  respondNotFound,
  respondOk,
} from "helpers/Responses";

import Item from "models/Item";

async function updateItem(req: NextApiRequest, res: NextApiResponse) {
  const { itemId } = req.query;
  const { name } = req.body;

  // `String(itemId)` to coerce `string | string[]` to `string`
  const item = await Item.update({
    id: String(itemId),
    name,
  });

  return respondOk(res, item);
}

async function findItem(req: NextApiRequest, res: NextApiResponse) {
  const { itemId } = req.query;
  const item = await Item.find(String(itemId));

  return respondOk(res, item);
}

async function deleteItem(req: NextApiRequest, res: NextApiResponse) {
  const { itemId } = req.query;
  const deleted = await Item.delete(String(itemId));

  if (!deleted) {
    return respondServerError(res, new Error("could not delete item"));
  }

  return respondOk(res, { deleted: true });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method } = req;

    switch (method) {
      case "GET":
        return await findItem(req, res);
      case "PATCH":
        return await updateItem(req, res);
      case "DELETE":
        return await deleteItem(req, res);
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
