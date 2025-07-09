import { useEffect, useState } from "react";
import { useUserdata } from "../../Hooks/UserHook";
import { slotMaster,slotUapdateMaster} from "../../Services/ApiService";
import type { ColumnsType } from "antd/es/table";
import CustomTable from "../../Compontents/CustomTable";
import {Tooltip } from "antd";
import { EditOutlined } from "@mui/icons-material";
import MastersSlotupdate from "../Modal/MastersSlotupdate";
import { useFormik } from "formik";
import { Box, Paper, Typography } from "@mui/material";
import { toast } from "react-toastify";

interface InventorySlot {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  booking_end: string;
  inventory_start_time: string | null;
  inventory_end_time: string;
  status: number;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by?: string | null;
}

function Slot() {
  const Token = useUserdata();
  const [slotdata, setslotdata] = useState<InventorySlot[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      token: Token,
      slot_id: 0,
      name: "",
      inventory_end_time: "",
      start_time: "",
      end_time: "",
      booking_end: "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      const payload=new FormData()
      payload.append("token",Token),
      payload.append("slot_id",values.slot_id.toString())
      payload.append("name",values.name)
      payload.append("inventory_end_time",values.inventory_end_time)
      payload.append("start_time",values.start_time)
      payload.append("end_time",values.end_time)
      payload.append("booking_end",values.booking_end)
      slotUapdateMaster(payload)
        .then((res) => {
          toast.success(res.data.msg)
          fetchslotdata();
          setModalOpen(false)
        })
        .catch((err) => {
          toast.error(err.msg)
        });
    },
  });

  const handleEdit = (record: InventorySlot) => {
    formik.setValues({
      token: Token,
      slot_id: record.id,
      name: record.name,
      inventory_end_time: record.inventory_end_time,
      start_time: record.start_time,
      end_time: record.end_time,
      booking_end: record.booking_end,
    });
    setModalOpen(true);
  };

  const columns: ColumnsType<InventorySlot> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Start Time",
      dataIndex: "start_time",
      key: "start_time",
    },
    {
      title: "End Time",
      dataIndex: "end_time",
      key: "end_time",
    },
    {
      title: "Booking End",
      dataIndex: "booking_end",
      key: "booking_end",
    },
    {
      title: "Inventory End Time",
      dataIndex: "inventory_end_time",
      key: "inventory_end_time",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (status === 1 ? "Active" : "Inactive"),
    },
    {
      title: "Created By",
      dataIndex: "created_by",
      key: "created_by",
    },
    {
      title: "Updated By",
      dataIndex: "updated_by",
      key: "updated_by",
      render: (text: any) => text ?? "N/A",
    },
    {
      title: "Action",
      key: "actions",
      render: (_: any, record: InventorySlot) => (
        <Box>
          <Tooltip title="Update">
            <EditOutlined
              style={{
                color: "#1b5e20",
                cursor: "pointer",
                fontSize: "18px",
              }}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
        </Box>
      ),
    },
  ];

  const fetchslotdata = () => {
    const payload = new FormData();
    payload.append("token", Token);
    slotMaster(payload).then((res) => {
      setslotdata(res.data.data);
    });
  };

  useEffect(() => {
    if (Token) {
      fetchslotdata();
    }
  }, [Token]);

  return (
    <>
      <Paper sx={{display:"flex",alignItems:"center",justifyContent:"space-between",backgroundColor:"#E8F5E9",marginBottom:2,padding:2}}>
            <Typography sx={{fontWeight:700,fontSize:25}}>Slot</Typography>
          </Paper>
      <CustomTable columns={columns} dataSource={slotdata} />
      <MastersSlotupdate
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        formik={formik}
      />
    </>
  );
}

export default Slot;
