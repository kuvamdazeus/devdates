import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import Cookies from "cookies";

export default function validate(req: NextApiRequest, res: NextApiResponse) {
  const cookies = new Cookies(req, res);
  const token = cookies.get("token");
  let userId: string | null = null;

  try {
    userId = jwt.verify(token as string, process.env.JWT_SECRET as string) as string;
  } catch (err) {
    return res.status(401).send("");
  }

  return userId;
}
