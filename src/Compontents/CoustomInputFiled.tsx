import { TextField, type SxProps, type Theme } from "@mui/material";
import React from "react";

interface CustomInputProps {
  name?: string;
  label?: string;
  value?: any;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  variant?: "standard" | "outlined" | "filled";
  sx?: SxProps<Theme>;
  helperText?: React.ReactNode;
}

const CustomInputField: React.FC<CustomInputProps> = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  type = "text",
  placeholder,
  error = false,
  disabled = false,
  fullWidth = true,
  required = false,
  autoFocus = false,
  variant = "outlined",
  sx,
  helperText,
}) => {
  return (
    <TextField
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      type={type}
      placeholder={placeholder}
      error={error}
      helperText={helperText}
      disabled={disabled}
      fullWidth={fullWidth}
      required={required}
      autoFocus={autoFocus}
      variant={variant}
      margin="normal"
      sx={{
        height: 1,
        "& .MuiInputBase-root": {
          height: 50,
          fontSize: "14px",
        },
        "& input": {
          padding: "10px 10px",
        },
        ...sx,
      }}
    />
  );
};

export default CustomInputField;
