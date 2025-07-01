import Modal from "../../Compontents/GlobalModal";
import {Logout as logout } from "../Auth/Logout"
interface LogoutModalProps {
  open: boolean;
  onOk?: () => void;
  onCancel?: () => void;
}

function LogoutModal({ open,onCancel }: LogoutModalProps) {
  const Logout=()=>{
      logout()
  }
 
  return (
    <Modal
      title="Confirm Logout"
      open={open}
      onOk={Logout}
      onCancel={onCancel}
      okText="Yes, Logout"
      cancelText="Cancel" style={{}}    >
      <p>Are you sure you want to logout?</p>
    </Modal>
  );
}

export default LogoutModal;
