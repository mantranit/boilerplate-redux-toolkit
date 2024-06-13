import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { setRole, setUserCredential } from "../../../redux/authSlice";
import { jwtDecode } from "jwt-decode";

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
    const unsubscribe = onAuthStateChanged(auth, async (userCredential) => {
      if (userCredential) {
        const user = userCredential.toJSON();
        const token = await userCredential.getIdToken(false);
        const decode: any = jwtDecode(token);
        dispatch(setUserCredential(user));
        dispatch(setRole(decode.role));
      } else {
        localStorage.removeItem("token");
        dispatch(setUserCredential(null));
        dispatch(setRole("user"));
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
      dispatch(setRole("user"));
      navigate("/login");
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="m-0">Hello, {user?.displayName || user?.email}</h2>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
