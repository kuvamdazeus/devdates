import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default function validate(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.body;
  const userId = jwt.verify(token as string, process.env.JWT_SECRET as string);

  if (!userId) return res.status(401).send("");
  return userId as string;
}
