import {
  getPriceTagDropDown,
} from "./ApiService";
import { getDecryptedCookie } from "../Uitils/Cookeis";

const userToken = getDecryptedCookie("user_token")?.token;

const formData = new FormData();
formData.append("token", userToken);



export const PriceTagData = async () => {
  try {
    const res = await getPriceTagDropDown(formData);
    return res.data;
  } catch (error) {
    console.error("Error fetching price tag data:", error);
    return null;
  }
};
