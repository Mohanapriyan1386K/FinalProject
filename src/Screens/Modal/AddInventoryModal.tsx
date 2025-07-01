// src/Components/Modals/AddInventoryModal.tsx

import React from "react";
import {Form, InputNumber, Input } from "antd";
import type { FormikProps } from "formik";
import Modal from "../../Compontents/GlobalModal";

interface AddInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  formik: FormikProps<{
    total_quantity: number;
    comment: string;
  }>;
}

const AddInventoryModal: React.FC<AddInventoryModalProps> = ({
  isOpen,
  onClose,
  formik,
}) => {
  return (
    <Modal
      title="Add Inventory"
      open={isOpen}
      onOk={() => formik.handleSubmit()}
      onCancel={onClose}
      okText="Add" style={undefined}    >
      <Form layout="vertical">
        <Form.Item
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
        </Form.Item>

        <Form.Item
          label="Comment"
          validateStatus={formik.errors.comment ? "error" : ""}
          help={formik.errors.comment}
        >
          <Input.TextArea
            name="comment"
            value={formik.values.comment}
            onChange={formik.handleChange}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddInventoryModal;
