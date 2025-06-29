// CustomSelect.tsx
import React from "react";
import { Select } from "antd";
import { Box, Typography } from "@mui/material";

interface Option {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface Props {
  label: string;
  name: string;
  value: string | number | string[];
  options: Option[];
  onChange: (value: string | number | string[]) => void;
  onBlur?: (e: React.FocusEvent<HTMLElement>) => void;
  error?: string;
  touched?: boolean;
  mode?: "multiple" | "tags";
  required?: boolean;
}

const CustomSelect: React.FC<Props> = ({
  label,
  value,
  options,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  mode,
}) => {
  const showError = touched && !!error;

  const enhancedOptions: Option[] =
    typeof value === "string" || typeof value === "number"
      ? [{ label: `-- Select ${label} --`, value: "", disabled: true }, ...options]
      : options;

  return (
    <Box mb={2}>
      {label && (
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          {label} {required && <Typography component="span" color="error">*</Typography>}
        </Typography>
      )}
      <Select
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        mode={mode}
        options={enhancedOptions.map(opt => ({ label: opt.label, value: opt.value, disabled: opt.disabled }))}
        style={{
          width: "100%",
          borderColor: showError ? "#f44336" : undefined,
          borderRadius: 6,
        }}
      />
      {showError && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default CustomSelect;
