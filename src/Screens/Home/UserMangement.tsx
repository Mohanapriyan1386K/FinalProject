// src/screens/Admin/UserMangement.tsx

import { Box, Paper } from "@mui/material";
import {
  Typography,
  Tooltip,
  Modal,
  Pagination,
  Table,
  Spin,
  Select,
} from "antd";
import CustomButton from "../../Compontents/CoustomButton";
import {
  fetchUserList,
  viewUser,
} from "../../Services/ApiService";
import { useEffect, useState } from "react";
import { getDecryptedCookie } from "../../Uitils/Cookeis";
import { useNavigate } from "react-router-dom";
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleTwoTone,
  StopTwoTone,
  EyeOutlined,
} from "@ant-design/icons";
import ViewUserModal from "../../Screens/Modal/ViewUserModak";
import { handleUserDeleteOrToggle } from "../Modal/handleUserDeleteOrToggle"
const { Option } = Select;

interface SlotData {
  id: number;
  slot_id: number;
  quantity: number;
  method: number;
  start_date: string;
}

interface TodaySlotData {
  id: number;
  slot_id: number;
  quantity: string;
  method: number;
  scheduled_date: string;
}

interface UserFullView {
  user_id: number;
  user_type: number;
  name: string;
  user_name: string;
  email: string;
  phone: string;
  alternative_number: string | null;
  img_path: string | null;
  created_at: string;
  updated_at: string | null;
  status: number;
  price_tag_id: number;
  price_tag_name: string;
  line_id: number;
  line_name: string;
  customer_type: number;
  pay_type: number;
  slot_data: SlotData[];
  invoice_data: any[];
  today_slot_data: TodaySlotData[];
}

interface User {
  id: any;
  name: string;
  user_type: string;
  email: string;
  phone: string;
  line_id: number;
  price_tag_id: number;
  customer_type: number;
  pay_type: number;
  status: number;
}

function UserMangement() {
  const navigate = useNavigate();
  const userdata = getDecryptedCookie("user_token");
  const token = userdata.token;

  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(10);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserFullView | null>(null);
  const [viewUserModel, setviewUserModel] = useState(false);

  const [usertype, setusertype] = useState<string | undefined>(undefined);
  const [paytype, setpaytype] = useState<string | undefined>(undefined);
  const [status, setstaus] = useState<string | undefined>(undefined);

  const fetchData = () => {
    setLoading(true);
    const payload = new FormData();
    payload.append("token", token);
    if (usertype) payload.append("user_type", usertype);
    if (paytype) payload.append("pay_type", paytype);
    if (status) payload.append("status", status);

    fetchUserList(currentPage, 10, payload)
      .then((res) => {
        const data = res.data?.data || [];
        setUsers(data);
        setTotal(res.data?.total || 50);
      })
      .catch((err) => console.error("Failed to fetch users:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const onEdit = (record: User) => {
    navigate(`/admin-dashboard/edit/${record.id}`);
  };

  const onDelete = (record: User) => {
    handleUserDeleteOrToggle(record, token, -1, fetchData);
  };

  const onToggleStatus = (record: User) => {
    const newStatus = record.status === 1 ? 0 : 1;
    handleUserDeleteOrToggle(record, token, newStatus, fetchData);
  };

  const ViewUser = (record: User) => {
    const Payload = new FormData();
    Payload.append("token", token);
    Payload.append("user_id", record.id);
    viewUser(Payload).then((res) => {
      setUserData(res.data.data);
      setviewUserModel(true);
    });
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "User Type", dataIndex: "user_type", key: "user_type" },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email: string) => email?.trim() || "--",
    },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Customer Type", dataIndex: "customer_type", key: "customer_type" },
    {
      title: "Pay Type",
      dataIndex: "pay_type",
      key: "pay_type",
      render: (pay_type: number) => (pay_type === 1 ? "Monthly" : "Daily"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: number) =>
        status === 1 ? (
          <CheckCircleTwoTone twoToneColor="#52c41a" />
        ) : (
          <StopTwoTone twoToneColor="#eb2f96" />
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: User) => (
        <Box sx={{ display: "flex", gap: 2 }}>
          <Tooltip title="Edit">
            {record.status === 1 && (
              <EditOutlined
                style={{ color: "#1b5e20", cursor: "pointer", fontSize: "18px" }}
                onClick={() => onEdit(record)}
              />
            )}
          </Tooltip>
          <Tooltip title="Delete">
            <DeleteOutlined
              style={{ color: "red", cursor: "pointer", fontSize: "18px" }}
              onClick={() => onDelete(record)}
            />
          </Tooltip>
          <Tooltip title={record.status === 1 ? "Deactivate" : "Activate"}>
            {record.status === 1 ? (
              <StopTwoTone
                twoToneColor="#eb2f96"
                style={{ fontSize: "18px", cursor: "pointer" }}
                onClick={() => onToggleStatus(record)}
              />
            ) : (
              <CheckCircleTwoTone
                twoToneColor="#52c41a"
                style={{ fontSize: "18px", cursor: "pointer" }}
                onClick={() => onToggleStatus(record)}
              />
            )}
          </Tooltip>
          <Tooltip title="View">
            <EyeOutlined
              style={{ color: "#0000FF", cursor: "pointer", fontSize: "18px" }}
              onClick={() => ViewUser(record)}
            />
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Paper
        sx={{
          padding: 2,
          background: "#e8f5e9",
          fontWeight: "900",
          fontSize: "25px",
          color: "#2e7d32",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography style={{ fontSize: "25px" }}>User Management</Typography>
          <CustomButton
            buttonName="ADD USER"
            sx={{ backgroundColor: "#1b5e20" }}
            onClick={() => navigate("/admin-dashboard/add")}
          />
        </Box>
      </Paper>

      <form>
        <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
          <Select
            placeholder="Select User Type"
            style={{ width: 200 }}
            onChange={(value) => {
              setusertype(value);
            }}
            allowClear
            value={usertype}
          >
            <Option value="2">Admin</Option>
            <Option value="3">Vendor</Option>
            <Option value="4">Distributor</Option>
            <Option value="5">Customer</Option>
          </Select>

          <Select
            placeholder="Pay Type"
            style={{ width: 200 }}
            onChange={(value) => {
              setpaytype(value);
              setCurrentPage(1);
            }}
            allowClear
            value={paytype}
          >
            <Option value="1">Monthly</Option>
            <Option value="2">Daily</Option>
          </Select>

          <Select
            placeholder="Status"
            style={{ width: 200 }}
            onChange={(value) => {
              setstaus(value);
              setCurrentPage(1);
            }}
            allowClear
            value={status}
          >
            <Option value="1">Active</Option>
            <Option value="0">Inactive</Option>
          </Select>

          <CustomButton
            buttonName="Filter"
            sx={{ backgroundColor: "#1b5e20" }}
            onClick={fetchData}
          />
        </Box>
      </form>

      <Paper>
        <Box style={{ padding: 20 }}>
          <Typography.Title level={3}>User List</Typography.Title>
          {loading ? (
            <Spin />
          ) : (
            <>
              <Table
                dataSource={users}
                columns={columns}
                rowKey={(record, index) => record.email || `user-${index}`}
                pagination={false}
              />
              <Pagination
                current={currentPage}
                pageSize={10}
                total={total}
                onChange={(page) => setCurrentPage(page)}
                style={{ marginTop: 5, textAlign: "right" }}
              />
            </>
          )}
        </Box>
      </Paper>

      <ViewUserModal
        open={viewUserModel}
        onClose={() => setviewUserModel(false)}
        userData={userData}
      />
    </Box>
  );
}

export default UserMangement;
