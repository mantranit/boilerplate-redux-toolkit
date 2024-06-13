import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AuthLayout from "./layouts/AuthLayout";
import Home from "./pages/Home";
import Nations from "./pages/Nations";
import FirebaseProvider from "./contexts/FirebaseProvider";

export default function App() {
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
            {
              path: "nations",
              element: <Nations />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <div className="p-4">
      <div className="border border-solid border-slate-300 p-5 rounded-lg">
        <FirebaseProvider>
          <RouterProvider router={router} />
        </FirebaseProvider>
      </div>
    </div>
  );
}
