import { FirebaseApp, initializeApp } from "firebase/app";
import React, { createContext, ReactNode, useContext } from "react";

type Props = {
  children: ReactNode;
};

type ContextState = { app: FirebaseApp };
const FirebaseContext = createContext<ContextState | null>(null);

const FirebaseProvider = (props: Props) => {
  const firebaseConfig = {
    apiKey: "AIzaSyD5771yu1faTGNh62ff7kZZPLOBvY1oy1Q",
    authDomain: "wata-bet88-471cd.firebaseapp.com",
    projectId: "wata-bet88-471cd",
    storageBucket: "wata-bet88-471cd.appspot.com",
    messagingSenderId: "427234757550",
    appId: "1:427234757550:web:4b4411ae27819e1c8a163f",
    measurementId: "G-X4NYB7HSB7",
  };
  const app = initializeApp(firebaseConfig);

  return (
    <FirebaseContext.Provider value={{ app }}>
      {props.children}
    </FirebaseContext.Provider>
  );
};

export const useFirebaseApp = () => {
  const context = useContext(FirebaseContext);
  if (context === null) {
    throw new Error("useFirebaseApp must be used within a FirebaseProvider");
  }
  return context.app;
};

export default FirebaseProvider;
