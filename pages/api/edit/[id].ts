import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDb } from "../../../db/database";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { db } = await connectToDb();
  const { id } = req.query;
  const { title, keywords, notes } = req.body;
  await db
    .collection("screenshots")
    .updateOne(
      { _id: id },
      { $set: { title: title, keywords: keywords, notes: notes } }
    );

  const result = await db.collection("screenshots").find({ _id: id }).toArray();
  res.json(result);
};
