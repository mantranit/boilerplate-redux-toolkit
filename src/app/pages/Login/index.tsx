import React from "react";
import { useForm } from "react-hook-form";
import TextField from "../../components/TextField";
import Button from "../../components/Button";
import {
  getAuth,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { useAppDispatch } from "../../../redux/store";
import { setUserCredential } from "../../../redux/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type Props = {};

const Login = (props: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { control, handleSubmit } = useForm();
  const handleOnSuccess = (data: any) => {
    const { email, password } = data;
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential: UserCredential) => {
        console.log(userCredential);
        const user = userCredential.user.toJSON();
        const token = await userCredential.user.getIdToken(false);
        dispatch(setUserCredential(user));
        localStorage.setItem("token", token);
        toast.success("Login successful.");
        navigate("/dashboard");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  return (
    <form onSubmit={handleSubmit(handleOnSuccess)}>
      <div className="flex flex-col gap-5">
        <TextField
          control={control}
          rules={{
            required: "This field is required.",
          }}
          name="email"
          label="Email"
        />
        <TextField
          control={control}
          rules={{
            required: "This field is required.",
          }}
          type="password"
          name="password"
          label="Password"
        />
        <div>
          <Button type="submit" variant="contained">
            Login
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Login;
