import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { assignslotmap, customerdropdown } from "../../../Services/ApiService";
import { useUserdata } from "../../../Hooks/UserHook";
import CustomDropDown from "../../../Compontents/CustomDropDown";
import CustomButton from "../../../Compontents/CoustomButton";
import CustomDatePicker from "../../../Compontents/CustomDatePicker";
import styles from "../../../Styles/Distributor.module.css";
import { Select, Spin, Divider, Card, Row, Col } from "antd";

type SlotFormValues = {
  assign_type: string;
  line_id: string;
  from_date: string;
  to_date: string;
  customers: string[];
};

type AssignDistributorFormValues = {
  distributor_id: string; // ✅ fixed key
  slot_id: string;
  slots: SlotFormValues[];
};

interface CustomerOption {
  label: string;
  value: string;
}

const assignDistributorSchema = Yup.object().shape({
  distributor_id: Yup.string().required("Distributor is required"), // ✅ fixed
  slot_id: Yup.string().required("Slot is required"),
  slots: Yup.array().of(
    Yup.object().shape({
      assign_type: Yup.string().required("Assign Type is required"),
      line_id: Yup.string().required("Line is required"),
      from_date: Yup.lazy((_, options) =>
        options.parent.assign_type === "0"
          ? Yup.string().required("From Date is required")
          : Yup.string().notRequired()
      ),
      to_date: Yup.lazy((_, options) =>
        options.parent.assign_type === "0"
          ? Yup.string().required("To Date is required")
          : Yup.string().notRequired()
      ),
      customers: Yup.array()
        .of(Yup.string())
        .min(1, "Select at least one customer"),
    })
  ),
});

