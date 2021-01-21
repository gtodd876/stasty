import { connectToDb } from "../db/database";

declare global {
  namespace NodeJS {
    interface Global {
      mongo: any;
    }
  }
}

export default async function database(req, res, next) {
  const { db, dbClient } = await connectToDb();
  req.db = db;
  req.dbClient = dbClient;

  next();
}
