import { Modal } from "antd";

interface ConfirmActionModalProps {
  title: string;
  content: string;
  onOk: () => void;
  okText?: string;
  cancelText?: string;
  danger?: boolean;
}

const ConfirmActionModal = ({
  title,
  content,
  onOk,
  okText = "Yes",
  cancelText = "No",
  danger = false,
}: ConfirmActionModalProps) => {
  Modal.confirm({
    title,
    content,
    okText,
    cancelText,
    okButtonProps: danger ? { danger: true } : {},
    onOk,
  });

  return null;
};

export default ConfirmActionModal;
