import { Paper, Typography, Box, TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useUserdata } from "../../../Hooks/UserHook";
import { useFormik } from "formik";
import { listdistbutedlog } from "../../../Services/ApiService";
import CustomDropDown from "../../../Compontents/CustomDropDown";
import { Select } from "antd";

const { Option } = Select;

function Saleslog() {
  interface FilterValues {
    distributor_id: string;
    from_date: string;
    log_type: string;
    to_date: string;
  }

  const [data, setData] = useState<any>();
  const [filterValues, setSubmittedFilters] = useState<FilterValues | null>(
    null
  );
  const token = useUserdata();

  const formik = useFormik<FilterValues>({
    initialValues: {
      distributor_id: "",
      from_date: "",
      log_type: "",
      to_date: "",
    },
    onSubmit: (values) => {
      setSubmittedFilters(values);
    },
  });

  const fetchListDistributedLog = (filters?: FilterValues) => {
    const payload = new FormData();
    payload.append("token", token);

    if (filters?.distributor_id)
      payload.append("distributor_id", filters.distributor_id);
    if (filters?.from_date) payload.append("from_date", filters.from_date);
    if (filters?.to_date) payload.append("to_date", filters.to_date);
    if (filters?.log_type) payload.append("log_type", filters.log_type);

    listdistbutedlog(payload)
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => {
        console.error(err.msg || err);
      });
  };

  useEffect(() => {
    fetchListDistributedLog();
  }, []);

  useEffect(() => {
    if (filterValues) {
      fetchListDistributedLog(filterValues);
    }
  }, [filterValues]);

  return (
    <Paper sx={{ padding: 2, backgroundColor: "#E8F5E9" }}>
      <Typography sx={{ fontWeight: 700, fontSize: "25px" }}>
        Sales Log
      </Typography>

      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}
      >
        <Box
          sx={{
             width:"100%",
            display: "flex",
            flexDirection: "column",
            justifyContent:"space-between",
            
            gap: 2,
          }}>
          {/* Distributor + Log Type (same row) */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>

            <Box sx={{ width: "220px"}}>
             <label>type</label>
              <Select
                style={{ width: "100%" }}
                name="log_type"
                value={formik.values.log_type}
                onChange={(value) => formik.setFieldValue("log_type", value)}
                onBlur={() => formik.setFieldTouched("log_type", true)}
                placeholder="Select Log Type"
              >
                <Option value="1">Distributor Log</Option>
                <Option value="2">Vendor Log</Option>
              </Select>
            </Box>
          <Box sx={{ display: "flex",  gap: 2,  }}>
            <TextField
              label="From Date"
              name="from_date"
              type="date"
              value={formik.values.from_date}
              onChange={formik.handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="To Date"
              name="to_date"
              type="date"
              value={formik.values.to_date}
              onChange={formik.handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          </Box>

          {/* From Date + To Date (same row) */}

          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default Saleslog;
