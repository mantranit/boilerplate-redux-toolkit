import React from "react";
import { TextField as MuiTextField, TextFieldProps } from "@mui/material";
import { Control, Controller } from "react-hook-form";

type Props = {
  control?: Control<any>;
  rules?: any;
  name: string;
} & TextFieldProps;

const TextField = (props: Props) => {
  const { control, rules, name, ...restProps } = props;
  if (control) {
    return (
      <Controller
        control={control}
        rules={rules}
        name={name}
        render={({ field, fieldState }) => (
          <MuiTextField
            fullWidth
            {...field}
            {...restProps}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
    );
  }
  return <MuiTextField fullWidth {...props} />;
};

export default TextField;
