import React, { useEffect, useState } from "react";
import CustomCalendar from "../../../Compontents/CustomCalendar";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { Box, Paper, Typography } from "@mui/material";
import {
  dailyinventoryreportbydate,
  routgetdistributed,
  disributedmilkgivenstaus,
} from "../../../Services/ApiService";
import { useUserdata, useUserid,useCurrentdate } from "../../../Hooks/UserHook";
import CustomButton from "../../../Compontents/CoustomButton";
import Loader from "../../../Compontents/Loader";


const App: React.FC = () => {
  const Token = useUserdata();
  const userId = useUserid();
  const currentdate=useCurrentdate();

  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [dailyReportData, setDailyReportData] = useState<any[]>([]);
  const [remainingQuantity, setRemainingQuantity] = useState<number>(0);
  const [distributorroute, setdisributorroute] = useState<any[]>([]);
  const [slot_id, setslotid] = useState<any>();
  const [alluser, getallusers] = useState<any[]>([]);
  const [canceluser, setcanceluser] = useState<any[]>([]);
  const [loading,setLoading]=useState(false)

  const statusMap: Record<number, { text: string; color: string }> = {
    1: { text: "Given", color: "green" },
    2: { text: "Upcoming", color: "blue" },
    3: { text: "Partially Given", color: "orange" },
    4: { text: "Missed", color: "red" },
  };

  const slotNames: Record<number, string> = {
    1: "Morning",
    2: "Evening",
  };


  useEffect(() => {
    if (Token) {
      getusers(selectedDate);
    }
  }, [slot_id,selectedDate]);

  useEffect(() => {
    if (Token) {
      getcanceluser(selectedDate);
    }
  }, [slot_id]);

  useEffect(() => {
    fetchReportData(selectedDate);
  }, [selectedDate]);

  const fetchRouteData = (formattedDate: string) => {
    
    const routePayload = new FormData();
    routePayload.append("token", Token);
    routePayload.append("type", "2");
    routePayload.append("distributer_id", userId);
    routePayload.append("from_date", formattedDate);

    routgetdistributed(routePayload)
      .then((res) => {
        setLoading(true)
        setdisributorroute(res.data.data);
      })
      .catch(() => {
        setdisributorroute([]);
      }).finally(()=>{
        setLoading(false)
      })
  };

  const getusers = (date: Dayjs) => {
    // const formattedDate = date.format("YYYY-MM-DD");
    const payload = new FormData();
    payload.append("token", Token);
    payload.append("distributor_id", userId);
    if (slot_id) payload.append("slot_id", slot_id);
    payload.append("from_date", currentdate);
    payload.append("to_date",currentdate)
    payload.append("status", "1,2,3");

    disributedmilkgivenstaus(payload)
      .then((res) => {
        getallusers(res.data.data || []);
        setLoading(true)
      })
      .catch(() => {
        getallusers([]);
      }).finally(()=>{
         setLoading(false)
      })
  };

  const getcanceluser = (date: Dayjs) => {
    const formattedDate = date.format("YYYY-MM-DD");
    const payload = new FormData();
    payload.append("token", Token);
    payload.append("distributor_id", userId);
    if (slot_id) payload.append("slot_id", slot_id);
    payload.append("from_date", formattedDate);
    payload.append("status", "4");

    disributedmilkgivenstaus(payload)
      .then((res) => {
         setLoading(true)
        setcanceluser(res.data.data || []);
      })
      .catch(() => {
        setcanceluser([]);
      }).finally(()=>{
         setLoading(false)
      })
  };

  const fetchReportData = (date: Dayjs) => {
    const formattedDate = date.format("YYYY-MM-DD");
    setSelectedDate(date);

    const invPayload = new FormData();
    invPayload.append("token", Token);
    invPayload.append("from_date", formattedDate);

    dailyinventoryreportbydate(invPayload)
      .then((res) => {
        const defaultSlots: Record<number, any> = {
          1: { slot_id: 1, total_quantity: 0, given_quantity: 0 },
          2: { slot_id: 2, total_quantity: 0, given_quantity: 0 },
        };

        const apiData = res.data.data || [];

        apiData.forEach((item: any) => {
          defaultSlots[item.slot_id] = {
            ...defaultSlots[item.slot_id],
            ...item,
          };
        });

        setDailyReportData(Object.values(defaultSlots));
        setRemainingQuantity(res.data.current_hold_quantity);
      })
      .catch(() => {
        setDailyReportData([
          { slot_id: 1, total_quantity: 0, given_quantity: 0 },
          { slot_id: 2, total_quantity: 0, given_quantity: 0 },
        ]);
        setRemainingQuantity(0);
      });

    fetchRouteData(formattedDate);
    getusers(date);
  };



  return loading ? (
  <Box sx={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
    <Loader />
  </Box>):(
    <Box sx={{ width: "100%", padding: 3 }}>
      <Box
        sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3 }}
      >
        <Paper
          elevation={5}
          sx={{ padding: 2, backgroundColor: "#E8F5E9", borderRadius: 2 }}
        >
          <Typography variant="h6" fontWeight={600}>
            DAILY INVENTORY REPORT
          </Typography>
        </Paper>

        {/* Calendar and Inventory Cards */}
        <Box
          display="flex"
          flexWrap="wrap"
          gap={2}
          justifyContent="space-between"
        >
          <Box sx={{ flex: "1 1 300px", minWidth: "300px" }}>
            <CustomCalendar
              fetchReportData={(date) => console.log(date.format("YYYY-MM-DD"))}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </Box>

          <Box
            sx={{
              flex: "1 1 300px",
              minWidth: "300px",
              padding: 2,
              border: "1px solid #ccc",
              borderRadius: 2,
              backgroundColor: "#E8F5E9",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Inventory Report - {selectedDate.format("DD-MM-YYYY")}
            </Typography>

            {dailyReportData.map((item, idx) => {
              const slotLabel =
                slotNames[item.slot_id] || `Slot ${item.slot_id}`;
              return (
                <Paper
                  key={idx}
                  elevation={3}
                  sx={{
                    padding: 2,
                    backgroundColor: "#FAFAFA",
                    borderLeft: "6px solid #2196F3",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    {slotLabel}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Total Quantity:</strong> {item.total_quantity}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Given Quantity:</strong> {item.given_quantity}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Remaining Quantity:</strong> {remainingQuantity}
                  </Typography>
                </Paper>
              );
            })}
          </Box>
        </Box>

        {/* Assigned Routes */}
        {Array.isArray(distributorroute) && (
          <Paper sx={{ backgroundColor: "#E8F5E9", padding: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              Assigned Routes
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
              {distributorroute.map((route: any, index: number) => (
                <Paper
                  key={route.id || index}
                  elevation={3}
                  sx={{
                    padding: 2,
                    borderLeft: "6px solid #4CAF50",
                    backgroundColor: "#F1F8E9",
                    borderRadius: 2,
                    flex: "1 1 250px",
                    minWidth: "250px",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    {route.line_name}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Paper>
        )}

        {/* Delivered Users */}
        <Paper sx={{ padding: 2 }}>
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{
                  color:
                    slot_id === 1
                      ? "#66BB6A"
                      : slot_id === 2
                      ? "#42A5F5"
                      : "#FF0000",
                }}
              >
                {`Customer Milk Delivery Status ${
                  slot_id === 1 ? "Morning" : slot_id === 2 ? "Evening" : "All"
                }`}
              </Typography>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <CustomButton
                  buttonName="All"
                  onClick={() => setslotid("")}
                  sx={{ backgroundColor: "red" }}
                />
                <CustomButton
                  buttonName="MORNING"
                  onClick={() => setslotid(1)}
                  sx={{ backgroundColor: "#4CAF50" }}
                />
                <CustomButton
                  buttonName="EVENING"
                  onClick={() => setslotid(2)}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 2,
                mt: 2,
              }}
            >
              {alluser.length > 0 ? (
                alluser.map((user: any, idx: number) => {
                  return (
                    <Paper
                      key={user.slot_log_id || idx}
                      elevation={3}
                      sx={{
                        padding: 2,
                        backgroundColor: "#fffde7",
                        borderLeft: `6px solid ${
                          user.status === 4 ? "#f44336" : "#4caf50"
                        }`,
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={600}>
                        {user.customer_name}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Milk Given:</strong> {user.milk_given_quantity}{" "}
                        L
                      </Typography>
                      <Typography variant="body2">
                        <strong>Given status:</strong>
                        {user.milk_given_status}
                      </Typography>
                    </Paper>
                  );
                })
              ) : (
                <Typography sx={{ color: "gray", fontStyle: "italic" }}>
                  No customer data found for the selected slot.
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Cancelled Users */}
        <Paper sx={{ padding: 2 }}>
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                Cancelled Users
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 2,
                mt: 2,
              }}
            >
              {canceluser.length > 0 ? (
                canceluser.map((user: any, idx: number) => {
                  const slotLabel =
                    slotNames[user.slot_id] || `Slot ${user.slot_id}`;
                  return (
                    <Paper
                      key={user.slot_log_id || idx}
                      elevation={3}
                      sx={{
                        padding: 2,
                        backgroundColor: "#fffde7",
                        borderLeft: `6px solid ${
                          user.status === 4 ? "#f44336" : "#4caf50"
                        }`,
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={600}>
                        {user.customer_name}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Slot:</strong> {slotLabel}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Milk Given:</strong> {user.milk_given_quantity}{" "}
                        L
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: statusMap[user.status]?.color,
                          fontWeight: 600,
                        }}
                      >
                        Status: {statusMap[user.status]?.text || "Unknown"}
                      </Typography>
                    </Paper>
                  );
                })
              ) : (
                <Typography sx={{ color: "gray", fontStyle: "italic" }}>
                  No customer data found for the selected slot.
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default App;
