import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "cloudinary";

export default (req: NextApiRequest, res: NextApiResponse) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.v2.utils.api_sign_request(
    {
      timestamp,
      upload_preset: "ml_default",
    },
    process.env.CLOUDINARY_API_SECRET
  );
  res.status(200).json({ signature, timestamp });
};
