import { useEffect, useState } from "react";
import { useUserdata } from "../../Hooks/UserHook";
import {
  masterReasonCreate,
  masterReasonDelete,
  masterReasonList,
  masterReasonStatus,
  masterReasonUpdate,
} from "../../Services/ApiService";
import type { ColumnsType } from "antd/es/table";
import { Box, Paper, Typography } from "@mui/material";
import CustomButton from "../../Compontents/CoustomButton";
import CustomTable from "../../Compontents/CustomTable";
import ConfirmActionModal from "../../Screens/Modal/ConfirmActionModalPricetag";
import ReasonFormModal from "../Modal/MasterReasonAddUpdate";
import { Tooltip } from "antd";
import {
  CheckCircleTwoTone,
  StopTwoTone,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import Loader from "../../Compontents/Loader";

function Reason() {
  interface Reasondata {
    id: number;
    name: string;
    created_at: string;
    status: number;
    status_text: string;
    type: string;
    type_name: string;
    updated_at: string;
  }

  const [fetchdata, setFetchdata] = useState<Reasondata[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [currentpage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const token = useUserdata();
  const [loading, setloading] = useState(false);

  const ReasonFetch = () => {
    const payload = new FormData();
    payload.append("token", token);

    masterReasonList(payload)
      .then((res) => {
        setFetchdata(res.data.data);
        setloading(true)
      })
      .catch((error) => toast.error(error))
      .finally(() => {
        setloading(false);
      });
  };

  useEffect(() => {
    ReasonFetch();
  }, []);

  const handleEditClick = (record: Reasondata) => {
    setEditData({
      id: record.id,
      name: record.name,
      type: record.type,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (record: Reasondata) => {
    ConfirmActionModal({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this reason?",
      okText: "Delete",
      cancelText: "Cancel",
      danger: true,
      onOk: () => {
        const payload = new FormData();
        payload.append("token", token);
        payload.append("id", record.id.toString());

        masterReasonDelete(payload)
          .then((res) => {
            toast.success(res.data.msg);
            ReasonFetch();
          })
          .catch(() => {
            toast.error("Try again");
          });
      },
    });
  };

  const confirmStatusChange = (record: Reasondata) => {
    const newStatus = record.status === 1 ? 2 : 1;
    const actionText = record.status === 1 ? "Deactivate" : "Activate";

    ConfirmActionModal({
      title: `Confirm ${actionText}`,
      content: `Are you sure you want to ${actionText.toLowerCase()} this reason?`,
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        const payload = new FormData();
        payload.append("token", token);
        payload.append("id", record.id.toString());
        payload.append("status", newStatus.toString());

        masterReasonStatus(payload)
          .then(() => {
            toast.success("Status updated successfully");
            ReasonFetch();
          })
          .catch(() => {
            toast.error("Try again");
          });
      },
    });
  };

  const reasonColumns: ColumnsType<Reasondata> = [
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
    },
    {
      title: "Type",
      dataIndex: "type_name",
      key: "type_name",
    },
    {
      title: "Status",
      dataIndex: "status_text",
      key: "status_text",
      render: (_, record) => (
        <span style={{ color: record.status === 1 ? "green" : "red" }}>
          {record.status_text}
        </span>
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Box sx={{ display: "flex", gap: 2 }}>
          <Tooltip title="Edit">
            <EditOutlined
              style={{ color: "#1890ff", cursor: "pointer" }}
              onClick={() => handleEditClick(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <DeleteOutlined
              style={{ color: "#ff4d4f", cursor: "pointer" }}
              onClick={() => handleDelete(record)}
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

  const handleFormSubmit = (values: any) => {
    const payload = new FormData();
    payload.append("token", token);
    payload.append("name", values.name);
    payload.append("type", values.type);

    if (editData?.id) {
      payload.append("reason_id", editData.id.toString());
      masterReasonUpdate(payload)
        .then(() => {
          toast.success("Updated successfully");
          ReasonFetch();
          setIsModalOpen(false);
        })
        .catch(() => toast.error("Update failed"));
    } else {
      masterReasonCreate(payload)
        .then(() => {
          toast.success("Added successfully");
          ReasonFetch();
          setIsModalOpen(false);
        })
        .catch(() => toast.error("Add failed"));
    }
  };

  return (
    <>
      {loading ? (
        <Box>
          <Loader />
        </Box>
      ) : (
        <Box>
          <Paper sx={{ padding: 2 }}>
            <Box
              sx={{
                padding: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Paper sx={{width:"100%",display:"flex",justifyContent:"space-between",padding:2,backgroundColor:"#E8F5E9"}}>
              <Typography sx={{ fontSize: "25px", fontWeight: 700 }}>
                REASON
              </Typography>
              <CustomButton
                buttonName="+ ADD REASON"
                sx={{ backgroundColor: "#4EB24E" }}
                onClick={() => {
                  setEditData(null);
                  setIsModalOpen(true);
                }}
              />
               </Paper>
            </Box>

            <CustomTable
              dataSource={fetchdata}
              columns={reasonColumns}
              currentPage={currentpage}
              total={fetchdata.length}
              onPageChange={(page, pageSize) => {
                setCurrentPage(page);
                setPageSize(pageSize);
              }}
            />
          </Paper>

          <ReasonFormModal
            visible={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleFormSubmit}
            isEdit={!!editData}
            initialValues={
              editData ?? {
                name: "",
                type: "",
              }
            }
          />
        </Box>
      )}
    </>
  );
}

export default Reason;
