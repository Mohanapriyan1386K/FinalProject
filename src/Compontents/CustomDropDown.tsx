// CustomDropDown.tsx

import { useEffect, useState } from "react";
import { Select, message } from "antd";
import {
  fetchLinesDropDown,
  fetchPriceTagDropDown,
  distributerdropdown,
  customerdropdown,
} from "../Services/ApiService";
import { useUserdata } from "../Hooks/UserHook";

const { Option } = Select;

interface ReusableDropdownsProps {
  dropdownKeys: string[];
  formik: any;
}

// Static options
const UserDropDown = [
  { label: "Admin", value: "2" },
  { label: "Vendor/logger", value: "3" },
  { label: "Distributor", value: "4" },
  { label: "Customer", value: "5" },
];

const CustomerType = [
  { label: "Regular", value: "1" },
  { label: "Occasional", value: "2" },
];

const PayTypesOptions = [
  { label: "Daily", value: "1" },
  { label: "Monthly", value: "2" },
];

const StatusOptions = [
  { label: "Active", value: "1" },
  { label: "Inactive", value: "2" },
];

const MilkGiveType = [
  { label: "In", value: "1" },
  { label: "Out", value: "2" },
];

const Coustomergetmilktype = [
  { label: "Permanent", value: "1" },
  { label: "Temporary", value: "2" },
];

const SlotId = [
  { label: "Morning", value: "1" },
  { label: "Evening", value: "2" },
];

const AssignTypeOptions = [
  { label: "Temporary", value: "0" },
  { label: "Permanent", value: "1" },
];

const CustomDropDown: React.FC<ReusableDropdownsProps> = ({
  dropdownKeys,
  formik,
}) => {
  const token = useUserdata();
  const [linesList, setLinesList] = useState<any[]>([]);
  const [priceTagList, setPriceTagList] = useState<any[]>([]);
  const [distributorList, setDistributorList] = useState<any[]>([]);
  const [customerList, setCustomerList] = useState<any[]>([]);

  const { values, setFieldValue, handleBlur, touched, errors } = formik;

  useEffect(() => {
    if (!token) return;
    if (dropdownKeys.includes("line_id")) fetchLines();
    if (dropdownKeys.includes("price_tag_id")) fetchPriceTags();
    if (dropdownKeys.includes("distributor_id")) fetchDistributors();
    if (dropdownKeys.includes("customer_id")) fetchCustomers();
  }, [token]);

  const fetchLines = (userType: number | string = "5") => {
    const formData = new FormData();
    formData.append("token", token);
    const type = parseInt(userType as string, 10) === 4 ? 2 : 1;
    formData.append("type", type.toString());

    fetchLinesDropDown(formData)
      .then((res) => {
        setLinesList(res.data?.data || []);
      })
      .catch(() => {
        message.error("Failed to load lines.");
      });
  };

  const fetchPriceTags = () => {
    const formData = new FormData();
    formData.append("token", token);

    fetchPriceTagDropDown(formData)
      .then((res) => {
        setPriceTagList(res.data?.data || []);
      })
      .catch(() => {
        message.error("Failed to load price tags.");
      });
  };

  const fetchDistributors = () => {
    const formData = new FormData();
    formData.append("token", token);

    distributerdropdown(formData)
      .then((res) => {
        const formatted = (res.data?.data || []).map((d: any) => ({
          label: d.name || d.distributor_name || "Unknown",
          value: d.id,
        }));
        setDistributorList(formatted);
      })
      .catch(() => {
        message.error("Failed to load distributors.");
      });
  };

  const fetchCustomers = () => {
    const payload = new FormData();
    payload.append("token", token);
    payload.append("type", "4");

    customerdropdown(payload)
      .then((res) => {
        const formatted = (res.data?.data || []).map((item: any) => ({
          label: item.name,
          value: item.id,
        }));
        setCustomerList(formatted);
      })
      .catch(() => {
        message.error("Failed to fetch customers.");
      });
  };

  const renderSelect = (name: string, placeholder: string, options: any[]) => (
    <div className="col-md-4 mb-3" key={name}>
      <label>{placeholder}</label>
      <Select
        mode={name === "customer_id" ? "multiple" : undefined}
        allowClear
        className={`w-100 ${errors[name] && touched[name] ? "is-invalid" : ""}`}
        value={values[name] ?? (name === "customer_id" ? [] : undefined)}
        placeholder={`Select ${placeholder.toLowerCase()}`}
        onChange={(val) => setFieldValue(name, val ?? (name === "customer_id" ? [] : ""))}
        onBlur={() => handleBlur({ target: { name } })}
      >
        {options.map((opt) => (
          <Option key={opt.value} value={opt.value}>
            {opt.label}
          </Option>
        ))}
      </Select>
      {errors[name] && touched[name] && typeof errors[name] === "string" && (
        <div className="text-danger">{errors[name]}</div>
      )}
    </div>
  );

  return (
    <div className="row mt-3">
      {dropdownKeys.includes("user_type") &&
        renderSelect("user_type", "User Type", UserDropDown)}
      {dropdownKeys.includes("customer_type") &&
        renderSelect("customer_type", "Customer Type", CustomerType)}
      {dropdownKeys.includes("line_id") &&
        renderSelect(
          "line_id",
          "Line",
          linesList.map((l) => ({ label: l.line_name, value: l.id }))
        )}
      {dropdownKeys.includes("price_tag_id") &&
        renderSelect(
          "price_tag_id",
          "Price Tag",
          priceTagList.map((p) => ({ label: p.price_tag_name, value: p.id }))
        )}
      {dropdownKeys.includes("pay_type") &&
        renderSelect("pay_type", "Pay Type", PayTypesOptions)}
      {dropdownKeys.includes("status") &&
        renderSelect("status", "Status", StatusOptions)}
      {dropdownKeys.includes("distributor_id") &&
        renderSelect("distributor_id", "Distributor", distributorList)}
      {dropdownKeys.includes("milk_give_type") &&
        renderSelect("milk_give_type", "Milk Give Type", MilkGiveType)}
      {dropdownKeys.includes("Coustomer_get_milktype") &&
        renderSelect("Coustomer_get_milktype", "Customer Milk Type", Coustomergetmilktype)}
      {dropdownKeys.includes("slot_id") &&
        renderSelect("slot_id", "Slot", SlotId)}
      {dropdownKeys.includes("assign_type") &&
        renderSelect("assign_type", "Assign Type", AssignTypeOptions)}
      {dropdownKeys.includes("customer_id") &&
        renderSelect("customer_id", "Customer", customerList)}
    </div>
  );
};

export default CustomDropDown;
