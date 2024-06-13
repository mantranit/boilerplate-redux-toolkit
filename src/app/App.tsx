import * as React from "react";
import Container from "@mui/material/Container";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AuthLayout from "./layouts/AuthLayout";
import Home from "./pages/Home";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

export default function App() {
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
  const analytics = getAnalytics(app);
  console.log("analytics", analytics);

  const router = createBrowserRouter([
    {
      path: "/",
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          element: <AuthLayout />,
          children: [
            {
              path: "dashboard",
              element: <Dashboard />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <div className="max-w-lg m-auto p-4">
      <div className="border border-solid border-slate-300 p-5 rounded-lg">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}