const AssignDistributor = () => {
  const token = useUserdata();
  const [customers, setCustomers] = useState<Record<number, CustomerOption[]>>(
    {}
  );
  const [loadingCustomers, setLoadingCustomers] = useState<
    Record<number, boolean>
  >({});

  const formik = useFormik<AssignDistributorFormValues>({
    initialValues: {
      distributor_id: "", 
      slot_id: "",
      slots: [
        {
          assign_type: "",
          line_id: "",
          from_date: "",
          to_date: "",
          customers: [],
        },
      ],
    },
    validationSchema: assignDistributorSchema,
    onSubmit: (values) => handleSubmit(values),
  });

  const { values, setFieldValue, handleBlur, touched, errors } = formik;

  const handleSubmit = (values: AssignDistributorFormValues) => {
    if (!token) return;

    const lineData = values.slots.map((slot) => {
      const cleanedCustomers = slot.customers.filter(
        (c) => c !== undefined && c !== "undefined"
      );
      const lineItem: any = {
        line_id: Number(slot.line_id),
        assign_type: Number(slot.assign_type),
        slot_mapping_ids: cleanedCustomers.map(Number),
      };
      if (slot.assign_type === "0") {
        lineItem.from_date = slot.from_date;
        lineItem.to_date = slot.to_date;
      }
      return lineItem;
    });

    const payload: any = {
      token,
      distributor_id: Number(values.distributor_id),
      slot_id: Number(values.slot_id),
      line_data: lineData,
    };

    assignslotmap(payload)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg || "Assignment successful!");
        } else {
          toast.error(res.data.msg || "Failed to assign distributor.");
        }
      })
      .catch((error) => {
        console.error("API error:", error);
        toast.error("Something went wrong while assigning.");
      });
  };

  useEffect(() => {
    if (token) {
      fetchCustomersForSlots(
        values.slots,
        values.slot_id,
        token,
        setLoadingCustomers,
        setCustomers
      );
    }
  }, [values.slots, values.slot_id, token]);

  const fetchCustomersForSlots = (
    slots: any[],
    slotId: string,
    token: string,
    setLoadingCustomers: (fn: (prev: any) => any) => void,
    setCustomers: (fn: (prev: any) => any) => void
  ) => {
    slots.forEach((slot, idx) => {
      const shouldFetch = slot.assign_type && slot.line_id && slotId && token;
      if (shouldFetch) {
        setLoadingCustomers((prev) => ({ ...prev, [idx]: true }));

        const formData = new FormData();
        formData.append("token", token);
        formData.append("type", getCustomerType(slot.assign_type));
        formData.append("line_id", slot.line_id);
        formData.append("slot_id", slotId);

        customerdropdown(formData)
          .then((res) => {
            if (res.data.status === 1) {
              const options = res.data.data.map((c: any) => ({
                label: c.name,
                value: String(c.slot_map_id),
              }));
              setCustomers((prev) => ({ ...prev, [idx]: options }));
            } else {
              toast.error(res.data.msg || "Failed to fetch customers");
              setCustomers((prev) => ({ ...prev, [idx]: [] }));
            }
          })
          .catch(() => {
            toast.error("Something went wrong while fetching customers");
            setCustomers((prev) => ({ ...prev, [idx]: [] }));
          })
          .finally(() => {
            setLoadingCustomers((prev) => ({ ...prev, [idx]: false }));
          });
      } else {
        setCustomers((prev) => ({ ...prev, [idx]: [] }));
      }
    });
  };

  const getCustomerType = (assignType: string) => {
    if (assignType === "0") return "3";
    if (assignType === "1") return "2";
    return "4";
  };

  return (
      <Card className="shadow-sm rounded " style={{ backgroundColor: "#E8F5E9" }}>
        <h3 className="mb-4 text-center">Assign Distributor Slot</h3>

        <form onSubmit={formik.handleSubmit}>
          <Row gutter={[16, 16]} className="my-4">
            <Col xs={24} md={12}>
          <CustomDropDown
          dropdownKeys={["distributor_id"]}
          formik={formik}
        />
            </Col>
            <Col xs={24} md={12}>
              <CustomDropDown dropdownKeys={["slot_id"]} formik={formik} />
            </Col>
          </Row>

          {values.slots.map((slot, idx) => {
            const isTemporary = slot.assign_type === "0";
            const slotErrors: any = errors.slots?.[idx] || {};
            const slotTouched: any = touched.slots?.[idx] || {};

            return (
              <Card key={idx}  style={{ backgroundColor: '#E8F5E9'}}>
                <Divider orientation="left">Assignment {idx + 1}</Divider>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="fw-bold fs-5">Assignment Details</div>
                  <CustomButton
                    buttonName="Remove"
                    disabled={values.slots.length === 1}
                    onClick={() => {
                      const updatedSlots = [...values.slots];
                      updatedSlots.splice(idx, 1);
                      setFieldValue("slots", updatedSlots);
                    }}
                  />
                </div>

                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <CustomDropDown
                      dropdownKeys={["assign_type"]}
                      formik={{
                        values: slot,
                        setFieldValue: (name: string, value: any) =>
                          setFieldValue(`slots[${idx}].${name}`, value),
                        handleBlur,
                        touched: slotTouched,
                        errors: slotErrors,
                      }}
                    />
                  </Col>
                </Row>

                {isTemporary && (
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                      <CustomDatePicker
                        label="From Date"
                        value={slot.from_date}
                        onChange={(date) =>
                          setFieldValue(
                            `slots[${idx}].from_date`,
                            date ? dayjs(date).format("YYYY-MM-DD") : ""
                          )
                        }
                        onBlur={handleBlur}
                        error={slotErrors.from_date}
                        touched={slotTouched.from_date}
                      />
                    </Col>
                    <Col xs={24} md={12}>
                      <CustomDatePicker
                        label="To Date"
                        value={slot.to_date}
                        onChange={(date) =>
                          setFieldValue(
                            `slots[${idx}].to_date`,
                            date ? dayjs(date).format("YYYY-MM-DD") : ""
                          )
                        }
                        onBlur={handleBlur}
                        error={slotErrors.to_date}
                        touched={slotTouched.to_date}
                      />
                    </Col>
                  </Row>
                )}

                {slot.assign_type &&
                  (!isTemporary ||
                    (isTemporary && slot.from_date && slot.to_date)) && (
                    <>
                      <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                          <CustomDropDown
                            dropdownKeys={["line_id"]}
                            formik={{
                              values: slot,
                              setFieldValue: (name: string, value: any) =>
                                setFieldValue(`slots[${idx}].${name}`, value),
                              handleBlur,
                              touched: slotTouched,
                              errors: slotErrors,
                            }}
                          />
                        </Col>
                      </Row>

                      <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                          <label>Customers</label>
                          <Spin spinning={loadingCustomers[idx]}>
                            <Select
                              mode="multiple"
                              allowClear
                              placeholder="Select customers"
                              style={{ width: "100%" }}
                              disabled={!slot.line_id || !slot.assign_type}
                              value={slot.customers}
                              onChange={(val) => {
                                const cleaned = (val || []).filter(
                                  (v) => v !== undefined && v !== "undefined"
                                );
                                setFieldValue(
                                  `slots[${idx}].customers`,
                                  cleaned
                                );
                              }}
                              onBlur={handleBlur}
                              options={customers[idx] || []}
                              className={`${
                                slotErrors.customers && slotTouched.customers
                                  ? "is-invalid"
                                  : ""
                              }`}
                            />
                          </Spin>
                          {slotErrors.customers && slotTouched.customers && (
                            <div className="text-danger">
                              {slotErrors.customers}
                            </div>
                          )}
                        </Col>
                      </Row>
                    </>
                  )}
              </Card>
            );
          })}

          <Row className="mb-3">
            <Col>
              <CustomButton
               sx={{backgroundColor:"#006400"}}
                buttonName="+ Add More Assignment"
                onClick={() =>
                  setFieldValue("slots", [
                    ...values.slots,
                    {
                      assign_type: "",
                      line_id: "",
                      from_date: "",
                      to_date: "",
                      customers: [],
                    },
                  ])
                }
              />
            </Col>
          </Row>

          <Row justify="end" gutter={[8, 8]}>
            <Col>
              <CustomButton
                buttonName=" Cancel"
                onClick={() => window.history.back()}
                sx={{backgroundColor:"red"}}
              />
            </Col>
            <Col>
              <CustomButton type="submit" buttonName=" Submit Assignment" sx={{backgroundColor:"#4EB24E"}} />
            </Col>
          </Row>
        </form>
      </Card>
  );
};

export default AssignDistributor;
