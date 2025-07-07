// src/Components/ConfirmActionModal.tsx
import { Modal } from "antd";

interface ConfirmActionModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmActionModal = ({
  open,
  onCancel,
  onConfirm,
  title,
  content,
  confirmText = "Yes",
  cancelText = "No",
}: ConfirmActionModalProps) => {
  return (
    <Modal
      title={title}
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      okText={confirmText}
      cancelText={cancelText}
      centered
    >
      <p>{content}</p>
    </Modal>
  );
};

export default ConfirmActionModal;
