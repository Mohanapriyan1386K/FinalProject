import { useEffect, useState } from "react";
import { Table, Typography, Tag, message, Button, Skeleton } from "antd";
import { toast } from "react-toastify";
import { distributorList } from "../../../Services/ApiService";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../../Compontents/CoustomButton";
import { useUserdata } from "../../../Hooks/UserHook";
import { Box } from "@mui/material";
import Loader from "../../../Compontents/Loader";

const { Text } = Typography;

interface Route {
  id: number;
  line_name: string;
  status: number;
  __parentId?: number;
  __distributorName?: string;
}

interface DistributorRecord {
  distributer_id: number;
  distributer_name: string;
  line_data?: Route[] | null;
}

const Distributor = () => {
  const token = useUserdata();
  const navigate = useNavigate();
  const [distributors, setDistributors] = useState<DistributorRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGetDistributorList = () => {
    if (!token) {
      toast.info("Token not found");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("token", token);

    distributorList(formData)
      .then((res) => {
        if (res.data.status === 1) {
          setDistributors(res.data.data);
        } else {
          message.error("Failed to fetch distributors");
        }
      })
      .catch((error) => {
        console.error(error);
        message.error("Something went wrong");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleGetDistributorList();
  }, []);

  const distributorColumns = [
    {
      title: "Distributor Name",
      dataIndex: "distributer_name",
      key: "distributer_name",
      render: (text: string) => <Text strong>{text.split(" - ")[0]}</Text>,
    },
    {
      title: "Phone",
      dataIndex: "distributer_name",
      key: "phone",
      render: (text: string) => <Text>{text.split(" - ")[1]}</Text>,
    },
  ];

  const routeColumns = [
    // {
    //   title: "Route ID",
    //   dataIndex: "id",
    //   key: "id",
    //   width: 100,
    // },
    {
      title: "Route Name",
      dataIndex: "line_name",
      key: "line_name",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: number) =>
        status === 1 ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
    },
    {
      title: "Action",
      key: "action",
      width: 140,
      render: (_: any, record: Route) => (
        <Button
          type="link"
          onClick={() =>
            handleRouteDetailPage(
              record,
              record.__parentId as number,
              record.__distributorName as string
            )
          }
        >
          View Details
        </Button>
      ),
    },
  ];

  const handleRouteDetailPage = (
    route: Route,
    distributorId: number,
    distributorName: string
  ) => {
    navigate(`Route`, {
      state: {
        distributorId,
        distributorName,
        line_id: route.id,
        lineName: route.line_name,
      },
    });
  };

  return (
  <Box>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "30px",
        backgroundColor: "#F6FFED",
        padding: 2,
      }}
    >
      <h2>Distributor List</h2>
      <CustomButton
        buttonName="Slot Assign"
        sx={{ backgroundColor: "#1B5E20" }}
        onClick={() => navigate("Slotassign")}
      />
    </Box>

    {loading ? (
      <Loader />
    ) : (
      <Table
        dataSource={distributors}
        columns={distributorColumns}
        rowKey="distributer_id"
        expandable={{
          expandedRowRender: (record) =>
            (record?.line_data ?? []).length > 0 ? (
              <Table
                dataSource={
                  record.line_data?.map((route) => ({
                    ...route,
                    __parentId: record.distributer_id,
                    __distributorName: record.distributer_name,
                  })) ?? []
                }
                columns={routeColumns}
                pagination={false}
                rowKey="id"
              />
            ) : (
              <Text type="secondary">No route data available.</Text>
            ),
          rowExpandable: () => true,
        }}
        pagination={false}
      />
    )}
  </Box>
);
}


export default Distributor
