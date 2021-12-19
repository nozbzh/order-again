import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

import Note from "models/Note";
import {
  respondOk,
  respondServerError,
  respondUnprocessableEntity,
  respondCreated,
} from "helpers/Responses";

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

    const secret = process.env.JWT_SECRET;
    const token = await getToken({ req, secret });

    if (token) {
      console.log("JSON Web Token", JSON.stringify(token, null, 2));
    } else {
      console.log("No token");
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
