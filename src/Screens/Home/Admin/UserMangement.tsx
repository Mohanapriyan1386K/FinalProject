import { Box, Paper } from "@mui/material";
import {
  Typography,
  Tooltip,
  Modal,
  Pagination,
  Table,
  Spin,
  Select,
  Descriptions,
} from "antd";
import CustomButton from "../../../Compontents/CoustomButton";
import {
  fetchUserList,
  deleteuser,
  viewUser,
  fetchfilteredUserList,
} from "../../../Services/ApiService";
import { useEffect, useState } from "react";
import { getDecryptedCookie } from "../../../Uitils/Cookeis";
import { useNavigate } from "react-router-dom";
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleTwoTone,
  StopTwoTone,
  EyeOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { Option } from "antd/es/mentions";
// import { pricetagdropdownsOption } from "./DropDow";
import User from "./Coustomer";

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
  const [filterdata, setIsFiltereddata] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(10);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserFullView | null>(null);
  const [viewUserModel, setviewUserModel] = useState(false);
  // const [priceTags, setPriceTags] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);

  // filter

  const [usertype, setusertype] = useState();
  const [paytype, setpaytype] = useState();
  const [status, setstaus] = useState();
  // const [pricetag, setpricetag] = useState<number | undefined>();

  //
  const fetchData = () => {
    setLoading(true);
    fetchUserList(currentPage, 10, token)
      .then((res) => {
        const data = res.data?.data || [];
        setUsers(data);
        setTotal(res.data?.total || 50);
      })
      .catch((err) => console.error("Failed to fetch users:", err))
      .finally(() => setLoading(false));
  };

  //  filter
  const handlefilter = () => {
    const payload = new FormData();
    payload.append("token", token);
    if (usertype) payload.append("user_type", usertype);
    if (paytype) payload.append("pay_type", paytype);
    if (status) payload.append("status", status);



    fetchfilteredUserList(currentPage, 10, payload)
      .then((res) => {
        if (res.data.status === 1) {
          setIsFiltereddata(res.data.data);
          console.log(res.data.data)
          setIsFiltered(true);
        } else {
          toast.error(res.data.msg || "No users found");
          setIsFiltereddata([]); // Clear filter data
          setIsFiltered(true);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error fetching filtered users");
      });

    setIsFiltered(true);
  };

  // price tag option map
  // useEffect(() => {
  //   const fetchPriceTags = async () => {
  //     const data = await pricetagdropdownsOption();
  //     setPriceTags(data);
  //   };
  //   fetchPriceTags();
  // }, []);

  // price tag option map

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const onEdit = (record: User) => {
    navigate(`/admin-dashboard/users/edit/${record.id}`);
  };

  const onDelete = (record: User) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      content: `User: ${record.name}`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        const formData = new FormData();
        formData.append("token", token);
        formData.append("user_id", record.id.toString());
        formData.append("status", "-1");

        deleteuser(formData)
          .then((res) => {
            toast.success(res.data.msg);
            fetchData();
          })
          .catch(() => toast.error("Delete failed"));
      },
    });
  };

  // pricetagdropdownsOption();
  const ViewUser = (record: User) => {
    const Payload = new FormData();
    Payload.append("token", token);
    Payload.append("user_id", record.id);
    viewUser(Payload).then((res) => {
      setUserData(res.data.data);
      setviewUserModel(true);
    });
  };

  const onToggleStatus = (record: User) => {
    const newStatus = record.status === 1 ? "0" : "1";
    const action = record.status === 1 ? "deactivate" : "activate";

    Modal.confirm({
      title: `Are you sure you want to ${action} this user?`,
      content: `User: ${record.name}`,
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        const formData = new FormData();
        formData.append("token", token);
        formData.append("user_id", record.id.toString());
        formData.append("status", newStatus);

        deleteuser(formData)
          .then(() => {
            toast.success(`User ${action}d successfully`);
            fetchData();
          })
          .catch(() => toast.error(`${action} failed`));
      },
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
        <Box sx={{ display: "flex", gap: 2 }}>
          <Tooltip title="Edit">
            <EditOutlined
              style={{ color: "#1b5e20", cursor: "pointer", fontSize: "18px" }}
              onClick={() => onEdit(record)}
            />
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
          <Typography>User Management</Typography>
          <CustomButton
            buttonName="ADD USER"
            sx={{ backgroundColor: "#1b5e20" }}
            onClick={() => navigate("/admin-dashboard/users/add")}
          />
        </Box>
      </Paper>

      <Modal
        title="User Details"
        open={viewUserModel}
        onCancel={() => setviewUserModel(false)}
        footer={null}
        width={900}
        style={{ marginLeft: 300 }}
      >
        {userData && (
          <>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="User ID">
                {userData.user_id}
              </Descriptions.Item>
              <Descriptions.Item label="User Type">
                {{
                  2: "Admin",
                  3: "Vendor",
                  4: "Distributor",
                  5: "Customer",
                }[userData.user_type] || "Unknown"}
              </Descriptions.Item>
              <Descriptions.Item label="Name">
                {userData.name}
              </Descriptions.Item>
              <Descriptions.Item label="Username">
                {userData.user_name}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {userData.email}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {userData.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Alternative No">
                {userData.alternative_number || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Line">
                {userData.line_name}
              </Descriptions.Item>
              <Descriptions.Item label="Price Tag">
                {userData.price_tag_name}
              </Descriptions.Item>
              <Descriptions.Item label="Customer Type">
                {userData.customer_type === 1 ? "Regular" : "Occasional"}
              </Descriptions.Item>
              <Descriptions.Item label="Pay Type">
                {userData.pay_type === 1 ? "Monthly" : "Daily"}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {userData.status === 1 ? "Active" : "Inactive"}
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {userData.created_at}
              </Descriptions.Item>
            </Descriptions>

            <br />
            <Typography.Title level={5}>Slot Data</Typography.Title>
            <Table
              dataSource={userData.slot_data}
              rowKey="id"
              size="small"
              bordered
              pagination={false}
              columns={[
                { title: "Slot ID", dataIndex: "slot_id", key: "slot_id" },
                { title: "Quantity", dataIndex: "quantity", key: "quantity" },
                { title: "Method", dataIndex: "method", key: "method" },
                {
                  title: "Start Date",
                  dataIndex: "start_date",
                  key: "start_date",
                },
              ]}
            />
            <br />
            <Typography.Title level={5}>Today's Slot Data</Typography.Title>
            <Table
              dataSource={userData.today_slot_data}
              rowKey="id"
              size="small"
              bordered
              pagination={false}
              columns={[
                { title: "Slot ID", dataIndex: "slot_id", key: "slot_id" },
                { title: "Quantity", dataIndex: "quantity", key: "quantity" },
                { title: "Method", dataIndex: "method", key: "method" },
                {
                  title: "Scheduled Date",
                  dataIndex: "scheduled_date",
                  key: "scheduled_date",
                },
              ]}
            />
          </>
        )}
      </Modal>

      <form action="">
        <Box sx={{ display: "flex", gap: 2 }}>
          <Select
            placeholder="Select User Type"
            style={{ width: 200 }}
            onChange={(value) => setusertype(value)}
            allowClear // optional, adds a clear button
          >
            <Option value="2">Admin</Option>
            <Option value="3">Vendor</Option>
            <Option value="4">Distributor</Option>
            <Option value="5">Coustomer</Option>
          </Select>

          <Select
            placeholder="Pay Type"
            style={{ width: 200 }}
            onChange={(value) => setpaytype(value)}
            allowClear
          >
            <Option value="2">Daily</Option>
            <Option value="1">Monthly</Option>
          </Select>
          <Select
            placeholder="Status"
            style={{ width: 200 }}
            onChange={(value) => setstaus(value)}
            allowClear
          >
            <Option value="1">Active</Option>
            <Option value="2">Inactive</Option>
          </Select>
          {/* <Select
            placeholder="Select Price Tag"
            style={{ width: 250 }}
            onChange={(value) => setpricetag(value)}
            allowClear
          >
            {priceTags.map((item) => (
                <Option key={item.id} value={item.price_tag_id}>
                  {item.price_tag_name}
                </Option>
           ))}
          </Select> */}
          <Box>
            <CustomButton
              buttonName="Filter"
              sx={{ backgroundColor: "#1b5e20" }}
              onClick={handlefilter}
            />
          </Box>
        </Box>
      </form>

      <Paper>
        <Box style={{ padding: 20 }}>
          <Typography.Title level={3}>User List</Typography.Title>
          {loading ? (
            <Spin />
          ) : (
            <>
              {!isFiltered ? (
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
              ) : (
                <>
                  <Typography.Text type="secondary">
                    Showing Filtered Users
                  </Typography.Text>
                  <Table
                    dataSource={filterdata}
                    columns={columns}
                    rowKey={(record, index) => record.email || `user-${index}`}
                    pagination={false}
                  />
                </>
              )}
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

export default UserMangement;
