import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDb } from "../../db/database";
import cloudinary from "cloudinary";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "DELETE") {
    const { db } = await connectToDb();
    const { id } = req.body;
    const result = await db.collection("screenshots").deleteOne({ _id: id });

    res.json(result);
  }

  if (req.method === "POST") {
    const { publicId } = req.body;
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    cloudinary.v2.uploader.destroy(publicId, (error, result) => {
      if (error) console.error(error);
    });
  }
};
