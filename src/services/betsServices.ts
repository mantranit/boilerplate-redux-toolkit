import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  Firestore,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

export type TFirestore = {
  db: Firestore;
};

export type TGetBetsByUser = TFirestore & {
  userId: string;
};

export const getDeposits = createAsyncThunk(
  "bets/getDeposits",
  async ({ db }: TFirestore) => {
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

export const getBetsByUser = createAsyncThunk(
  "bets/getBetsByUser",
  async ({ db, userId }: TGetBetsByUser) => {
    const querySnapshot = await getDocs(
      query(collection(db, "bets"), where("user_id", "==", userId))
    );
    let listBets: any[] = [];
    querySnapshot.forEach((doc) => {
      const dataBets = doc.data();
      listBets.push({
        ...dataBets,
        id: doc.id,
      });
    });
    return listBets;
  }
);

export const getBets = createAsyncThunk(
  "bets/getBets",
  async ({ db }: TFirestore) => {
    const querySnapshot = await getDocs(query(collection(db, "bets")));
    let listBets: any[] = [];
    querySnapshot.forEach((doc) => {
      const dataBets = doc.data();
      listBets.push({
        ...dataBets,
        id: doc.id,
      });
    });
    return listBets;
  }
);
