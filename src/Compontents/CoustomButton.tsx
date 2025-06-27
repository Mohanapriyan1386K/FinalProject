import React from "react";
import { Button, Box, type ButtonProps, type SxProps, type Theme } from "@mui/material";

interface CustomButtonProps {
  onClick?: () => void;
  variant?: ButtonProps["variant"];
  backgroundColor?: string;
  buttonName?: string;
  width?: string | number;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  sx?: SxProps<Theme>; // ✅ sx for extra styling
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onClick,
  variant = "contained",
  buttonName,
  type = "submit",
  disabled = false,
  sx,
}) => {
  return (
    <Box>
      <Button
        onClick={onClick}
        variant={variant}
        type={type}
        disabled={disabled}
        sx={sx}
      >
        {buttonName}
      </Button>
    </Box>
  );
};

export default CustomButton;
