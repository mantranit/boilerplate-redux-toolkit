import * as React from "react";
import Container from "@mui/material/Container";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AuthLayout from "./layouts/AuthLayout";
import Home from "./pages/Home";

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
          element: <AuthLayout />,
          children: [
            {
              path: "dashboard",
              element: <Dashboard />,
            },
          ],
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login",
          element: <Login />,
        },
      ],
    },
  ]);

  return (
    <Container maxWidth="sm">
      <RouterProvider router={router} />
    </Container>
  );
}
