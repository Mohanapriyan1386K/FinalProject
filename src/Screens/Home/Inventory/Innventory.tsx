// All imports remain same
import { useEffect, useState } from "react";
import {
  getdailinventroy,
  Listinventory,
  UpdateInventory,
  AddInventory,
  list_inventory_log,
  distributedloginventoy,
} from "../../../Services/ApiService";
import Loader from "../../../Compontents/Loader";
import { Card, Typography, Row, Col, Button } from "antd";
import {
  ClockCircleOutlined,
  FieldTimeOutlined,
  AppstoreAddOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Box, Paper } from "@mui/material";
import { useUserdata } from "../../../Hooks/UserHook";
import UpdateInventoryModal from "../../Modal/UpdateinventroyModel";
import Distrbutedeinventorymodal from "../../Modal/DistributedLoginventory";
import AddInventoryModal from "../../Modal/AddInventoryModal";
import InventoryLineChart from "../../Charts/InventoryLineChart";
import MilkRequiredReport from "./MilkRequiredReport";
import CustomTable from "../../../Compontents/CustomTable";
import CustomButton from "../../../Compontents/CoustomButton";

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
  id: number;
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

interface WholeData {
  is_update_status: number;
  is_add_status: number;
}

const addUpdateValidationSchema = Yup.object({
  total_quantity: Yup.number().required("Total quantity is required"),
  comment: Yup.string().nullable(),
});

const distributeValidationSchema = Yup.object({
  total_quantity: Yup.number().required("Total quantity is required"),
  milk_give_type: Yup.string().required("Milk give type is required"),
  distributor_id: Yup.string().required("Distributor is required"),
});

