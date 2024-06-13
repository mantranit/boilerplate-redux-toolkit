import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AuthLayout from "./layouts/AuthLayout";
import FirebaseProvider from "./contexts/FirebaseProvider";
import Bet from "./pages/Bet";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      children: [
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
              path: "/",
              element: <Bet />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <div className="p-4">
      <FirebaseProvider>
        <RouterProvider router={router} />
      </FirebaseProvider>
    </div>
  );
}
