import React from "react";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";

interface CustomDatePickerProps {
  label: string;
  value: string | undefined;
  onChange: (date: Dayjs | null) => void;
  onBlur?:(e: React.FocusEvent<any>) => void;
  error?: string;
  touched?: boolean;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  value,
  onChange,
  onBlur,
  error,
  touched,
}) => {
  return (
    <div>
      <label>{label}</label>
      <DatePicker
        style={{ width: "100%" }}
        value={value ? dayjs(value) : undefined}
        onChange={onChange}
        onBlur={onBlur}
        className={`${error && touched ? "is-invalid" : ""}`}
      />
      {error && touched && <div className="text-danger">{error}</div>}
    </div>
  );
};

export default CustomDatePicker;