function AdminDashboard() {
  const navigate = useNavigate();
  const token = useUserdata();

  const [dailyInventory, setDailyInventory] = useState<DailyInventory | null>(
    null
  );
  const [inventoryList, setInventoryList] = useState<InventoryItem[]>([]);
  const [wholedata, setWholedata] = useState<WholeData>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddModalOpeninven, setIsAddModalOpeninven] = useState(false);

  const updateFormik = useFormik({
    initialValues: { id: 0, total_quantity: 0, comment: "" },
    validationSchema: addUpdateValidationSchema,
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
          fetchInventoryList();
        })
        .catch(() => toast.error("Failed to update inventory."));
    },
  });

  const addFormik = useFormik({
    initialValues: { total_quantity: 0, comment: "" },
    validationSchema: addUpdateValidationSchema,
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
        .catch(() => toast.error("Failed to add inventory."));
    },
  });

  const distributeFormik = useFormik({
    initialValues: {
      total_quantity: 0,
      milk_give_type: "",
      distributor_id: "",
    },
    validationSchema: distributeValidationSchema,
    onSubmit: async (values) => {
      const payload = new FormData();
      payload.append("token", token);
      payload.append("given_qty", values.total_quantity.toString());
      payload.append("type", values.milk_give_type);
      payload.append("distributer_id", values.distributor_id);
      distributedloginventoy(payload)
        .then(() => {
          toast.success("Distributed inventory successfully.");
          setIsAddModalOpeninven(false);
          fetchInventoryList();
        })
        .catch(() => toast.error("Failed to distribute inventory."));
    },
  });

  const fetchInventoryList = () => {
    setTableLoading(true);
    const payload = new FormData();
    payload.append("token", token);
    Listinventory(page, pageSize, payload)
      .then((res) => {
        setInventoryList(res.data.data);
        setWholedata(res.data);
        setTotal(res.data?.total || 0);
      })
      .catch((error) => console.error("FAILED LIST INVENTORY DATA", error))
      .finally(() => setTableLoading(false));
  };

  const getallinventorydata = () => {
    const payload = new FormData();
    payload.append("token", token);
    getdailinventroy(payload)
      .then((res) => {
        const invData = res?.data?.data;
        if (Array.isArray(invData) && invData.length > 0) {
          setDailyInventory(invData[0]);
        }
      })
      .catch(() => toast.error("Failed to load inventory summary."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getallinventorydata();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchInventoryList();
  }, [page, pageSize, token]);

  const handleView = (record: InventoryItem) => {
    const payload = new FormData();
    payload.append("token", token);
    payload.append("inventory_id", record.id.toString());
    list_inventory_log(payload, 1, 10).then((res) => {
      const logs = res.data.data;
      navigate("inventorylistview", {
        state: { userid: record.id, logs },
      });
    });
  };

  const handleEdit = (record: InventoryItem) => {
    updateFormik.setValues({
      id: record.id,
      total_quantity: record.total_quantity,
      comment: record.comment || "",
    });
    setIsEditModalOpen(true);
  };

  const handleAdd = (record: InventoryItem) => {
    distributeFormik.setValues({
      total_quantity: record.total_quantity,
      milk_give_type: "",
      distributor_id: "",
    });
    setIsAddModalOpeninven(true);
  };

  const columns = [
    {
      title: "S.No",
      render: (_: any, __: any, index: number) => (
        <span>{(page - 1) * pageSize + index + 1}</span>
      ),
      width: 60,
    },
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
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: InventoryItem) => (
        <>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          />
          {wholedata?.is_update_status === 1 && record.status === 1 && (
            <>
              <Button
                type="link"
                icon={<EditOutlined style={{ color: "#CD5C5C" }} />}
                onClick={() => handleEdit(record)}
              />
              <Button
                type="link"
                icon={<PlusOutlined style={{ color: "#2E7D32" }} />}
                onClick={() => handleAdd(record)}
              />
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <>
       <Paper sx={{padding:2, backgroundColor:"#E8F5E9"}}>
        <Typography.Title level={3} style={{ fontWeight: 700 }}>
          INVENTORY
        </Typography.Title>
       </Paper>
      

      {loading ? (
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Loader />
        </div>
      ) : (
        <>
          {dailyInventory && (
            <Row gutter={16} style={{ marginTop: 20 }}>
              <Col xs={24} md={8}>
                <Card
                  style={{ backgroundColor: "#e8f5e9", borderRadius: "10px" }}
                >
                  <Row align="middle" gutter={12}>
                    <Col>
                      <ClockCircleOutlined
                        style={{ fontSize: 22, color: "#1890ff" }}
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
                <Card
                  style={{ backgroundColor: "#fff0f6", borderRadius: "10px" }}
                >
                  <Row align="middle" gutter={12}>
                    <Col>
                      <FieldTimeOutlined
                        style={{ fontSize: 22, color: "#c41d7f" }}
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
                <Card
                  style={{ backgroundColor: "#f6ffed", borderRadius: "10px" }}
                >
                  <Row align="middle" gutter={12}>
                    <Col>
                      <AppstoreAddOutlined
                        style={{ fontSize: 22, color: "#389e0d" }}
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

          <Box sx={{ marginTop: "30px" }}>
            <MilkRequiredReport />
          </Box>

          <div style={{ marginTop: 40 }}>
            <Card
              title="Inventory List"
              extra={
                wholedata?.is_add_status === 1 ? (
                  <CustomButton
                    buttonName="Add"
                    onClick={() => setIsAddModalOpen(true)}
                    sx={{ backgroundColor: "green" }}
                  />
                ) : (
                  <Paper
                    sx={{
                      padding: 1,
                      backgroundColor: "#e8f5e9",
                      color: "red",
                      fontWeight: "700",
                    }}
                  >
                    This Time Inventory will be closed
                  </Paper>
                )
              }
            >
              <CustomTable
                dataSource={inventoryList}
                columns={columns}
                currentPage={page}
                total={total}
                onPageChange={(newPage, newSize) => {
                  setPage(newPage);
                  setPageSize(newSize);
                }}
                pageSize={pageSize}
                loading={tableLoading}
              />
            </Card>
          </div>

          {/* Modals */}
          <AddInventoryModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            formik={addFormik}
          />

          <UpdateInventoryModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            formik={updateFormik}
          />

          <Distrbutedeinventorymodal
            isOpen={isAddModalOpeninven}
            onClose={() => setIsAddModalOpeninven(false)}
            formik={distributeFormik}
          />
        </>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}

export default AdminDashboard;
