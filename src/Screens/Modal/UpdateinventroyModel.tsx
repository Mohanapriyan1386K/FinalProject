import Modal from "../../Compontents/GlobalModal";
import {InputNumber, Input, Form as AntForm } from "antd";
import type { FormikProps } from "formik";

interface UpdateInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  formik: FormikProps<{
    id: number;
    total_quantity: number;
    comment: string;
  }>;
}

const UpdateInventoryModal = ({ isOpen, onClose, formik }: UpdateInventoryModalProps) => {
  return (
    <Modal
      title="Update Inventory"
      open={isOpen}
      onOk={() => formik.handleSubmit()}
      onCancel={onClose}
      okText="Update" style={undefined}    >
      <AntForm layout="vertical">
        <AntForm.Item
          label="Total Quantity"
          validateStatus={formik.errors.total_quantity ? "error" : ""}
          help={formik.errors.total_quantity}
        >
          <InputNumber
            name="total_quantity"
            value={formik.values.total_quantity}
            onChange={(value) => formik.setFieldValue("total_quantity", value)}
            style={{ width: "100%" }}
          />
        </AntForm.Item>

        <AntForm.Item
          label="Comment"
          validateStatus={formik.errors.comment ? "error" : ""}
          help={formik.errors.comment}
        >
          <Input.TextArea
            name="comment"
            value={formik.values.comment}
            onChange={formik.handleChange}
          />
        </AntForm.Item>
      </AntForm>
    </Modal>
  );
};

export default UpdateInventoryModal;
