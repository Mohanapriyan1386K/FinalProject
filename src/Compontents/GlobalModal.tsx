import React from "react";
import { Modal } from "antd";


interface ReusableModalProps {
  title?: string;
  open?: any;
  onOk?: () => void;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
  children?: React.ReactNode;
  width?: number;
  isLoading?: boolean;
  style:any
}

const GlobalModal: React.FC<ReusableModalProps> = ({
  title,
  open,
  onOk,
  onCancel,
  okText = "OK",
  cancelText = "Cancel",
  children,
  width = 600,
  isLoading = false,
  style
}) => {
  return (
    <Modal
      title={title}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      confirmLoading={isLoading}
      width={width}
      centered
      style={style}
    >
      {children}
    </Modal>
  );
};

export default GlobalModal;
