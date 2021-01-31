import { Db, MongoClient } from "mongodb";
import { NextApiRequest } from "next";

export interface UserSession {
  id: string;
  image: string;
  email: string;
  name: string;
}

import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
  }
}

export interface Request extends NextApiRequest {
  db: Db;
  dbClient: MongoClient;
  user: { email: string; id: string };
}
