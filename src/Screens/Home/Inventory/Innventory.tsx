import { useEffect, useState } from "react";
import {
  getdailinventroy,
  Listinventory,
  UpdateInventory,
  AddInventory,
  list_inventory_log,
} from "../../../Services/ApiService";
import {
  Card,
  Typography,
  Row,
  Col,
  Spin,
  Table,
  Button,
  Modal,
  InputNumber,
  Input,
  Form as AntForm,
  Form,
} from "antd";
import {
  ClockCircleOutlined,
  FieldTimeOutlined,
  AppstoreAddOutlined,
  LoadingOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import InventoryLineChart from "../../../Compontents/InventoryLineChart";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import MilkRequiredReport from "./MilkRequiredReport";
import { Box } from "@mui/material";
import {useUserdata} from "../../../Hooks/UserHook"

interface SlotData {
  date: string;
  total_quantity: number;
}

interface DailyInventory {
  total_inventory_count: number;
  mrng_slot_count: number;
  eve_slot_count: number;
  mrng_data: SlotData[];
  evening_data: SlotData[];
}


interface InventoryItem {
  id: any;
  slot_id: number;
  slot_name: string;
  total_quantity: number;
  available_quantity: number;
  used_quantity: number;
  created_at: string;
  updated_at: string | null;
  status: number;
  status_text: string;
  comment: string | null;
  is_add_status: number;
  is_update_status: number;
}

interface InventoryTransaction {
  id: number;
  inventory_id: number;
  quantity: number;
  created_at: string; // formatted as "DD-MM-YYYY HH:mm:ss"
  updated_at: string | null;
  status: number;
  status_text: string;
  type: string; // e.g., "Out"
  type_id: number;
  customer_name: string | null;
  given_by_name: string;
  created_by: number;
  slot_id: number;
  slot_name: string;
  pervious_quantity: number; // likely a typo: should be 'previous_quantity'
  remaining_quantity: number;
  comment: string;
}

const validationSchema = Yup.object({
  total_quantity: Yup.number().required("Total quantity is required"),
  comment: Yup.string().nullable(),
});
``;

const customSpinIcon = (
  <LoadingOutlined style={{ fontSize: 32, color: "#1890ff" }} spin />
);

function AdminDashboard() {
  const navigte = useNavigate();
  const [dailyInventory, setDailyInventory] = useState<DailyInventory | null>(
    null
  );
  const [inventoryList, setInventoryList] = useState<InventoryItem[]>([]);
  const [wholedata, setwholedata] = useState({
    is_add_status: 0,
  });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(10);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModelOpen, setViewModelOpen] = useState(false);
  const [islist_inventory_logs, setlist_inventory_logs] = useState<
    InventoryTransaction[]
  >([]);

  const token = useUserdata()

  // update formik
  const formik = useFormik({
    initialValues: {
      id: 0,
      total_quantity: 0,
      comment: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload = new FormData();
      payload.append("token", token);
      payload.append("inventory_id", values.id.toString());
      payload.append("total_quantity", values.total_quantity.toString());
      payload.append("comment", values.comment);

      UpdateInventory(payload)
        .then((res) => {
          toast.success(res.data.msg);
          setIsEditModalOpen(false);
          fetchInventoryList(); // reload table
        })
        .catch((error) => {
          toast.error("Failed to update inventory.");
          console.error(error);
        });
    },
  });

  // add formik
  const addFormik = useFormik({
    initialValues: {
      total_quantity: 0,
      comment: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload = new FormData();
      payload.append("token", token);
      payload.append("total_quantity", values.total_quantity.toString());
      payload.append("comment", values.comment);

      AddInventory(payload)
        .then((res) => {
          toast.success(res.data.msg);
          setIsAddModalOpen(false);
          fetchInventoryList();
        })
        .catch((error) => {
          toast.error("Failed to add inventory.");
          console.error(error.msg);
        });
    },
  });

  // api call
  const fetchInventoryList = () => {
    setTableLoading(true);
    Listinventory(page, 10, token)
      .then((res) => {
        setInventoryList(res.data.data);
        setwholedata(res.data);
        setTotal(res.data?.total || 0);
      })
      .catch((error) => {
        console.error("FAILED LIST INVENTORY DATA", error);
      })
      .finally(() => {
        setTableLoading(false);
      });
  };

  const getallinventorydata = () => {
    const payload = new FormData();
    payload.append("token", token);
    Promise.all([
      getdailinventroy(payload),
    ]).then(([inventoryRes]) => {
      const invData = inventoryRes?.data?.data;
      if (Array.isArray(invData) && invData.length > 0) {
        setDailyInventory(invData[0]);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
     getallinventorydata()  
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchInventoryList();
  }, [page, token]);







  const handeleview = (record: InventoryItem) => {
    const payload = new FormData();
    payload.append("token", token);
    payload.append("inventory_id", record.id);

    list_inventory_log(payload, 1, 10).then((res) => {
      const logs = res.data.data;
      setlist_inventory_logs(logs);
      navigte("inventorylistview", {
        state: {
          userid: record.id,
          logs: logs,
        },
      });
    });
  };

  const handleEdit = (record: InventoryItem) => {
    formik.setValues({
      id: record.id,
      total_quantity: record.total_quantity,
      comment: record.comment || "",
    });
    setIsEditModalOpen(true);
  };

  // api call end

  // List inventory
  const columns1 = [
    {
      title: "Slot",
      dataIndex: "slot_name",
      key: "slot_name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Previous Quantity",
      dataIndex: "pervious_quantity",
      key: "pervious_quantity",
    },
    {
      title: "Remaining Quantity",
      dataIndex: "remaining_quantity",
      key: "remaining_quantity",
    },
    {
      title: "Status",
      dataIndex: "status_text",
      key: "status_text",
      render: (text: any, record: { status: number }) => (
        <span style={{ color: record.status === 1 ? "green" : "red" }}>
          {text}
        </span>
      ),
    },
    {
      title: "Given By",
      dataIndex: "given_by_name",
      key: "given_by_name",
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      render: (text: any) => text || "—",
    },
  ];

  // Log inventory

  const columns = [
    {
      title: "Slot Name",
      dataIndex: "slot_name",
      key: "slot_name",
    },
    {
      title: "Total Quantity",
      dataIndex: "total_quantity",
      key: "total_quantity",
    },
    {
      title: "Available Quantity",
      dataIndex: "available_quantity",
      key: "available_quantity",
    },
    {
      title: "Used Quantity",
      dataIndex: "used_quantity",
      key: "used_quantity",
    },
    {
      title: "Status",
      dataIndex: "status_text",
      key: "status_text",
      render: (text: string) => (
        <span style={{ color: text === "Active" ? "#52c41a" : "#ff4d4f" }}>
          {text}
        </span>
      ),
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      render: (text: string | null) => text || "—",
    },
    // {
    //   title:"Addstatus",
    //   dataIndex:"is_add_status",
    //   key:"is_add_status",
    // },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: InventoryItem) => (
        <>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handeleview(record)}
          ></Button>
          {!(wholedata.is_add_status === 0 && record.status === 2) && (
            <Button
              type="link"
              icon={<EditOutlined style={{ color: "#CD5C5C" }} />}
              onClick={() => handleEdit(record)}
            />
          )}
        </>
      ),
    },
  ];

  // DAILY INVENTORY TABLE
  return (
    <>
      <Card style={{ backgroundColor: "#f6ffed" }}>
        <Typography.Title level={3} style={{ fontWeight: 700 }}>
          INVENTORY
        </Typography.Title>
      </Card>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Spin size="large" indicator={customSpinIcon} />
        </div>
      ) : (
        <>
          {dailyInventory && (
            <Row gutter={16} style={{ marginTop: 20 }}>
              <Col xs={24} md={8}>
                <Card style={{ backgroundColor: "#e8f5e9" }}>
                  <Row align="middle" gutter={8}>
                    <Col>
                      <ClockCircleOutlined
                        style={{ fontSize: 20, color: "#1890ff" }}
                      />
                    </Col>
                    <Col>
                      <Typography.Text strong>Morning Slot</Typography.Text>
                      <Typography.Title
                        level={4}
                        style={{ margin: 0, color: "#0050b3" }}
                      >
                        {dailyInventory.mrng_slot_count}
                      </Typography.Title>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card style={{ backgroundColor: "#fff0f6" }}>
                  <Row align="middle" gutter={8}>
                    <Col>
                      <FieldTimeOutlined
                        style={{ fontSize: 20, color: "#c41d7f" }}
                      />
                    </Col>
                    <Col>
                      <Typography.Text strong>Evening Slot</Typography.Text>
                      <Typography.Title
                        level={4}
                        style={{ margin: 0, color: "#9e1068" }}
                      >
                        {dailyInventory.eve_slot_count}
                      </Typography.Title>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card style={{ backgroundColor: "#f6ffed" }}>
                  <Row align="middle" gutter={8}>
                    <Col>
                      <AppstoreAddOutlined
                        style={{ fontSize: 20, color: "#389e0d" }}
                      />
                    </Col>
                    <Col>
                      <Typography.Text strong>Total Inventory</Typography.Text>
                      <Typography.Title
                        level={4}
                        style={{ margin: 0, color: "#237804" }}
                      >
                        {dailyInventory.total_inventory_count}
                      </Typography.Title>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          )}

          <div style={{ marginTop: 40 }}>
            {dailyInventory && (
              <InventoryLineChart
                mrngData={dailyInventory.mrng_data}
                eveningData={dailyInventory.evening_data}
              />
            )}
          </div>

        <Box  sx={{marginTop:"30px"}}>
           <MilkRequiredReport/>
        </Box>

          <div style={{ marginTop: 40 }}>
            <Card
              title="Inventory List"
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsAddModalOpen(true)}
                >
                  Add
                </Button>
              }
            >
              <Spin spinning={tableLoading} indicator={customSpinIcon}>
                <Table
                  columns={columns}
                  dataSource={inventoryList.map((item) => ({
                    ...item,
                    key: item.id,
                  }))}
                  pagination={{
                    current: page,
                    pageSize: 10,
                    total: total,
                    onChange: (newPage) => setPage(newPage),
                  }}
                />
              </Spin>
            </Card>
          </div>

          {/* ADD INVENTORY MODEL */}
          <Modal
            title="Add Inventory"
            open={isAddModalOpen}
            onOk={() => addFormik.handleSubmit()}
            onCancel={() => setIsAddModalOpen(false)}
            okText="Add"
          >
            <Form layout="vertical">
              <Form.Item
                label="Total Quantity"
                validateStatus={addFormik.errors.total_quantity ? "error" : ""}
                help={addFormik.errors.total_quantity}
              >
                <InputNumber
                  name="total_quantity"
                  value={addFormik.values.total_quantity}
                  onChange={(value) =>
                    addFormik.setFieldValue("total_quantity", value)
                  }
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                label="Comment"
                validateStatus={addFormik.errors.comment ? "error" : ""}
                help={addFormik.errors.comment}
              >
                <Input.TextArea
                  name="comment"
                  value={addFormik.values.comment}
                  onChange={addFormik.handleChange}
                />
              </Form.Item>
            </Form>
          </Modal>
          {/* ADD INVENTORY MODEL */}

          {/* UPDATED INVENTOY MODEL */}
          <Modal
            title="Update Inventory"
            open={isEditModalOpen}
            onOk={() => formik.handleSubmit()}
            onCancel={() => setIsEditModalOpen(false)}
            okText="Update"
          >
            <AntForm layout="vertical">
              <AntForm.Item
                label="Total Quantity"
                validateStatus={formik.errors.total_quantity ? "error" : ""}
                help={formik.errors.total_quantity}
              >
                <InputNumber
                  name="total_quantity"
                  value={formik.values.total_quantity}
                  onChange={(value) =>
                    formik.setFieldValue("total_quantity", value)
                  }
                  style={{ width: "100%" }}
                />
              </AntForm.Item>

              <AntForm.Item label="Comment">
                <Input.TextArea
                  name="comment"
                  value={formik.values.comment}
                  onChange={formik.handleChange}
                />
              </AntForm.Item>
            </AntForm>
          </Modal>
          {/* UPDATED INVENTOY MODEL */}
          {/* VIEW IN VNTOY LOG MODEL */}
          <Modal
            title={null}
            open={isViewModelOpen}
            onCancel={() => setViewModelOpen(false)}
            footer={null}
            width="calc(100vw - 250px)"
            style={{
              top: 20,
              marginLeft: "250px",
              padding: 0,
            }}
            bodyStyle={{
              height: "90vh",
              padding: "5px",
              overflowY: "auto",
              background: "#f9f9f9",
            }}
            closable={false}
          >
            <Spin spinning={false}>
              <Table
                columns={columns1}
                dataSource={islist_inventory_logs.map((item) => ({
                  ...item,
                  key: item.id,
                }))}
                pagination={{ pageSize: 20 }}
                scroll={{ x: "1000px" }}
                bordered
                size="middle"
                style={{ backgroundColor: "#fff" }}
              />
            </Spin>
          </Modal>
          {/* VIEW IN VNTOY LOG MODEL */}
        </>
      )}

      <ToastContainer />
    </>
  );
}

export default AdminDashboard;
