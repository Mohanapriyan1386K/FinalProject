import { Modal, Input, Divider } from "antd";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import CustomButton from "../../Compontents/CoustomButton";

interface ReasonFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  isEdit?: boolean;
  initialValues: {
    reason_id?: number;
    name: string;
    type: string;
  };
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  type: Yup.string().required("Type is required"),
});

const ReasonFormModal = ({
  visible,
  onClose,
  onSubmit,
  isEdit = false,
  initialValues,
}: ReasonFormModalProps) => {
  return (
    <Modal
      open={visible}
      title={
        <h2 style={{ textAlign: "center", marginBottom: 0 }}>
          {isEdit ? "Edit Reason" : "Add Reason"}
        </h2>
      }
      onCancel={onClose}
      footer={null}
      centered
    >
      <Divider />
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values) => onSubmit(values)}
      >
        {({ errors, touched }) => (
          <Form style={{ padding: "10px 20px" }}>
            <div className="ant-form-item" style={{ marginBottom: 20 }}>
              <label style={{ fontWeight: 500, display: "block", marginBottom: 5 }}>Name</label>
              <Field name="name" as={Input} placeholder="Enter name" />
              {touched.name && errors.name && (
                <div style={{ color: "red", fontSize: 12, marginTop: 5 }}>{errors.name}</div>
              )}
            </div>

            <div className="ant-form-item" style={{ marginBottom: 20 }}>
              <label style={{ fontWeight: 500, display: "block", marginBottom: 5 }}>Type</label>
              <Field name="type" as={Input} placeholder="Enter type (number)" type="number" />
              {touched.type && errors.type && (
                <div style={{ color: "red", fontSize: 12, marginTop: 5 }}>{errors.type}</div>
              )}
            </div>

            <div className="ant-form-item" style={{ textAlign: "center", marginTop: 30 }}>
              <CustomButton type="submit" buttonName={isEdit ? "Update" : "Add"}  sx={{backgroundColor:"#4EB24E"}} />
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default ReasonFormModal;
