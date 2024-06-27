import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  Firestore,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

export type TListMatchs = {
  db: Firestore;
};

export const getMatchs = createAsyncThunk(
  "bets/getMatchs",
  async ({ db }: TListMatchs) => {
    let querySnapshot = await getDocs(
      query(collection(db, "matchs"), orderBy("time"))
    );
    let listMatchs: any[] = [];
    querySnapshot.forEach((doc) => {
      const dataMatchs = doc.data();
      listMatchs.push({
        ...dataMatchs,
        id: doc.id,
      });
    });
    return listMatchs;
  }
);
