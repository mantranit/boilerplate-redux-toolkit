import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AuthLayout from "./layouts/AuthLayout";
import FirebaseProvider from "./contexts/FirebaseProvider";
import Bet from "./pages/Bet";
import BetDetails from "./pages/BetDetails";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

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
            {
              path: "/add",
              element: <BetDetails />,
            },
            {
              path: "/matchs/:match_id",
              element: <BetDetails />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <div className="p-4">
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <FirebaseProvider>
          <RouterProvider router={router} />
        </FirebaseProvider>
      </LocalizationProvider>
    </div>
  );
}
