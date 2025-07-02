// AssignDistributor.tsx

import { useEffect, useState } from "react";
import {DatePicker, Select, Spin } from "antd";
import dayjs from "dayjs";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import CustomDropDown from "../../../Compontents/CustomDropDown";
import { assignslotmap, customerdropdown } from "../../../Services/ApiService";
import { useUserdata } from "../../../Hooks/UserHook";
import { Paper } from "@mui/material";
import CustomButton from "../../../Compontents/CoustomButton";

type AssignDistributorFormValues = {
  distributer_id: string;
  slot_id: string;
  assign_type: string;
  line_id: string;
  from_date: string;
  to_date: string;
  customers: string[];
};

const AssignDistributor = () => {
  const token = useUserdata();
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  const formik = useFormik<AssignDistributorFormValues>({
    initialValues: {
      distributer_id: "",
      slot_id: "",
      assign_type: "",
      line_id: "",
      from_date: "",
      to_date: "",
      customers: [],
    },
    validationSchema: Yup.object().shape({
      distributer_id: Yup.string().required("Distributor is required"),
      slot_id: Yup.string().required("Slot is required"),
      assign_type: Yup.string().required("Assign Type is required"),
      line_id: Yup.string().required("Line is required"),
      from_date: Yup.string().when("assign_type", {
        is: "0",
        then: (schema) => schema.required("From Date is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      to_date: Yup.string().when("assign_type", {
        is: "0",
        then: (schema) => schema.required("To Date is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      customers: Yup.array()
        .of(Yup.string())
        .min(1, "Select at least one customer"),
    }),
    onSubmit: (values) => {
      const cleanedCustomers = values.customers.filter(
        (c) => c !== undefined && c !== "undefined"
      );
      const lineItem: any = {
        line_id: Number(values.line_id),
        assign_type: Number(values.assign_type),
        slot_mapping_ids: cleanedCustomers.map(Number),
      };

      if (values.assign_type === "0") {
        lineItem.from_date = values.from_date;
        lineItem.to_date = values.to_date;
      }

      const payload = {
        token,
        distributor_id: Number(values.distributer_id),
        slot_id: Number(values.slot_id),
        line_data: [lineItem],
      };

      assignslotmap(payload)
        .then((res) => {
          if (res.data.status === 1) {
            toast.success(res.data.msg || "Assignment successful!");
          } else {
            toast.error(res.data.msg || "Failed to assign distributor.");
          }
        })
        .catch(() => {
          toast.error("Something went wrong while assigning.");
        });
    },
  });

  const { values, setFieldValue, handleBlur, touched, errors } = formik;
  const isTemporary = values.assign_type === "0";

  const getCustomerType = (assignType: string) => {
    if (assignType === "0") return "3";
    if (assignType === "1") return "2";
    return "4";
  };

  useEffect(() => {
    if (values.assign_type && values.line_id && values.slot_id && token) {
      setLoadingCustomers(true);
      const formData = new FormData();
      formData.append("token", token);
      formData.append("type", getCustomerType(values.assign_type));
      formData.append("line_id", values.line_id);
      formData.append("slot_id", values.slot_id);

      customerdropdown(formData)
        .then((res) => {
          if (res.data.status === 1) {
            const options = res.data.data.map((c: any) => ({
              label: c.name,
              value: String(c.slot_map_id),
            }));
            setCustomers(options);
          } else {
            toast.error(res.data.msg || "Failed to fetch customers");
            setCustomers([]);
          }
        })
        .catch(() => {
          toast.error("Something went wrong while fetching customers");
          setCustomers([]);
        })
        .finally(() => setLoadingCustomers(false));
    } else {
      setCustomers([]);
    }
  }, [values.assign_type, values.line_id, values.slot_id, token]);

  return (
    <div className="container">
      <Paper sx={{ backgroundColor: "#E8F5E9", padding: 2 }}>
        Assign Distributor Slot
      </Paper>
      <Paper sx={{padding:2,marginTop:2,backgroundColor:"#E8F5E9"  }}>
        <form onSubmit={formik.handleSubmit}>
          <div className="row">
            <CustomDropDown
              dropdownKeys={["distributer_id", "slot_id", "assign_type"]}
              formik={formik}
            />
          </div>

          {isTemporary && (
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>From Date</label>
                <DatePicker
                  style={{ width: "100%" }}
                  value={values.from_date ? dayjs(values.from_date) : undefined}
                  onChange={(date) =>
                    setFieldValue(
                      "from_date",
                      date ? dayjs(date).format("YYYY-MM-DD") : ""
                    )
                  }
                  onBlur={handleBlur}
                  className={`${
                    errors.from_date && touched.from_date ? "is-invalid" : ""
                  }`}
                />
                {errors.from_date && touched.from_date && (
                  <div className="text-danger">{errors.from_date}</div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label>To Date</label>
                <DatePicker
                  style={{ width: "100%" }}
                  value={values.to_date ? dayjs(values.to_date) : undefined}
                  onChange={(date) =>
                    setFieldValue(
                      "to_date",
                      date ? dayjs(date).format("YYYY-MM-DD") : ""
                    )
                  }
                  onBlur={handleBlur}
                  className={`${
                    errors.to_date && touched.to_date ? "is-invalid" : ""
                  }`}
                />
                {errors.to_date && touched.to_date && (
                  <div className="text-danger">{errors.to_date}</div>
                )}
              </div>
            </div>
          )}

          {values.assign_type &&
            (!isTemporary ||
              (isTemporary && values.from_date && values.to_date)) && (
              <>
                <div className="row">
                  <CustomDropDown dropdownKeys={["line_id"]} formik={formik} />
                </div>

                <div className="row">
                  <div className="col-12 mb-3">
                    <label>Customers</label>
                    <Spin spinning={loadingCustomers}>
                      <Select
                        mode="multiple"
                        allowClear
                        placeholder="Select customers"
                        style={{ width: "100%" }}
                        disabled={!values.line_id || !values.assign_type}
                        value={values.customers}
                        onChange={(val) =>
                          setFieldValue(
                            "customers",
                            val.filter(
                              (v) => v !== undefined && v !== "undefined"
                            )
                          )
                        }
                        onBlur={handleBlur}
                        options={customers}
                        className={`${
                          errors.customers && touched.customers
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                    </Spin>
                    {errors.customers && touched.customers && (
                      <div className="text-danger">{errors.customers}</div>
                    )}
                  </div>
                </div>
              </>
            )}

          <CustomButton buttonName=" Submit" type="submit" sx={{ marginTop: 20,backgroundColor:"green"}}/>
        </form>
      </Paper>
    </div>
  );
};

export default AssignDistributor;
