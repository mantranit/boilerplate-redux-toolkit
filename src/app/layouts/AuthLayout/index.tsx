import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { setUserCredential } from "../../../redux/authSlice";
import { toast } from "react-toastify";

type Props = {};

const AuthLayout = (props: Props) => {
  let token = localStorage.getItem("token") || "";
  if (!token) {
    return <Navigate to="/login" />;
  }

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.userCredential);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUserCredential(user.toJSON()));
      } else {
        localStorage.removeItem("token");
        dispatch(setUserCredential(null));
        navigate("/login");
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    signOut(auth).finally(() => {
      localStorage.removeItem("token");
      dispatch(setUserCredential(null));
      navigate("/login");
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2>Hello, {user?.displayName || user?.email}</h2>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
