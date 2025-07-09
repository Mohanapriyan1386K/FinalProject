import GlobalModal from "../../Compontents/GlobalModal";
import { Descriptions, Table, Typography } from "antd";
import React from "react";

interface ViewUserModalProps {
  open: boolean;
  onClose: () => void;
  userData: any | null;
}
const userTypeMap: Record<number, string> = {
  2: "Admin",
  3: "Vendor",
  4: "Distributor",
  5: "Customer",
};

const ViewUserModal: React.FC<ViewUserModalProps> = ({
  open,
  onClose,
  userData,
}) => {
  return (
    <GlobalModal
      title="User Details"
      open={open}
      onCancel={onClose}
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
              {userTypeMap[userData.user_type] || "Unknown"}
            </Descriptions.Item>
            <Descriptions.Item label="Name">{userData.name}</Descriptions.Item>
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
              { title: "Quantity", dataIndex: "quantity", key: "quantity" },
              {
                title: "Method",
                dataIndex: "method",
                key: "method",
                render: (value: number) =>
                  value === 1 ? "Cash" : value === 2 ? "UPI" : "Unknown",
              },
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
              { title: "Quantity", dataIndex: "quantity", key: "quantity" },
              { title: "Method", dataIndex: "method", key: "method",render:(value:number)=>value==1 ?"Cash":"UPI" },
              {
                title: "Scheduled Date",
                dataIndex: "scheduled_date",
                key: "scheduled_date",
              },
            ]}
          />
        </>
      )}
    </GlobalModal>
  );
};

export default ViewUserModal;
