import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "cloudinary";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "DELETE") {
    const { id } = req.query;
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    cloudinary.v2.uploader.destroy(
      `stasty/${id as string}`,
      (error, result) => {
        if (error) console.error(error);
        if (result) {
          res.send(200);
        }
      }
    );
  }
};
