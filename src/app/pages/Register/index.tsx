import React from "react";
import TextField from "../../components/TextField";
import {
  createUserWithEmailAndPassword,
  getAuth,
  UserCredential,
} from "firebase/auth";
import { setUserCredential } from "../../../redux/authSlice";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../redux/store";
import { toast } from "react-toastify";
import Button from "../../components/Button";

type Props = {};

const Register = (props: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { control, handleSubmit } = useForm();
  const handleOnSuccess = (data: any) => {
    const { email, password } = data;
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
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
            Register
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Register;
