import Cookies from "js-cookie";
import {toast} from "react-toastify"
import {Logout as Logoutapi} from "../../Services/ApiService"
import {useUserdata} from "../../Hooks/UserHook"

export const Logout = (): void => {
  const token=useUserdata()
  const payload=new FormData()
  payload.append("token",token)
  
  Logoutapi(payload).then(()=>{
    Cookies.remove("user_token");
    Cookies.remove("user_type")
    window.location.href = "/";
    toast.success("sucessfully Logout")

  })  
};
