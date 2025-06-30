// CustomInputField.tsx
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
  error?: any;
  touched?: any;
  disabled?: boolean;
  fullWidth?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  variant?: "standard" | "outlined" | "filled";
  sx?: SxProps<Theme>;
  helperText?: any;
}

const CustomInputField: React.FC<CustomInputProps> = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  type = "text",
  placeholder,
  error = "",
  touched = false,
  disabled = false,
  fullWidth = true,
  required = false,
  autoFocus = false,
  variant = "outlined",
  sx,
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
      error={touched && Boolean(error)}
      helperText={touched && error ? error : ""}
      disabled={disabled}
      fullWidth={fullWidth}
      required={required}
      autoFocus={autoFocus}
      variant={variant}
      margin="normal"
      sx={{
        height:1, // Adjust overall field height
        "& .MuiInputBase-root": {
          height: 50, // Controls the outer input box height
          fontSize: "14px",
        },
        "& input": {
          padding: "10px 10px", // Controls the input text height
        },
        ...sx, // Allow override from props
      }}
    />
  );
};

export default CustomInputField;
