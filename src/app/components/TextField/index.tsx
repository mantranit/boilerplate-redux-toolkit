import React from "react";
import { TextField as MuiTextField, TextFieldProps } from "@mui/material";

type Props = {} & TextFieldProps;

const TextField = (props: Props) => {
  return <MuiTextField {...props} />;
};

export default TextField;
