import type { FormikProps } from "formik";
import GlobalModal from "../../Compontents/GlobalModal";
import { InputNumber, Input, Form as AntForm, TimePicker } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { useEffect, useRef } from "react";

interface SlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  formik: FormikProps<{
    token: string;
    slot_id: number;
    name: string;
    inventory_end_time: string;
    start_time: string;
    end_time: string;
    booking_end: string;
  }>;
}

const timeFormat = "HH:mm:ss";

const MastersSlotupdate = ({ isOpen, onClose, formik }: SlotModalProps) => {
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen]);

  return (
    <GlobalModal
      title="Update Inventory"
      open={isOpen}
      onOk={() => formik.handleSubmit()}
      onCancel={onClose}
      okText="Update"
      style={{ maxHeight: "80vh", overflowY: "auto" }}
    >
      <div ref={formRef}>
        <AntForm layout="vertical">
          <AntForm.Item
            label="Name"
            validateStatus={formik.errors.name ? "error" : ""}
            help={formik.errors.name}
          >
            <Input
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
          </AntForm.Item>

          <AntForm.Item
            label="Inventory End Time"
            validateStatus={formik.errors.inventory_end_time ? "error" : ""}
            help={formik.errors.inventory_end_time}
          >
            <TimePicker
              style={{ width: "100%" }}
              format={timeFormat}
              value={dayjs(formik.values.inventory_end_time, timeFormat)}
              onChange={(time: Dayjs | null) =>
                formik.setFieldValue(
                  "inventory_end_time",
                  time ? time.format(timeFormat) : ""
                )
              }
            />
          </AntForm.Item>

          <AntForm.Item
            label="Start Time"
            validateStatus={formik.errors.start_time ? "error" : ""}
            help={formik.errors.start_time}
          >
            <TimePicker
              style={{ width: "100%" }}
              format={timeFormat}
              value={dayjs(formik.values.start_time, timeFormat)}
              onChange={(time: Dayjs | null) =>
                formik.setFieldValue(
                  "start_time",
                  time ? time.format(timeFormat) : ""
                )
              }
            />
          </AntForm.Item>

          <AntForm.Item
            label="End Time"
            validateStatus={formik.errors.end_time ? "error" : ""}
            help={formik.errors.end_time}
          >
            <TimePicker
              style={{ width: "100%" }}
              format={timeFormat}
              value={dayjs(formik.values.end_time, timeFormat)}
              onChange={(time: Dayjs | null) =>
                formik.setFieldValue(
                  "end_time",
                  time ? time.format(timeFormat) : ""
                )
              }
            />
          </AntForm.Item>

          <AntForm.Item
            label="Booking End"
            validateStatus={formik.errors.booking_end ? "error" : ""}
            help={formik.errors.booking_end}
          >
            <TimePicker
              style={{ width: "100%" }}
              format={timeFormat}
              value={dayjs(formik.values.booking_end, timeFormat)}
              onChange={(time: Dayjs | null) =>
                formik.setFieldValue(
                  "booking_end",
                  time ? time.format(timeFormat) : ""
                )
              }
            />
          </AntForm.Item>
        </AntForm>
      </div>
    </GlobalModal>
  );
};

export default MastersSlotupdate;
