import { Modal, Input, Divider } from "antd";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import CustomButton from "../../Compontents/CoustomButton";

interface PriceTagFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  isEdit?: boolean;
  initialValues: {
    price_tag_id?: number;
    name: string;
    price: string;
  };
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  price: Yup.string().required("Price is required"),
});

const MasterPriceAddupdate = ({
  visible,
  onClose,
  onSubmit,
  isEdit = false,
  initialValues,
}: PriceTagFormModalProps) => {
  return (
    <Modal
      open={visible}
      title={<h2 style={{ textAlign: "center", marginBottom: 0 }}>{isEdit ? "Edit Price Tag" : "Add Price Tag"}</h2>}
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
              <label style={{ fontWeight: 500, display: "block", marginBottom: 5 }}>Price</label>
              <Field name="price" as={Input} placeholder="Enter price" type="number" />
              {touched.price && errors.price && (
                <div style={{ color: "red", fontSize: 12, marginTop: 5 }}>{errors.price}</div>
              )}
            </div>

            <div className="ant-form-item" style={{ textAlign: "center", marginTop: 30 }}>
              <CustomButton type="submit" buttonName={isEdit ? "Update" : "Add"} />
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default MasterPriceAddupdate;
