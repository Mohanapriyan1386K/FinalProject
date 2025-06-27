import { getDecryptedCookie } from "../../../Uitils/Cookeis";
import { getPriceTagDropDown } from "../../../Services/ApiService";

const userdata = getDecryptedCookie("user_token");
const token = userdata.token;

export const pricetagdropdownsOption = async () => {
  const Payload = new FormData();
  Payload.append("token", token);

  try {
    const res = await getPriceTagDropDown(Payload);
    return res.data.data || [];
  } catch (err) {
    console.log(err);
    return []; // fallback return
  }
};
