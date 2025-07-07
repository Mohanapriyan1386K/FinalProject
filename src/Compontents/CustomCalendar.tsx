import React from "react";
import { Calendar, Select } from "antd";
import type { CalendarProps } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

interface CustomCalendarProps {
  fetchReportData: (date: Dayjs) => void;
  disabledDate?: (date: Dayjs) => boolean;
  selectedDate: Dayjs;
  setSelectedDate: React.Dispatch<React.SetStateAction<Dayjs>>;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  fetchReportData,
  selectedDate,
  setSelectedDate,
}) => {
  const today = dayjs();
  const currentYear = today.year();
  const currentMonth = today.month();

  const years = Array.from({ length: 10 }, (_, i) => currentYear - i); // Only current and past 9 years

  const months = Array.from({ length: currentMonth + 1 }, (_, i) =>
    dayjs().month(i).format("MMM")
  );

  const onYearChange = (year: number) => {
    let newDate = selectedDate.year(year);

    // If selected year is current year and selected month > current month, reset month to current
    if (year === currentYear && selectedDate.month() > currentMonth) {
      newDate = newDate.month(currentMonth);
    }

    setSelectedDate(newDate);
  };

  const onMonthChange = (month: number) => {
    const newDate = selectedDate.month(month);
    setSelectedDate(newDate);
  };

  const disableFutureDates = (date: Dayjs) => {
    return date.isAfter(today, 'day'); // disables tomorrow and beyond
  };

  return (
    <Calendar
      fullscreen={false}
      value={selectedDate}
      onSelect={(date) => {
        if (!disableFutureDates(date)) {
          fetchReportData(date);
          setSelectedDate(date);
        }
      }}
      disabledDate={disableFutureDates}
      headerRender={({ value }) => {
        const selectedYear = value.year();
        const isCurrentYear = selectedYear === currentYear;

        return (
          <div style={{ display: "flex", gap: "10px", padding: "8px 16px" }}>
            <Select
              value={selectedYear}
              onChange={onYearChange}
              style={{ width: 100 }}
              options={years.map((year) => ({
                label: year.toString(),
                value: year,
              }))}
            />
            <Select
              value={value.month()}
              onChange={onMonthChange}
              style={{ width: 100 }}
              options={Array.from({ length: isCurrentYear ? currentMonth + 1 : 12 }, (_, i) => ({
                label: dayjs().month(i).format("MMM"),
                value: i,
              }))}
            />
          </div>
        );
      }}
    />
  );
};

export default CustomCalendar;
