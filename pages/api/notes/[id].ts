import type { NextApiRequest, NextApiResponse } from "next";

import {
  respondServerError,
  respondUnprocessableEntity,
  respondNotFound,
  respondOk
} from "helpers/Responses";

import Note from "models/Note";

async function updateNote(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { title, body } = req.body;

  // `String(id)` to coerce `string | string[]` to `string`
  const note = await Note.update({ id: String(id), title, body });

  return respondOk(res, note);
}

async function findNote(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const note = await Note.find(String(id));

  return respondOk(res, note);
}

async function deleteNote(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const deleted = await Note.delete(String(id));

  if (!deleted) {
    return respondServerError(res, new Error("could not delete note"));
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
        return await findNote(req, res);
      case "PATCH":
        return await updateNote(req, res);
      case "DELETE":
        return await deleteNote(req, res);
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

// curl --request PATCH -d '{"title": "old note", "body": "tangoose"}' -H 'Content-Type: application/json' http://localhost:3000/api/notes/e664525a-64f9-430d-adce-8636ef5efe8c
// curl -X "DELETE" -H 'Content-Type: application/json' http://localhost:3000/api/notes/9664a173-215e-446a-845b-00c3953d246e

// curl -d '{"title": "booh", "body": "ya"}' -H 'Content-Type: application/json' http://localhost:3000/api/notes
