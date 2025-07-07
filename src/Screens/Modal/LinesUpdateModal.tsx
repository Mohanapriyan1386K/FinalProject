import { Form as AntForm, Input } from "antd";
import type { FormikProps } from "formik";
import GlobalModal from "../../Compontents/GlobalModal";
import { useEffect, useRef } from "react";

interface FormValues {
  token: string;
  name: string;
  lines_id:string
  description: string;
}

interface CustomFormProps {
  formik: FormikProps<FormValues>;
  isOpen: boolean;
  onClose: () => void;
}

const CustomForm = ({ formik, isOpen, onClose }: CustomFormProps) => {
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen]);

  return (
    <GlobalModal
      title="Add Line"
      open={isOpen}
      onOk={() => formik.handleSubmit()}
      onCancel={onClose}
      okText="Submit"
      style={{ maxHeight: "80vh", overflowY: "auto" }}
    >
      <div ref={formRef}>

        

        <AntForm layout="vertical">
           <AntForm.Item label="LineID" required>
            <Input
              name="lines_id"
              value={formik.values.lines_id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              status={formik.touched.name && formik.errors.name ? "error" : ""}
              placeholder="Enter name"
            />
          </AntForm.Item>

          <AntForm.Item label="Name" required>
            <Input
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              status={formik.touched.name && formik.errors.name ? "error" : ""}
              placeholder="Enter name"
            />
          </AntForm.Item>

          <AntForm.Item label="Description" required>
            <Input.TextArea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              status={formik.touched.description && formik.errors.description ? "error" : ""}
              placeholder="Enter description"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </AntForm.Item>
        </AntForm>
      </div>
    </GlobalModal>
  );
};

export default CustomForm;
