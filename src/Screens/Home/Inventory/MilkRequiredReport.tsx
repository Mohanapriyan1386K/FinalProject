import { useEffect, useState } from "react";
import { Typography, Card, Spin, Row, Col } from "antd";
import { getDailymilkrequmernt } from "../../../Services/ApiService";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../../Compontents/CoustomButton";
import { useUserdata } from "../../../Hooks/UserHook";
const { Title } = Typography;

const MilkRequiredReport = () => {
  const navigate = useNavigate();
  const [requiredMilk, setRequiredMilk] = useState([]);
  const [loading, setLoading] = useState(false);
  const token=useUserdata()
  useEffect(() => {
    const formData = new FormData();
    formData.append("token", token);
    handleGetRequiredMilkReport(formData);
  }, []);

  // get milk required data
  const handleGetRequiredMilkReport = async (formData: FormData) => {
    setLoading(true);
    const res = await getDailymilkrequmernt(formData);

    if (res.data.status === 1) {
      setRequiredMilk(res.data.data || []);
    } else {
      console.error("API Error:", res.data);
    }
    setLoading(false);
  };

  const mapSlot: Record<number, string> = {
    1: "Morning",
    2: "Evening",
  };

  const mapType: Record<number, string> = {
    1: "Vendor",
    2: "Distributor",
  };

  const grouped = requiredMilk.reduce((acc: any, curr: any) => {
    const slot = mapSlot[curr.slot_id];
    const type = mapType[curr.given_type];

    if (!acc[slot]) acc[slot] = {};
    acc[slot][type] = curr.total_quantity;
    return acc;
  }, {});

  // Individual view slot handlers
  const handleViewVendorMorning = () => {
    navigate("slotmapping", { state: { mode: 1, slot_id: 1 } });
  };

  const handleViewVendorEvening = () => {
    navigate("slotmapping", { state: { mode: 1, slot_id: 2 } });
  };

  const handleViewDistributorMorning = () => {
    navigate("slotmapping", { state: { mode: 2, slot_id: 1 } });
  };

  const handleViewDistributorEvening = () => {
    navigate("slotmapping", { state: { mode: 2, slot_id: 2 } });
  };

  return (
    <div className="milk-required-report">
      <Title
        level={4}
        style={{
          textAlign: "center",
          marginBottom: 24,
          padding:"30px",
          fontWeight: 600,
          backgroundColor:"#F6FFED",
          fontSize:"30px"
        }}
      >
        Daily Milk Requirement
      </Title>
      <Spin spinning={loading} tip="Loading data...">
        <Row justify="center">
          <Col xs={24}>
            <Card className="summary-card-container">
              {/* Summary Cards */}
              <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                  <Card title="Vendor - Morning" className="summary-card"  style={{backgroundColor:"#E8F5E9"}}>
                    <p>{grouped["Morning"]?.Vendor || "0.000"} Litres</p>
                    <CustomButton
                      buttonName="View Slot"
                      onClick={handleViewVendorMorning}
                      sx={{backgroundColor:"#72C41A"}}

                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                  <Card title="Vendor - Evening" className="summary-card" style={{backgroundColor:"#E8F5E9"}} >
                    <p>{grouped["Evening"]?.Vendor || "0.000"} Litres</p>
                    <CustomButton
                      buttonName="View Slot"
                      onClick={handleViewVendorEvening}
                      sx={{backgroundColor:"#72C41A"}}
                    
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                  <Card title="Distributor - Morning" className="summary-card"  style={{backgroundColor:"#E8F5E9"}}>
                    <p>{grouped["Morning"]?.Distributor || "0.000"} Litres</p>
                    <CustomButton
                      buttonName="View Slot"
                      onClick={handleViewDistributorMorning}
                      sx={{backgroundColor:"#72C41A"}}

                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                  <Card title="Distributor - Evening" className="summary-card" style={{backgroundColor:"#E8F5E9"}}>
                    <p>{grouped["Evening"]?.Distributor || "0.000"} Litres</p>
                    <CustomButton
                      buttonName="View Slot"
                      onClick={handleViewDistributorEvening}
                      sx={{backgroundColor:"#72C41A"}}

                    />
                  </Card>
                </Col>
              </Row>

              {/* Table */}
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default MilkRequiredReport;
