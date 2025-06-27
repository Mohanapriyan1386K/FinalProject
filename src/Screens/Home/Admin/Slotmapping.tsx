import { useEffect, useState, type SetStateAction } from "react";
import { Table, Spin, Select } from "antd";
import { ViwslotMap } from "../../../Services/ApiService";
import { getDecryptedCookie } from "../../../Uitils/Cookeis";
import { Box, Paper,Typography } from "@mui/material";
import CustomButton from "../../../Compontents/CoustomButton";
import { useNavigate } from "react-router-dom";
import CustomInputField from "../../../Compontents/CoustomInputFiled";

const { Option } = Select;

export interface SlotLog {
  slot_log_id: number;
  customer_id: number;
  customer_name: string;
  assigned_to: number | null;
  assigned_name: string | null;
  slot_id: number;
  slot_name: string;
  milk_given_id: number;
  milk_given_type: string;
  scheduled_date: string;
  milk_given_status: string;
  milk_given_quantity: number;
  actual_milk_quantity: number;
  status: number;
  reason: string | null;
  user_pay_mode: number;
  unit_price: string;
  is_assigned: string;
}

const columns = [
  {  title: (
      <span style={{ fontSize: "14px", fontWeight: "bold", color: "#2e7d32" }}>
        Scheduled Date
      </span>
    ), dataIndex: "customer_name", key: "customer_name" },
  {
      title: (
      <span style={{ fontSize: "14px", fontWeight: "bold", color: "#2e7d32" }}>
        Assigned
      </span>
    ),

    dataIndex: "assigned_name",
    key: "assigned_name",
    render: (text: string | null) => text ?? "Unassigned",
  },
  {  title: (
      <span style={{ fontSize: "14px", fontWeight: "bold", color: "#2e7d32" }}>
        Slot
      </span>
    ),
 },
  {
      title: (
      <span style={{ fontSize: "14px", fontWeight: "bold", color: "#2e7d32" }}>
        Method
      </span>
    ),
    dataIndex: "milk_given_type",
    key: "milk_given_type",
  },
  {
    title: (
      <span style={{ fontSize: "14px", fontWeight: "bold", color: "#2e7d32" }}>
        Scheduled Date
      </span>
    ),

    dataIndex: "scheduled_date",
    key: "scheduled_date",
  },
  {
    title: (
      <span style={{ fontSize: "14px", fontWeight: "bold", color: "#2e7d32" }}>
        Milk Given Status
      </span>
    ),

    dataIndex: "milk_given_status",
    key: "milk_given_status",
  },
  {
    title: (
      <span style={{ fontSize: "14px", fontWeight: "bold", color: "#2e7d32" }}>
        Given Qty
      </span>
    ),
    dataIndex: "milk_given_quantity",
    key: "milk_given_quantity",
  },
  {
    title: (
      <span style={{ fontSize: "14px", fontWeight: "bold", color: "#2e7d32" }}>
        Actual Qty (L)
      </span>
    ),
    dataIndex: "actual_milk_quantity",
    key: "actual_milk_quantity",
  },
  {
    title: (
      <span style={{ fontSize: "14px", fontWeight: "bold", color: "#2e7d32" }}>
        Pay Mode (L)
      </span>
    ),
    dataIndex: "user_pay_mode",
    key: "user_pay_mode",
    render: (mode: number) =>
      mode === 1 ? "Cash" : mode === 2 ? "Online" : "Other",
  },
  {
    title: (
      <span style={{ fontSize: "14px", fontWeight: "bold", color: "#2e7d32" }}>
        Unit Price
      </span>
    ),
    dataIndex: "unit_price",
    key: "unit_price",
    render: (price: string) => `₹${price}`,
  },
  {
    title: (
      <span style={{ fontSize: "14px", fontWeight: "bold", color: "#2e7d32" }}>
        Status
      </span>
    ),
    dataIndex: "status",
    key: "status",
    render: (value: number) => (
      <span
        style={{
          color: value === 1 ? "green" : "red",
          fontWeight: 600,
        }}
      >
        {value === 1 ? "Active" : "Inactive"}
      </span>
    ),
  },
];

