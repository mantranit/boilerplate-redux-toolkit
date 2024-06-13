import React from "react";
import TextField from "../../components/TextField";
import {
  createUserWithEmailAndPassword,
  getAuth,
  UserCredential,
} from "firebase/auth";
import { setRole, setUserCredential } from "../../../redux/authSlice";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../redux/store";
import { toast } from "react-toastify";
import Button from "../../components/Button";
import { jwtDecode } from "jwt-decode";

type Props = {};

const Register = (props: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const handleOnSuccess = (data: any) => {
    const { email, password } = data;
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential: UserCredential) => {
        const user = userCredential.user.toJSON();
        const token = await userCredential.user.getIdToken(false);
        const decode: any = jwtDecode(token);
        dispatch(setUserCredential(user));
        dispatch(setRole(decode.role));
        localStorage.setItem("token", token);
        toast.success("Register successful.");
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
        <div className="flex gap-5">
          <Button type="submit" variant="contained">
            Register
          </Button>
          <Button onClick={() => navigate("/login")}>Login</Button>
        </div>
      </div>
    </form>
  );
};

export default Register;
