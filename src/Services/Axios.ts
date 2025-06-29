import axios from 'axios';
import {BaseUrl} from "../../public/config"

const axiosInstance = axios.create({
  baseURL: BaseUrl,
});
axiosInstance.interceptors.request.use(
  (config) => {
    // console.log("Request sent:", config);
    return config; 
  },
  (error) => {
    return Promise.reject(error); 
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // console.log("Response Received:", response);
    return response;
  },
  (error) => {
    console.error("Response Error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
