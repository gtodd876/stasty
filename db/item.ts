import { Db } from "mongodb";
import { nanoid } from "nanoid";

type Item = {
  title: string;
  keywords: string[];
  imageUrl: string;
};

export const createItem = async (db: Db, item: Item) => {
  const newItem = await db
    .collection("screenshots")
    .insertOne({
      _id: nanoid(),
      ...item,
      createdAt: new Date().toDateString(),
    })
    .then(({ ops }) => ops[0]);

  return newItem;
};

export const getAllItems = async (db: Db, userId: string) => {
  const result = await db
    .collection("screenshots")
    .find({ createdBy: userId })
    .toArray();
  return result;
};

export const getItem = async (db: Db, itemId: string) => {
  return await db.collection("screenshots").find({ _id: itemId });
};

export const updateItem = async (db: Db, itemId: string, updates: any) => {
  await db
    .collection("screenshots")
    .updateOne({ _id: itemId }, { $set: updates });
  return await db.collection("screenshots").find({ _id: itemId });
};
