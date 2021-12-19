import type { NextApiRequest, NextApiResponse } from "next";

import Note from "models/Note";
import {
  respondOk,
  respondServerError,
  respondUnprocessableEntity,
  respondCreated,
  respondUnauthorized,
} from "helpers/Responses";
import { getUserIdFromJWT } from "helpers/jwt";

async function createNote(req: NextApiRequest, res: NextApiResponse) {
  const { title, body } = req.body;

  const note = await Note.create({ title, body });

  return respondCreated(res, note);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method } = req;
    const userId = await getUserIdFromJWT(req);
    if (!userId) {
      return respondUnauthorized(res);
    }

    switch (method) {
      case "GET":
        const notes = await Note.all();
        return respondOk(res, notes);
      case "POST":
        return await createNote(req, res);
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
