import Cookies from "js-cookie";
import {toast} from "react-toastify"


export const Logout = (): void => {
  Cookies.remove("user_token");
  window.location.href = "/";
  toast.success("sucessfully Logout")
};
