import React from "react";
import { Navigate, Outlet } from "react-router-dom";

type Props = {};

const AuthLayout = (props: Props) => {
  let token = localStorage.getItem("token") || "";
  if (!token) {
    return <Navigate to="/login" />;
  }
  return (
    <div>
      <h2>Auth</h2>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
