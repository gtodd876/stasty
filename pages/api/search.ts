import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDb } from "../../db/database";
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { db } = await connectToDb();
  const { searchTerms } = req.body;
  const result = await db
    .collection("screenshots")
    .find({
      $text: {
        $search: searchTerms,
      },
    })
    .toArray();
  res.json(result);
};
