import { useEffect, useState } from "react";
import { Table, Typography,Form,DatePicker, Row, Col } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { ViwslotMap } from "../../../Services/ApiService";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useUserdata } from "../../../Hooks/UserHook";
import { Paper } from "@mui/material";
import CustomButton from "../../../Compontents/CoustomButton";

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface SlotLog {
  actual_milk_quantity: number;
  assigned_name: string | null;
  assigned_to: number | null;
  customer_id: number;
  customer_name: string;
  is_assigned: string;
  milk_given_id: number;
  milk_given_quantity: number;
  milk_given_status: string;
  milk_given_type: string;
  reason: string | null;
  scheduled_date: string;
  slot_id: number;
  slot_log_id: number;
  slot_name: string;
  status: number;
  unit_price: string;
  user_pay_mode: number;
}

const SlotMapping = () => {
  const token = useUserdata();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { mode, slot_id } = state || {};

  const [filters, setFilters] = useState({
    fromDate: dayjs().format("YYYY-MM-DD"),
    toDate: dayjs().format("YYYY-MM-DD"),
    customerId: null as string | null,
    distributorId: null as string | null,
  });

  const [slotsLog, setSlotsLog] = useState<SlotLog[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleGetSlot = (
    page = 1,
    pageSize = 10,
    overrideFilters = filters,
    mode: number,
    slot_id: number
  ) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("token", token);
    formData.append("from_date", overrideFilters.fromDate);
    formData.append("to_date", overrideFilters.toDate);
    formData.append("mode", mode.toString());
    formData.append("slot_id", slot_id.toString());

    if (overrideFilters.customerId)
      formData.append("customer_id", overrideFilters.customerId);
    if (overrideFilters.distributorId)
      formData.append("distributor_id", overrideFilters.distributorId);

    ViwslotMap(formData, page, pageSize)
      .then((res) => {
        if (res.data.status) {
          setSlotsLog(res.data.data);
          setPagination({
            current: page,
            pageSize,
            total: res.data.total || res.data.data.length,
          });
        } else {
          toast.error("Failed to fetch slot logs");
        }
      })
      .catch((error: any) => {
        toast.error(
          error?.message || "Something went wrong while fetching slot logs."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!mode || !slot_id) {
      toast.error("Missing required parameters");
      navigate(-1);
      return;
    }

    handleGetSlot(
      pagination.current!,
      pagination.pageSize!,
      filters,
      mode,
      slot_id
    );
  }, []);

  const handleFilterApply = (values: any) => {
    const [from, to] = values.dateRange || [];
    const newFilters = {
      ...filters,
      fromDate: from ? dayjs(from).format("YYYY-MM-DD") : filters.fromDate,
      toDate: to ? dayjs(to).format("YYYY-MM-DD") : filters.toDate,
      customerId: values.customerId || null,
      distributorId: values.distributorId || null,
    };
    setFilters(newFilters);
    handleGetSlot(1, pagination.pageSize!, newFilters, mode, slot_id);
  };

  const columns: ColumnsType<SlotLog> = [
    { title: "Scheduled Date", dataIndex: "scheduled_date", key: "scheduled_date" },
    { title: "Slot", dataIndex: "slot_name", key: "slot_name", responsive: ["md"] },
    { title: "Customer", dataIndex: "customer_name", key: "customer_name" },
    { title: "Milk Status", dataIndex: "milk_given_status", key: "milk_given_status" },
    { title: "Given Qty (L)", dataIndex: "milk_given_quantity", key: "milk_given_quantity" },
    { title: "Actual Qty (L)", dataIndex: "actual_milk_quantity", key: "actual_milk_quantity" },
    {
      title: "Distributor",
      dataIndex: "assigned_name",
      key: "assigned_name",
      render: (value: string | null) => value || "-",
    },
  ];

  return (
  
    <div style={{ padding: 16 }}>
      <div style={{
        borderRadius:"10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        backgroundColor:"#E8F5E9",
        padding:"20px"
      }}>
        <Title level={4} style={{ margin: 0 }}>Distributor Logs</Title>
        <CustomButton sx={{backgroundColor:"#2E7D32"}} onClick={() => navigate(-1)}  buttonName="Back"/>
      </div>

      {/* Filters Section */}
      <Paper sx={{padding:1,marginBottom:2,backgroundColor:"#E8F5E9"}}>
      <Form layout="vertical" onFinish={handleFilterApply} initialValues={{
        dateRange: [dayjs(filters.fromDate), dayjs(filters.toDate)],
      }}>
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <Form.Item name="dateRange" label="Date Range">
              <RangePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6} style={{ display: "flex", alignItems: "end" }}>
            <Form.Item>
              <CustomButton sx={{backgroundColor:"#2E7D32"}} buttonName="Applay Filter" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Paper>

      {/* Table Section */}
      <Paper sx={{padding:2,backgroundColor:"#E8F5E9"}} >
      <Table
        dataSource={slotsLog}
        columns={columns}
        rowKey="slot_log_id"
        pagination={pagination}
        loading={loading}
        scroll={{ x: "max-content" }}
        size="small"
        onChange={(pagination) => {
          setPagination(pagination);
          handleGetSlot(
            pagination.current!,
            pagination.pageSize!,
            filters,
            mode,
            slot_id
          );
        }}
      />
      </Paper>
    </div>
  );
};

export default SlotMapping;
