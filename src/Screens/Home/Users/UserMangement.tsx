import { Box, Paper } from "@mui/material";
import { Tooltip } from "antd";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleTwoTone,
  StopTwoTone,
  EyeOutlined,
} from "@ant-design/icons";
import CustomButton from "../../../Compontents/CoustomButton";
import { fetchUserList, viewUser } from "../../../Services/ApiService";
import ViewUserModal from "../../../Screens/Modal/ViewUserModak";
import { handleUserDeleteOrToggle } from "../../Modal/handleUserDeleteOrToggle";
import { useUserdata } from "../../../Hooks/UserHook";
import Loader from "../../../Compontents/Loader";
import CustomTable from "../../../Compontents/CustomTable";
import CustomDropDown from "../../../Compontents/CustomDropDown";
import { useFormik } from "formik";

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

interface FilterValues {
  pay_type?: string;
  customer_type?: string;
  user_type?: string;
  line_id?: string;
  price_tag_id?: string;
  status?: string;
}

function UserMangement() {
  const token = useUserdata();
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(10);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserFullView | null>(null);
  const [viewUserModel, setviewUserModel] = useState(false);
  const [submittedFilters, setSubmittedFilters] = useState<FilterValues>({});

  const formik = useFormik<FilterValues>({
    initialValues: {
      pay_type: "",
      customer_type: "",
      user_type: "",
      line_id: "",
      price_tag_id: "",
      status: "",
    },
    onSubmit: (values) => {
      setSubmittedFilters(values);
      setCurrentPage(1);
    },
  });

  const fetchData = () => {
    setLoading(true);
    const payload = new FormData();
    payload.append("token", token);

    Object.entries(submittedFilters).forEach(([key, value]) => {
      if (value) payload.append(key, value);
    });

    fetchUserList(currentPage, pageSize, payload)
      .then((res) => {
        const data = res.data?.data || [];
        setUsers(data);
        setTotal(res.data?.total || 0);
      })
      .catch((err) => console.error("Failed to fetch users:", err))
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, submittedFilters]);

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
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
    {
      title: "S.No",
      render: (_: any, __: any, index: number) => (
        <span style={{ fontSize: 12 }}>
          {(currentPage - 1) * pageSize + index + 1}
        </span>
      ),
      width: 70,
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "User Type", dataIndex: "user_type", key: "user_type" },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email: string) => email?.trim() || "--",
    },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Customer Type",
      dataIndex: "customer_type",
      key: "customer_type",
    },
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
        <Box sx={{ display: "flex", gap: 1, justifyContent: "space-around" }}>
          <Tooltip title="Edit">
            {record.status === 1 && (
              <EditOutlined
                style={{
                  color: "#1b5e20",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
                onClick={() =>
                  navigate("editUser", { state: { id: record.id } })
                }
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            style={{ fontSize: "25px", color: "black", fontWeight: 700 }}
          >
            User Management
          </Typography>
          <CustomButton
            buttonName="ADD USER"
            sx={{
              backgroundColor: "#008000",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#006400",
              },
            }}
            onClick={() => navigate("/dashboard/createuser")}
          />
        </Box>
      </Paper>

      <Paper sx={{ backgroundColor: "#E8F5E9", padding: 2 }}>
        <form onSubmit={formik.handleSubmit}>
          <CustomDropDown
            dropdownKeys={[
              "user_type",
              "customer_type",
              "pay_type",
              "line_id",
              "price_tag_id",
              "status",
            ]}
            formik={formik}
          />

          <div className="d-flex gap-2 my-2">
            <CustomButton
              variant="outlined"
              buttonName="FILTER"
              type="submit"
              sx={{ backgroundColor: "green", color: "white","&:hover": {
                backgroundColor: "#006400",
              }, }}
            />
            <CustomButton
              variant="outlined"
              buttonName="RESET"
              type="button"
              sx={{ backgroundColor: "red", color: "white" }}
              onClick={() => {
                formik.resetForm();
                setSubmittedFilters({});
                setCurrentPage(1);
              }}
            />
          </div>
        </form>
      </Paper>

      <Paper sx={{ backgroundColor: "#E8F5E9" }}>
        <Box style={{ padding: 20 }}>
          <Typography sx={{ color: "black", fontSize: 20 }}>
            User List
          </Typography>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <Loader />
            </div>
          ) : (
            <CustomTable
              dataSource={users}
              columns={columns}
              currentPage={currentPage}
              total={total}
              onPageChange={handlePageChange}
              pageSize={pageSize}
              loading={loading}
            />
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
