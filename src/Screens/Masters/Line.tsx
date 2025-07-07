import { useEffect, useState } from "react";
import { useUserdata } from "../../Hooks/UserHook";
import {
  masterLineList,
  masterLineListDelete,
  masterLineStautus,
  masterLineAdd,
  masterLineListUpadate
} from "../../Services/ApiService";
import type { ColumnsType } from "antd/es/table";
import { Tag, Tooltip } from "antd";
import CustomTable from "../../Compontents/CustomTable";
import { Box } from "@mui/material";
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleTwoTone,
  StopTwoTone,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import ConfirmActionModal from "../Modal/MasterLinedeleteandstauschange";
import MasterAddLinsMoadal from "../Modal/MasterAddLinsMoadl";
import Linupadate from "../Modal/LinesUpdateModal";
import { useFormik } from "formik";
import * as Yup from "yup";

function Line() {
  interface RouteData {
    id: number;
    name: string;
    description: string;
    status: number;
    status_text: string;
    created_at: string;
    updated_at: string;
  }

  const Token = useUserdata();
  const [data, setData] = useState<RouteData[]>([]);
  const [currentpage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const [selectedRecord, setSelectedRecord] = useState<RouteData | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setStatusModalOpen] = useState(false);
  const [isAddmodal, setAddmodal] = useState(false);
  const [updatemodal, setUpdateModalopen] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Price is required"),
  });

  const formik = useFormik({
    initialValues: {
      token: Token,
      name: "",
      description: "",
    },
    validationSchema:validationSchema,
    onSubmit: (values) => {
      const payload = new FormData();
      payload.append("token", values.token);
      payload.append("name", values.name);
      payload.append("description", values.description);

      masterLineAdd(payload)
        .then(() => {
          toast.success("Successfully added");
          fetchLineList();
          setAddmodal(false);
          formik.resetForm();
        })
        .catch(() => {
          toast.error("Failed to add line");
        });
    },
  });

  const formikUpdate = useFormik({
    initialValues: {
      lines_id: "",
      name: "",
      description: "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      const payload = new FormData();
      payload.append("token", Token);
      payload.append("lines_id", values.lines_id);
      payload.append("name", values.name);
      payload.append("description", values.description);

      masterLineListUpadate(payload)
        .then(() => {
          toast.success("Updated successfully");
          fetchLineList();
          setUpdateModalopen(false);
        })
        .catch(() => {
          toast.error("Update failed");
        });
    },
  });

  useEffect(() => {
    if (Token) {
      formik.setFieldValue("token", Token);
    }
  }, [Token]);

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const confirmDelete = (record: RouteData) => {
    setSelectedRecord(record);
    setDeleteModalOpen(true);
  };

  const confirmStatusChange = (record: RouteData) => {
    setSelectedRecord(record);
    setStatusModalOpen(true);
  };

  const editlines = (record: RouteData) => {
    formikUpdate.setValues({
      lines_id: record.id.toString(),
      name: record.name,
      description: record.description,
    });
    setUpdateModalopen(true);
  };

  const onDeleteConfirmed = () => {
    if (!selectedRecord) return;

    const payload = new FormData();
    payload.append("token", Token);
    payload.append("id", selectedRecord.id.toString());

    masterLineListDelete(payload)
      .then(() => {
        toast.success("Successfully deleted");
        fetchLineList();
      })
      .catch(() => {
        toast.error("Delete failed");
      })
      .finally(() => {
        setDeleteModalOpen(false);
        setSelectedRecord(null);
      });
  };

  const onStatusChangeConfirmed = () => {
    if (!selectedRecord) return;
    const Status = selectedRecord.status === 1 ? 2 : 1;

    const payload = new FormData();
    payload.append("token", Token);
    payload.append("id", selectedRecord.id.toString());
    payload.append("status", Status.toString());

    masterLineStautus(payload)
      .then(() => {
        toast.success("Status updated successfully");
        fetchLineList();
      })
      .catch(() => {
        toast.error("Status update failed");
      })
      .finally(() => {
        setStatusModalOpen(false);
        setSelectedRecord(null);
      });
  };

  const fetchLineList = () => {
    const payload = new FormData();
    payload.append("token", Token);
    setLoading(true);
    masterLineList(payload)
      .then((res) => {
        setData(res.data.data);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (Token) fetchLineList();
  }, [Token]);

  const routeColumns: ColumnsType<RouteData> = [
    {
      title: "S.No",
      render: (_: any, __: any, index: number) => (
        <span style={{ fontSize: 12 }}>
          {(currentpage - 1) * pageSize + index + 1}
        </span>
      ),
      width: 70,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status_text",
      key: "status_text",
      align: "center",
      render: (_, record) => (
        <Tag color={record.status === 1 ? "green" : "red"}>
          {record.status_text}
        </Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_: any, record: RouteData) => (
        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
          <Tooltip title="Edit">
            {record.status === 1 && (
              <EditOutlined
                style={{
                  color: "#1b5e20",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
                onClick={() => editlines(record)}
              />
            )}
          </Tooltip>
          <Tooltip title="Delete">
            <DeleteOutlined
              style={{ color: "red", cursor: "pointer", fontSize: "18px" }}
              onClick={() => confirmDelete(record)}
            />
          </Tooltip>
          <Tooltip title={record.status === 1 ? "Deactivate" : "Activate"}>
            {record.status === 1 ? (
              <StopTwoTone
                twoToneColor="#eb2f96"
                style={{ fontSize: "18px", cursor: "pointer" }}
                onClick={() => confirmStatusChange(record)}
              />
            ) : (
              <CheckCircleTwoTone
                twoToneColor="#52c41a"
                style={{ fontSize: "18px", cursor: "pointer" }}
                onClick={() => confirmStatusChange(record)}
              />
            )}
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <div>
      <div style={{ textAlign: "right", marginBottom: 16 }}>
        <button
          onClick={() => setAddmodal(true)}
          style={{
            background: "#4EB24E",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          + Add Line
        </button>
      </div>

      <CustomTable
        columns={routeColumns}
        dataSource={data}
        currentPage={currentpage}
        loading={loading}
        onPageChange={handlePageChange}
      />

      <ConfirmActionModal
        open={isDeleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={onDeleteConfirmed}
        title="Confirm Delete"
        content={`Are you sure you want to delete "${selectedRecord?.name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ConfirmActionModal
        open={isStatusModalOpen}
        onCancel={() => setStatusModalOpen(false)}
        onConfirm={onStatusChangeConfirmed}
        title="Confirm Status Change"
        content={`Are you sure you want to ${
          selectedRecord?.status === 1 ? "deactivate" : "activate"
        } "${selectedRecord?.name}"?`}
        confirmText="Yes"
        cancelText="No"
      />

      <MasterAddLinsMoadal
        formik={formik}
        isOpen={isAddmodal}
        onClose={() => {
          setAddmodal(false);
          formik.resetForm();
        }}
      />

      <Linupadate
        formik={formikUpdate}
        isOpen={updatemodal}
        onClose={() => {
          setUpdateModalopen(false);
          formikUpdate.resetForm();
        }}
      />
    </div>
  );
}

export default Line;
