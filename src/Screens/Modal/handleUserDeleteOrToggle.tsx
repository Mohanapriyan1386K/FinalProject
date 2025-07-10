import { Modal } from "antd";
import { toast } from "react-toastify";
import { deleteuser } from "../../Services/ApiService";


export const handleUserDeleteOrToggle = async (
  user: { id: number; name: string },
  token: string,
  status: number,
  callback: () => void,
  actionLabel?: string
) => {
  const isDelete = status === -1;
  const action =
    actionLabel ||
    (status === 1 ? "activate" : status === 0 ? "deactivate" : "delete");

  Modal.confirm({
    title: `Are you sure you want to ${action} this user?`,
    content: `User: ${user.name}`,
    okText: "Yes",
    okType: isDelete ? "danger" : "default",
    cancelText: "No",
    onOk: () => {
      const formData = new FormData();
      formData.append("token", token);
      formData.append("user_id", user.id.toString());
      formData.append("status", status.toString());

      deleteuser(formData)
        .then((response) => {
          toast.success(response.data.msg || `User ${action}d successfully`);
          callback();
        })
        .catch((error) => {
          console.error(`Error during ${action}:`, error);
          toast.error(`${action} failed`);
        });
    },
  });
};
