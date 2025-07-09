import { useEffect, useState } from "react";
import { useUserdata } from "../../Hooks/UserHook";
import {
  masterpricetageList,
  masterpricetageActive,
  masterpricetageDelete,
  masterpricetageCreate,
  masterpricetageUpdate,
} from "../../Services/ApiService";
import { toast } from "react-toastify";
import { Tag, Tooltip } from "antd";
import { Box, Paper, Typography } from "@mui/material";
import CustomTable from "../../Compontents/CustomTable";
import Loader from "../../Compontents/Loader";
import {
  CheckCircleTwoTone,
  StopTwoTone,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import ConfirmActionModal from "../../Screens/Modal/ConfirmActionModalPricetag";
import CustomButton from "../../Compontents/CoustomButton";
import PriceTagFormModal from "../Modal/MasterPriceAddupdate";
import type { ColumnsType } from "antd/es/table";

function Pricetag() {
  interface RouteData {
    id: number;
    name: string;
    price: string;
    status: number;
    status_text: string;
    created_at: string;
    updated_at: string;
  }

  const token = useUserdata();
  const [pricetagdata, setpricetagdata] = useState<RouteData[]>([]);
  const [loading, setloading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchdata(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const fetchdata = (page: number = 1, size: number = 10) => {
    const payload = new FormData();
    payload.append("token", token);
    setloading(true);
    masterpricetageList(payload, page, size)
      .then((res) => {
        setpricetagdata(res.data.data);
        setTotalItems(res.data.total || res.data?.pagination?.total || 0); // fallback for total
      })
      .catch(() => {
        toast.error("Data is not fetched");
      })
      .finally(() => {
        setloading(false);
      });
  };

  const confirmStatusChange = (record: any) => {
    const newStatus = record.status === 1 ? 2 : 1;
    const actionText = record.status === 1 ? "Deactivate" : "Activate";

    ConfirmActionModal({
      title: `Confirm ${actionText}`,
      content: `Are you sure you want to ${actionText.toLowerCase()} this price tag?`,
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        const payload = new FormData();
        payload.append("token", token);
        payload.append("id", record.id);
        payload.append("status", newStatus.toString());

        masterpricetageActive(payload)
          .then((res) => {
            if(res.data.status==0){
              toast.error(res.data.msg)
            }
            else if(res.data.status==1){
              toast.success("Status updated successfully");
            }
            fetchdata(currentPage, pageSize);
          })
          .catch(() => {
            toast.error("Try again");
          });
      },
    });
  };

  const handleDelete = (record: any) => {
    ConfirmActionModal({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this price tag?",
      okText: "Delete",
      cancelText: "Cancel",
      danger: true,
      onOk: () => {
        const payload = new FormData();
        payload.append("token", token);
        payload.append("id", record.id);

        masterpricetageDelete(payload)
          .then((res) => {
            if(res.data.status==0){
              toast.info(res.data.msg);
              fetchdata(currentPage, pageSize);
            }else if(res.data.status==1){
               toast.success(res.data.msg)
            }
          })
          .catch(() => {
            toast.error("Try again");
          });
      },
    });
  };

  const handleAddClick = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (record: any) => {
    setEditData({
      price_tag_id: record.id,
      name: record.name,
      price: record.price,
    });
    setIsModalOpen(true);
  };

  const handlePageChange = (page: number, newPageSize: number) => {
    setCurrentPage(page);
    setPageSize(newPageSize);
  };

  const handleFormSubmit = (values: any) => {
    const payload = new FormData();
    payload.append("token", token);
    payload.append("name", values.name);
    payload.append("price", values.price);

    if (editData?.price_tag_id) {
      payload.append("price_tag_id", editData.price_tag_id);
      masterpricetageUpdate(payload)
        .then(() => {
          toast.success("Updated successfully");
          fetchdata(currentPage, pageSize);
          setIsModalOpen(false);
        })
        .catch(() => toast.error("Update failed"));
    } else {
      masterpricetageCreate(payload)
        .then(() => {
          toast.success("Added successfully");
          fetchdata(currentPage, pageSize);
          setIsModalOpen(false);
        })
        .catch(() => toast.error("Add failed"));
    }
  };

  const columns: ColumnsType<RouteData> = [
   {
      title: "S.No",
      render: (_: any, __: any, index: number) => (
        <span style={{ fontSize: 12 }}>
          {(currentPage - 1) * pageSize + index + 1}
        </span>
      ),
      width: 70,
    },
    {
      title: "Price",
      dataIndex:"price",
      key:"price"
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record: any) => (
        <Tag color={record.status === 1 ? "green" : "red"}>
          {record.status_text}
        </Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record: any) => (
        <Box sx={{ display: "flex", gap: 4 }}>
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

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Box>
          <Paper sx={{ backgroundColor: "#E8F5E9" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 5,
                p: 2,
              }}
            >
              <Typography sx={{ fontSize: 25 }}>Price Tag</Typography>
              <CustomButton
                buttonName="+Add"
                sx={{ backgroundColor: "#4EB24E" }}
                onClick={handleAddClick}
              />
            </Box>
          </Paper>

          <CustomTable
            columns={columns}
            dataSource={pricetagdata}
            loading={loading}
            currentPage={currentPage}
            pageSize={pageSize}
            total={totalItems}
            onPageChange={handlePageChange}
          />

          <PriceTagFormModal
            visible={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleFormSubmit}
            isEdit={!!editData}
            initialValues={
              editData ?? {
                name: "",
                price: "",
              }
            }
          />
        </Box>
      )}
    </>
  );
}

export default Pricetag;
