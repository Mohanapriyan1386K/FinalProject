import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import {
  assignslotmap,
  customerdropdown,
} from "../../../Services/ApiService";
import { useUserdata } from "../../../Hooks/UserHook";
import CustomDropDown from "../../../Compontents/CustomDropDown";
import CustomButton from "../../../Compontents/CoustomButton";
import CustomDatePicker from "../../../Compontents/CustomDatePicker";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Divider,
  FormHelperText,
  CircularProgress,
  MenuItem,
  TextField,
} from "@mui/material";

type SlotFormValues = {
  assign_type: string;
  line_id: string;
  from_date: string;
  to_date: string;
  customers: string[];
};

type AssignDistributorFormValues = {
  distributor_id: string;
  slot_id: string;
  slots: SlotFormValues[];
};

interface CustomerOption {
  label: string;
  value: string;
}

const assignDistributorSchema = Yup.object().shape({
  distributor_id: Yup.string().required("Distributor is required"),
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
  const [customers, setCustomers] = useState<Record<number, CustomerOption[]>>({});
  const [loadingCustomers, setLoadingCustomers] = useState<Record<number, boolean>>({});

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

    const payload = {
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
      .catch(() => {
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
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3,backgroundColor:"#E8F5E9" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Assign Distributor Slot
        </Typography>

        <form onSubmit={formik.handleSubmit}>
              <CustomDropDown dropdownKeys={["distributor_id"]} formik={formik} />
              <CustomDropDown dropdownKeys={["slot_id"]} formik={formik} />

          {values.slots.map((slot, idx) => {
            const isTemporary = slot.assign_type === "0";
            const slotErrors: any = errors.slots?.[idx] || {};
            const slotTouched: any = touched.slots?.[idx] || {};

            return (
              <Paper key={idx} sx={{ p: 2, mb: 3,}} variant="outlined">
                <Divider sx={{ mb: 2 }}>Assignment {idx + 1}</Divider>
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
                {isTemporary && (
                  <Grid container spacing={2} mb={1}>
                    <Grid>
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
                    </Grid>
                    <Grid >
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
                    </Grid>
                  </Grid>
                )}

                {slot.assign_type &&
                  (!isTemporary || (isTemporary && slot.from_date && slot.to_date)) && (
                    <>
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

                        <Grid >
                          <TextField
                            label="Customers"
                            select
                            fullWidth
                            value={slot.customers}
                            onChange={(e) =>
                              setFieldValue(
                                `slots[${idx}].customers`,
                                e.target.value.filter((v: any) => v !== "undefined")
                              )
                            }
                            onBlur={handleBlur}
                            error={Boolean(slotErrors.customers && slotTouched.customers)}
                            helperText={
                              slotErrors.customers && slotTouched.customers
                                ? slotErrors.customers
                                : ""
                            }
                            disabled={!slot.line_id || !slot.assign_type}
                          >
                            {loadingCustomers[idx] ? (
                              <MenuItem disabled>
                                <CircularProgress size={20} />
                              </MenuItem>
                            ) : (
                              customers[idx]?.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </MenuItem>
                              ))
                            )}
                          </TextField>
                        </Grid>
                    </>
                  )}
              </Paper>
            );
          })}

          <Box mb={2}>
            <CustomButton
              sx={{backgroundColor:"#4EB24E"}}
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
          </Box>

          <Grid container spacing={2} justifyContent="flex-end">
            <Grid>
              <CustomButton buttonName="Cancel" sx={{backgroundColor:"#4EB24E"}} onClick={() => window.history.back()} />
            </Grid>
            <Grid>
              <CustomButton sx={{backgroundColor:"#4EB24E"}} type="submit" buttonName="Submit Assignment" />
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AssignDistributor;
