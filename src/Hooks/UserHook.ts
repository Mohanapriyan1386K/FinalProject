import { getDecryptedCookie } from "../Uitils/Cookeis";
export const useUserdata=()=>{
  const userdata = getDecryptedCookie("user_token").token
  return userdata
}
