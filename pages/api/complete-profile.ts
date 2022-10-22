import { NextApiRequest, NextApiResponse } from "next";
import getClient from "../../prisma-client";
import validate from "../../utils/api/validate";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { data } = req.body;

  const userId = validate(req, res);
  if (!userId) return;

  const client = await getClient();
  const updatedUser = await client.user.update({ where: { id: userId }, data });

  return res.status(200).json(updatedUser);
}
