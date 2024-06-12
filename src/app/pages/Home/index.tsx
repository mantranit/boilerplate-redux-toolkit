import React from "react";
import Button from "../../components/Button";
import { Link } from "@mui/material";

type Props = {};

const Home = (props: Props) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full">
        <Button variant="contained" fullWidth href="/login" component={Link}>
          Login
        </Button>
        <div className="h-4"></div>
        <Button variant="outlined" fullWidth href="/register" component={Link}>
          Register
        </Button>
      </div>
    </div>
  );
};

export default Home;
