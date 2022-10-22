import { PrismaClient } from "@prisma/client";

let client: PrismaClient;

export default async function getClient() {
  if (client) return client;

  client = new PrismaClient();
  await client.$connect();
  return client;
}
