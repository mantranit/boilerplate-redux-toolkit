import React, { useState } from "react";
import TextField from "../../components/TextField";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
  UserCredential,
} from "firebase/auth";
import { setRole, setUserCredential } from "../../../redux/authSlice";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../redux/store";
import { toast } from "react-toastify";
import Button from "../../components/Button";
import { jwtDecode } from "jwt-decode";
import { useFirebaseApp } from "../../contexts/FirebaseProvider";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { IconButton, InputAdornment, Link } from "@mui/material";
import { NavigateNext, Visibility, VisibilityOff } from "@mui/icons-material";

type Props = {};

const Register = (props: Props) => {
  const app = useFirebaseApp();
  const db = getFirestore(app);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
      displayName: "",
    },
  });
  const handleOnSuccess = (data: any) => {
    const { email, password, displayName } = data;
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential: UserCredential) => {
        await updateProfile(userCredential.user, {
          displayName,
        });
        await setDoc(doc(db, "users", userCredential.user.uid), {
          displayName,
        });
        const user = userCredential.user.toJSON();
        const token = await userCredential.user.getIdToken(false);
        const decode: any = jwtDecode(token);
        dispatch(setUserCredential(user));
        dispatch(setRole(decode.role));
        localStorage.setItem("token", token);
        toast.success("Register successful.");
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  return (
    <div>
      <div className="text-center p-6">
        <img
          src="https://upload.wikimedia.org/wikipedia/vi/thumb/b/b2/Logo_Gi%E1%BA%A3i_v%C3%B4_%C4%91%E1%BB%8Bch_b%C3%B3ng_%C4%91%C3%A1_ch%C3%A2u_%C3%82u_2024.png/220px-Logo_Gi%E1%BA%A3i_v%C3%B4_%C4%91%E1%BB%8Bch_b%C3%B3ng_%C4%91%C3%A1_ch%C3%A2u_%C3%82u_2024.png"
          alt=""
          width={120}
        />
      </div>
      <form onSubmit={handleSubmit(handleOnSuccess)}>
        <div className="max-w-80 m-auto">
          <TextField
            className="mb-6"
            control={control}
            rules={{
              required: "This field is required.",
            }}
            name="displayName"
            label="Full Name"
          />
          <TextField
            className="mb-6"
            control={control}
            rules={{
              required: "This field is required.",
            }}
            name="email"
            label="Email"
          />
          <TextField
            className="mb-6"
            control={control}
            rules={{
              required: "This field is required.",
            }}
            type={showPassword ? "text" : "password"}
            name="password"
            label="Password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <div className="flex gap-5">
            <Button type="submit" variant="contained">
              Register
            </Button>
            <Button component={Link} href="/login">
              Login <NavigateNext />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
