import { getDecryptedCookie } from "../Uitils/Cookeis";
import dayjs from 'dayjs';
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


export const useCurrentdate=()=>{
  const currentDate = dayjs().format('YYYY-MM-DD');
  return currentDate;
}