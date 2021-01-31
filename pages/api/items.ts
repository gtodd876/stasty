import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { connectToDb } from "../../db/database";
import { getAllItems } from "../../db/item";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { db } = await connectToDb();

  const session = await getSession({ req });
  if (!session) {
    throw new Error();
  }
  if (req.method === "GET") {
    const result = await getAllItems(db, session.user.id);
    res.status(200).json(result);
  }
  if (req.method === "POST") {
    res.status(401).end();
    return;
  }
};
