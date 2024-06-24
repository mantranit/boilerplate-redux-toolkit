import React from "react";
import {
  MenuItem,
  TextField as MuiTextField,
  TextFieldProps,
} from "@mui/material";
import { Control, Controller } from "react-hook-form";

type Props = {
  control?: Control<any>;
  rules?: any;
  name: string;
  options?: { value: any; label: string }[];
} & TextFieldProps;

const AppTextField = (props: Props) => {
  const { options = [], ...restProps } = props;
  if (options.length === 0) {
    return <MuiTextField {...restProps} />;
  }
  return (
    <MuiTextField select {...restProps}>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </MuiTextField>
  );
};

const TextField = (props: Props) => {
  const { control, rules, name, ...restProps } = props;
  if (control) {
    return (
      <Controller
        control={control}
        rules={rules}
        name={name}
        render={({ field: { ref, ...restField }, fieldState }) => (
          <AppTextField
            fullWidth
            {...restField}
            {...restProps}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
    );
  }
  return <AppTextField {...props} />;
};

export default TextField;
