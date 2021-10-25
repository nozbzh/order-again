import Result from "./Response";
import logger from "utils/logger";
import type { NextApiResponse } from "next";

export function respondNotFound(resp: NextApiResponse, message = "not found") {
  return resp.status(404).json(Result.fail({ message }));
}

export function respondServerError(resp: NextApiResponse, error: Error) {
  logger.error(error);
  const msg = typeof error === "string" ? error : error.message;
  return resp.status(500).json(Result.fail({ message: msg }));
}

export function respondUnprocessableEntity(
  resp: NextApiResponse,
  message = "unprocessable entity"
) {
  return resp.status(422).json(Result.fail({ message }));
}

export function respondOk(resp: NextApiResponse, responseBody: any) {
  return resp.status(200).json(Result.ok(responseBody));
}

export function respondCreated(resp: NextApiResponse, responseBody: any) {
  return resp.status(201).json(Result.ok(responseBody));
}
