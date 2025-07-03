import React, { useState } from "react";
import { Calendar, theme } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { Box, Paper, Typography } from "@mui/material";

const App: React.FC = () => {
  const { token } = theme.useToken();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const disabledDate = (current: Dayjs) => {
    return current > dayjs().endOf("day");
  };

  const handleDateSelect = (date: Dayjs) => {
    setSelectedDate(date);
    console.log("Selected Date:", date.format("YYYY-MM-DD"));
  };

  return (
    <Box sx={{ width: "100%", padding: 3 }}>
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Header */}
        <Paper
          elevation={5}
          sx={{
            width: "100%",
            padding: 2,
            backgroundColor: "#E8F5E9",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            USER LIST
          </Typography>
        </Paper>

        {/* Full Width Flex Layout */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            width: "100%",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {/* Calendar Section */}
          <Box
            sx={{
              flex: 1,
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: token.borderRadiusLG,
              padding: 2,
              minWidth: 300,
            }}
          >
            <Calendar
              fullscreen={false}
              onSelect={handleDateSelect}
              disabledDate={disabledDate}
            />
          </Box>

          {/* MOHAN Content Section */}
          <Box
            sx={{
              flex: 1,
              padding: 2,
              border: "1px solid #ccc",
              borderRadius: 2,
              minWidth: 300,
            }}
          >
            <Typography variant="h5">MOHAN</Typography>
            <Typography variant="body1" mt={1}>
              This is a placeholder content area. You can add graphs, lists, or stats here.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default App;
