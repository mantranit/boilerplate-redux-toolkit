import { createAsyncThunk } from "@reduxjs/toolkit";
import http from "./http";
import {
  collection,
  Firestore,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

export type TListDeposits = {
  db: Firestore;
};

export const getDeposits = createAsyncThunk(
  "bets/getDeposits",
  async ({ db }: TListDeposits) => {
    let querySnapshot = await getDocs(
      query(collection(db, "deposits"), orderBy("deposit"))
    );
    let listDeposits: any[] = [];
    querySnapshot.forEach((doc) => {
      const dataDeposits = doc.data();
      listDeposits.push({
        ...dataDeposits,
        id: doc.id,
      });
    });
    return listDeposits;
  }
);
