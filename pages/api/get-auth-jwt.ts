import { NextApiRequest, NextApiResponse } from "next";
import db from "../../firebase-admin";
import validate from "../../utils/api/validate";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = validate(req, res);
  if (!userId) return;

  const token = await db.auth().createCustomToken(userId);
  return res.status(200).json({ token });
}
