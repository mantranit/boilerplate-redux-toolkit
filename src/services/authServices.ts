import { createAsyncThunk } from "@reduxjs/toolkit";
import http from "./http";
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
} from "firebase/firestore";

export type TFirestore = {
  db: Firestore;
};

export type TRegisterPayload = {
  email: string;
  password: string;
  displayName: string;
};

export type TGetCurrentUser = TFirestore & {
  userId: string;
};

export const register = createAsyncThunk(
  "auth/register",
  async (payload: TRegisterPayload) => {
    const response = await http.post("register", payload);
    return response.data;
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async ({ db, userId }: TGetCurrentUser) => {
    const docSnap = await getDoc(doc(db, "users", userId));

    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  }
);

export const getUsers = createAsyncThunk(
  "auth/getUsers",
  async ({ db }: TFirestore) => {
    let querySnapshot = await getDocs(query(collection(db, "users")));
    let listUsers: any[] = [];
    querySnapshot.forEach((doc: any) => {
      const dataUsers = doc.data();
      listUsers.push({
        ...dataUsers,
        id: doc.id,
      });
    });
    return listUsers;
  }
);
