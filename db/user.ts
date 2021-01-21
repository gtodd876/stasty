import { Db } from "mongodb";

export const getUserById = async (db: Db, userId: string) => {
  return db.collection("users").findOne({ _id: userId });
};
