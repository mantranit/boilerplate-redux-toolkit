import React from "react";
import { Button as MuiButton, ButtonProps } from "@mui/material";

type Props = {} & ButtonProps;

const Button = (props: Props) => {
  return <MuiButton {...props} />;
};

export default Button;
