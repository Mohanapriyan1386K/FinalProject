import { Table, Typography } from "antd";
import { useLocation,useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import CustomButton from "../../../Compontents/CoustomButton";

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

function Inventorylistview() {
  const navigate=useNavigate()
  const location = useLocation();
  const {logs = [] } = location.state || {};

  const handlenav=()=>{
      navigate(-1)
  }

  return (
    <div>
       <Box  sx={{backgroundColor:"#a5d6a7",padding:"20px",display:"flex",justifyContent:"space-between"}}   >
       <Typography  style={{fontSize:"30px",fontWeight:"700"}} >INVENTORY LOG</Typography>
       <CustomButton buttonName="Back" onClick={handlenav} sx={{backgroundColor:"#2E7D32"}} />
       </Box>
      <Table
        columns={columns1}
        dataSource={logs.map((item: { id: any }) => ({
          ...item,
          key: item.id,
        }))}
        pagination={{
          pageSize: 10,
          defaultCurrent: 1,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        bordered
        size="middle"
        scroll={{ x: "1000px" }}
        style={{ backgroundColor: "#fff" }}
      />
    </div>
  );
}

export default Inventorylistview;
