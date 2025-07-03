import { getDecryptedCookie } from "../Uitils/Cookeis";
export const useUserdata=()=>{
  const userdata = getDecryptedCookie("user_token")?.token
  return userdata
}

export const useUsertype=()=>{
  const usertype =getDecryptedCookie("user_token")?.user_type
  return usertype
}

export const useUserid=()=>{
  const useralldata=getDecryptedCookie("user_token")?.user_id
  return useralldata
}
