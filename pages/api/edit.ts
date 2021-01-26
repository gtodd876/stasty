import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDb } from "../../db/database";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { db } = await connectToDb();
  const { itemId, title, keywords } = req.body;
  await db
    .collection("screenshots")
    .updateOne({ _id: itemId }, { $set: { title: title, keywords: keywords } });

  const result = await db
    .collection("screenshots")
    .find({ _id: itemId })
    .toArray();
  res.json(result);
};
