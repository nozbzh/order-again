import type { NextApiRequest, NextApiResponse } from "next";

import {
  respondServerError,
  respondUnprocessableEntity,
  respondNotFound,
  respondOk,
} from "helpers/Responses";

import Establishment from "models/Establishment";

async function updateEstablishment(req: NextApiRequest, res: NextApiResponse) {
  const { establishmentId } = req.query;
  const { name, address } = req.body;

  // `String(establishmentId)` to coerce `string | string[]` to `string`
  const establishment = await Establishment.update({
    id: String(establishmentId),
    name,
    address,
  });

  return respondOk(res, establishment);
}

async function findEstablishment(req: NextApiRequest, res: NextApiResponse) {
  const { establishmentId } = req.query;
  const establishment = await Establishment.find(String(establishmentId));

  return respondOk(res, establishment);
}

async function deleteEstablishment(req: NextApiRequest, res: NextApiResponse) {
  const { establishmentId } = req.query;
  const deleted = await Establishment.delete(String(establishmentId));

  if (!deleted) {
    return respondServerError(res, new Error("could not delete establishment"));
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
        return await findEstablishment(req, res);
      case "PATCH":
        return await updateEstablishment(req, res);
      case "DELETE":
        return await deleteEstablishment(req, res);
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
