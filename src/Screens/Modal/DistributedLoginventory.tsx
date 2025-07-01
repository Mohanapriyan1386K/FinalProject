import Modal from "../../Compontents/GlobalModal";
import { Input, Form as AntForm } from "antd";
import type { FormikProps } from "formik";
import CustomDropDown from "../../Compontents/CustomDropDown";

interface UpdateInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  formik: FormikProps<{
    total_quantity: number;
    milk_give_type: string;
    distributor_id: string;
  }>;
}

const DistributedLoginventory = ({
  isOpen,
  onClose,
  formik,
}: UpdateInventoryModalProps) => {
  return (
    <Modal
          title="Distribute Inventory"
          open={isOpen}
          onOk={() => formik.handleSubmit()}
          onCancel={onClose}
          okText="Update" style={undefined}    >
      <AntForm layout="vertical">
        {/* Milk Give Type & Distributor Dropdowns */}
        <CustomDropDown
          dropdownKeys={["milk_give_type", "distributor_id"]}
          formik={formik}
        />

        <AntForm.Item
          label="Total Quantity"
          validateStatus={
            formik.touched.total_quantity && formik.errors.total_quantity ? "error" : ""
          }
          help={
            formik.touched.total_quantity && formik.errors.total_quantity
              ? formik.errors.total_quantity
              : ""
          }
        >
          <Input
            type="number"
            name="total_quantity"
            value={formik.values.total_quantity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </AntForm.Item>
      </AntForm>
    </Modal>
  );
};

export default DistributedLoginventory;
