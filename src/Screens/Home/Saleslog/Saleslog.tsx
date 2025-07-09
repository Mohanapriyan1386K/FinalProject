import { Paper, Typography, Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useUserdata } from "../../../Hooks/UserHook";
import type { ColumnsType } from "antd/es/table";
import { useFormik } from "formik";
import {
  listdistbutedlog,
  distributerdropdown,
  VendorMilkreport,
} from "../../../Services/ApiService";
import { Select } from "antd";
import CustomTable from "../../../Compontents/CustomTable";
import CustomButton from "../../../Compontents/CoustomButton";
import Loader from "../../../Compontents/Loader"

const { Option } = Select;

function Saleslog() {
  const today = new Date().toISOString().split("T")[0];

  interface FilterValues {
    distributor_id: string;
    from_date: string;
    log_type: string;
    to_date: string;
  }

  interface DistributionLog {
    id: number;
    customer_id: number;
    customer_name: string;
    given_by_id: number;
    given_by_name: string;
    inventory_id: number;
    slot_id: number;
    slot_name: string;
    type: number;
    type_name: string;
    quantity: number;
    pervious_quantity: number;
    remaining_quantity: number;
    is_distributed: number;
    status: number;
    created_at: string;
    created_by: number;
  }

  interface InventorySummaryVendor {
    remaining_qty: number;
    vendor_sales_qty: number;
    distributor_taken_qty: number;
    distributor_return_qty: number;
    distributor_sales_qty: number;
  }

  const [data, setData] = useState<DistributionLog[]>([]);
  const [distbutordropdown, setdisributeddropdown] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [vendormilkreport, setvendormilkreport] = useState<InventorySummaryVendor>();
  const token = useUserdata();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const formik = useFormik<FilterValues>({
    initialValues: {
      distributor_id: "",
      from_date: today,
      log_type: "2",
      to_date: today,
    },
    onSubmit: (values) => {
      setCurrentPage(1);
      fetchListDistributedLog(values, 1, pageSize);
      fetchmilkreport(values);
    },
  });

  const distributionColumns: ColumnsType<DistributionLog> = [
    {
      title: "S.No",
      render: (_: any, __: any, index: number) => (
        <span style={{ fontSize: 12 }}>{(currentPage - 1) * pageSize + index + 1}</span>
      ),
      width: 10,
    },
    {
      title: "Customer",
      dataIndex: "customer_name",
      key: "customer_name",
      render: (value) => (value == null ? "---" : value),
    },
    { title: "Given By", dataIndex: "given_by_name", key: "given_by_name" },
    { title: "Slot", dataIndex: "slot_name", key: "slot_name" },
    { title: "Type", dataIndex: "type_name", key: "type_name" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Previous Qty", dataIndex: "pervious_quantity", key: "pervious_quantity" },
    { title: "Remaining Qty", dataIndex: "remaining_quantity", key: "remaining_quantity" },
    {
      title: "Distributed",
      dataIndex: "is_distributed",
      key: "is_distributed",
      render: (value) => (value === 2 ? "Yes" : "No"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value) => (value === 1 ? "Active" : "Inactive"),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (value) => new Date(value).toLocaleString(),
    },
  ];

  const fetchCustomerdropdown = () => {
    const payload = new FormData();
    payload.append("token", token);
    distributerdropdown(payload).then((res) => {
      setdisributeddropdown(res.data.data);
    });
  };

  const fetchmilkreport = (filters: FilterValues) => {
    const payload = new FormData();
    payload.append("token", token);
    payload.append("from_date", filters.from_date);
    payload.append("to_date", filters.to_date);
    VendorMilkreport(payload).then((res) => {
      setvendormilkreport(res.data.data);
    });
  };

  const fetchListDistributedLog = (
    filters: FilterValues,
    page = 1,
    limit = 10
  ) => {
    const payload = new FormData();
    payload.append("token", token);
    payload.append("page", page.toString());
    payload.append("limit", limit.toString());

    if (filters.distributor_id) payload.append("distributor_id", filters.distributor_id);
    if (filters.from_date) payload.append("from_date", filters.from_date);
    if (filters.to_date) payload.append("to_date", filters.to_date);
    if (filters.log_type) payload.append("log_type", filters.log_type);

    setLoading(true);

    listdistbutedlog(payload)
      .then((res) => {
        setData(res.data.data || []);
        setTotal(res.data.total || 0);
      })
      .catch((err) => {
        console.error(err.msg || err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleReset = () => {
    const defaultValues = {
      distributor_id: "",
      from_date: today,
      to_date: today,
      log_type: "2",
    };
    formik.setValues(defaultValues);
    setCurrentPage(1);
    fetchListDistributedLog(defaultValues, 1, pageSize);
    fetchmilkreport(defaultValues);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    fetchListDistributedLog(formik.values, page, pageSize);
  };

  useEffect(() => {
    fetchCustomerdropdown();
    const initialFilter: FilterValues = {
      distributor_id: "",
      from_date: today,
      to_date: today,
      log_type: "2",
    };
    fetchListDistributedLog(initialFilter, 1, pageSize);
    fetchmilkreport(initialFilter);
  }, []);

  return (
    <Paper sx={{ padding: 3, backgroundColor: "#E8F5E9" }}>
      <Typography sx={{ fontWeight: 700, fontSize: "25px", mb: 2 }}>
        Sales Log
      </Typography>

      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        {/* First Row */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Box sx={{ minWidth: 250 }}>
            <label>Log Type</label>
            <Select
              style={{ width: "100%" }}
              name="log_type"
              value={formik.values.log_type}
              onChange={(value) => formik.setFieldValue("log_type", value)}
              onBlur={() => formik.setFieldTouched("log_type", true)}
              placeholder="Select Log Type"
              allowClear
            >
              <Option value="1">Distributor</Option>
              <Option value="2">Vendor</Option>
            </Select>
          </Box>
          {formik.values.log_type === "1" && (
            <Box sx={{ minWidth: 250 }}>
              <label>Distributor</label>
              <Select
                style={{ width: "100%" }}
                name="distributor_id"
                value={formik.values.distributor_id}
                onChange={(value) => formik.setFieldValue("distributor_id", value)}
                onBlur={() => formik.setFieldTouched("distributor_id", true)}
                placeholder="Select Distributor"
                allowClear
              >
                {distbutordropdown?.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Box>
          )}
        </Box>

        {/* Date Filters */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            label="From Date"
            name="from_date"
            type="date"
            value={formik.values.from_date}
            onChange={formik.handleChange}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 250 }}
          />
          <TextField
            label="To Date"
            name="to_date"
            type="date"
            value={formik.values.to_date}
            onChange={formik.handleChange}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 250 }}
          />
        </Box>

        {/* Buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <CustomButton
            buttonName="Submit"
            type="submit"
            sx={{ backgroundColor: "#4EB24E" }}
          />
          <CustomButton
            buttonName="Reset"
            sx={{ backgroundColor: "red" }}
            onClick={handleReset}
          />
        </Box>
      </Box>

      {/* Summary Cards */}
      <Paper sx={{ marginTop: 2 }}>
        <Box>
          {formik.values.log_type === "1" && (
            <Paper sx={{ padding: 2, display: "flex", gap: 2 }}>
              <Box sx={{ backgroundColor: "#E8F5E9", padding: 2, borderRadius: 2 }}>
                <Typography>Distributed Sales Quantity</Typography>
                <Typography>{vendormilkreport?.distributor_sales_qty}</Typography>
              </Box>
              <Box sx={{ backgroundColor: "#FFF0F6", padding: 2 }}>
                <Typography>Distributed Return Quantity</Typography>
                <Typography>{vendormilkreport?.distributor_return_qty}</Typography>
              </Box>
              <Box sx={{ backgroundColor: "#F6FFED", padding: 2 }}>
                <Typography>Distributed Taken Quantity</Typography>
                <Typography>{vendormilkreport?.distributor_taken_qty}</Typography>
              </Box>
            </Paper>
          )}
          {formik.values.log_type === "2" && (
            <Paper sx={{ padding: 2, display: "flex", gap: 2 }}>
              <Box sx={{ backgroundColor: "#E8F5E9", padding: 2, borderRadius: 2 }}>
                <Typography>Remaining Quantity</Typography>
                <Typography>{vendormilkreport?.remaining_qty}</Typography>
              </Box>
              <Box sx={{ backgroundColor: "#FFF0F6", padding: 2 }}>
                <Typography>Vendor Sales Quantity</Typography>
                <Typography>{vendormilkreport?.vendor_sales_qty}</Typography>
              </Box>
            </Paper>
          )}
        </Box>
      </Paper>

      {/* Table */}
      <Paper sx={{ marginTop: 2 }}>
        <CustomTable
          dataSource={data}
          columns={distributionColumns}
          loading={loading}
          currentPage={currentPage}
          pageSize={pageSize}
          total={total}
          onPageChange={handlePageChange}
        />
      </Paper>
    </Paper>
  );
}

export default Saleslog;