function Slotmapping() {
  const navigate = useNavigate();
  const userdata = getDecryptedCookie("user_token");

  const [data, setData] = useState<SlotLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(false);
  const [mode, setMode] = useState<number>();
  const [status, setStatus] = useState<string>();
  const [filterData, setFilterData] = useState<SlotLog[]>([]);
  const [date, setDate] = useState("2025-06-25");
  const [coustomerId, setcoustomerId] = useState<any>();
  const [slotid, setSlotId] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      const payload = new FormData();
      payload.append("token", userdata?.token);
      try {
        const res = await ViwslotMap(payload, 1, 10);
        setData(res.data.data || []);
        console.log(res.data.data);
      } catch (error) {
        console.error("Error fetching slot map data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFilter = () => {
    const payload = new FormData();
    console.log(userdata.token);
    payload.append("token", userdata?.token || "");

    if (mode) {
      payload.append("mode", mode.toString());
    }

    if (status) {
      payload.append("status", status);
    }

    if (data) {
      payload.append("from_date", date);
    }
    if (coustomerId) {
      payload.append("customer_id", coustomerId);
    }

    if (slotid) {
      payload.append("slot_id", slotid);
    }

    ViwslotMap(payload, 1, 10).then((res) => {
      setFilterData(res.data.data);
      setFilter(true);
    });
  };

  const handleClearFilter = () => {
    setFilter(false);
    setMode(undefined);
    setStatus(undefined);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleDateChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setDate(e.target.value);
  };

  const handleCustomerId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setcoustomerId(e.target.value);
  };

  return (
    <div>
      <Paper>
        <Box
          sx={{
            backgroundColor: "#A5D6A7",
            padding: 2,
            marginBottom: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center", // Center vertically
          }}
        >
          <Typography sx={{ fontSize: "30px", fontWeight: "600" }}>
            MILK SLOT
          </Typography>
          <CustomButton
            buttonName="Back"
            sx={{ backgroundColor: "#2E7D32", height: "40px" }}
            onClick={handleBack}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            padding: 2,
            alignItems: "center", // Ensure vertical alignment
            flexWrap: "wrap", // Optional: wrap if screen is small
          }}
        >
          <Select
            placeholder="Select Type"
            style={{ width: 200, height: 40, marginRight: 16 }}
            value={mode}
            onChange={(value) => setMode(value)}
            showSearch
            allowClear
            optionFilterProp="children"
          >
            <Option value={1}>Direct</Option>
            <Option value={2}>Distributor</Option>
          </Select>

          <Select
            placeholder="Select Status"
            style={{ width: 200, height: 40 }}
            value={status}
            onChange={(value) => setStatus(value)}
            showSearch
            allowClear
            optionFilterProp="children"
          >
            <Option value="1">Given</Option>
            <Option value="2">Upcoming</Option>
            <Option value="3">Partially Given</Option>
            <Option value="4">Cancelled</Option>
          </Select>

          <Select
            placeholder="Select or type slot"
            style={{ width: 200, height: 40 }}
            value={slotid}
            onChange={(value) => setSlotId(value)}
            onSearch={(value) => setSlotId(value)}
            showSearch
            allowClear
            filterOption={(input, option) =>
              (option?.children as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            notFoundContent={null}
          >
            <Option value="1">Morning</Option>
            <Option value="2">Evening</Option>
          </Select>

          <CustomInputField
            type="number"
            placeholder="Customer ID"
            value={coustomerId}
            onChange={handleCustomerId}
            sx={{ width: "300px" }}
          />

          <CustomInputField
            type="date"
            value={date}
            variant="filled"
            onChange={handleDateChange}
            sx={{
              width: "200px",
              height: "40px",
              fontSize: "14px",
              padding: "0 8px",
              marginBottom: 0,
            }}
          />

          <CustomButton
            buttonName="Filter"
            sx={{ height: "40px" }}
            onClick={handleFilter}
          />

          <CustomButton
            buttonName="Clear Filter"
            sx={{ backgroundColor: "#FF9800", height: "40px" }}
            onClick={handleClearFilter}
          />
        </Box>
      </Paper>

      {loading ? (
        <Spin />
      ) : (
        <div style={{ fontSize: "10px" }}>
          <Table
            columns={columns}
            dataSource={filter ? filterData : data}
            rowKey="slot_log_id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              showQuickJumper: true,
            }}
            bordered
          />
        </div>
      )}
    </div>
  );
}

export default Slotmapping;
