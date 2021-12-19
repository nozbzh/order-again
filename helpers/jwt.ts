import { getToken } from "next-auth/jwt";

export async function getUserIdFromJWT(req) {
  const secret = process.env.JWT_SECRET;
  const token = await getToken({ req, secret });

  return token?.userId;
}
