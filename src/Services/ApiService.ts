import axiosInstance from "./Axios";

export const logindata = (data: any) => {
  return axiosInstance.post("/milk-api/auth/login/", data);
};

export const forgetpassword = (data: any) => {
  return axiosInstance.post("/milk-api/auth/forgot-password", data);
};

export const verfiyotp = (data: any) => {
  return axiosInstance.post("/milk-api/auth/otp-verification", data);
};

export const resetpassword = (data: any) => {
  return axiosInstance.post("/milk-api/auth/reset-password", data);
};

export const fetchUserList = (
  page: number = 1,
  size: number = 10,
  token: string
) => {
  const params = new URLSearchParams();
  params.append("token", token);

  return axiosInstance.post(
    `/milk-api/user/list-users?page=${page}&size=${size}`,
    params.toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

export const fetchfilteredUserList = (
  page: number = 1,
  size: number = 10,
  payload: any
) => {
  return axiosInstance.post(
    `/milk-api/user/list-users?page=${page}&size=${size}`,
    payload
  );
};

export const adduser = (data: any) => {
  return axiosInstance.post("/milk-api/user/create-user", data);
};

export const pricetagdropdown = (data: any) => {
  return axiosInstance.post("/milk-api/drop-down/price-tag-drop-down", data);
};

export const slotdropdown = (data: any) => {
  return axiosInstance.post("/milk-api/drop-down/slot-drop-down", data);
};

export const deleteuser = (data: any) => {
  return axiosInstance.post("/milk-api/user/change-status-user", data);
};

export const viewUser = (data: any) => {
  return axiosInstance.post("/milk-api/user/view-user", data);
};

// 
export const fetchLinesDropDown = (formData: FormData) => {
  return axiosInstance.post("/milk-api/drop-down/lines-drop-down", formData);
};



//

//delete or change status
export const changeUserStatus = (payload: any) => {
  return axiosInstance.post("/milk-api/user/change-status-user", payload);
};

//delete or change status
export const createUser = (payload: any) => {
  return axiosInstance.post("/milk-api/user/create-user", payload);
};

//get user by iD
export const getUserById = (payload: any) => {
  return axiosInstance.post("/milk-api/user/view-user", payload);
};

//update user
export const updateUser = (payload: any) => {
  return axiosInstance.post("/milk-api/user/edit-user", payload);
};

export const getLinesDropDown = (payload: any) => {
  return axiosInstance.post("/milk-api/drop-down/lines-drop-down", payload);
};

export const getPriceTagDropDown = (payload: any) => {
  return axiosInstance.post("/milk-api/drop-down/price-tag-drop-down", payload);
};
export const getDistributorDropDown = (payload: any) => {
  return axiosInstance.post("/milk-api/drop-down/customer-drop-down", payload);
};
export const getSlotDropDown = (payload: any) => {
  return axiosInstance.post("/milk-api/drop-down/slot-drop-down", payload);
};

// dashbaord

export const getdailinventroy = (payload: any) => {
  return axiosInstance.post(
    "milk-api/dashboard/daily-inventory-report",
    payload
  );
};

export const RequiredInventroy = (payload: any) => {
  return axiosInstance.post(
    "/milk-api/dashboard/daily-milk-required-report",
    payload
  );
};

// inventory

export const Listinventory = (
  page: number = 0,
  size: number = 10,
  token: any
) => {
  const params = new URLSearchParams();
  params.append("token", token);
  return axiosInstance.post(
    `/milk-api/inventorylist-inventory?page=${page}&size=${size}`,
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

export const AddInventory = (payload: any) => {
  return axiosInstance.post("/milk-api/inventory/add-inventory", payload);
};

export const UpdateInventory = (payload: any) => {
  return axiosInstance.post("/milk-api/inventory/update-inventory", payload);
};

export const list_inventory_log = (payload: any,page:number,size:number) => {
  return axiosInstance.post(`/milk-api/inventory/list-inventory-log?pages=${page}&${size}`, payload);
};

export const Logouts = (payload: any) => {
  return axiosInstance.post("/milk-api/auth/logout", payload);
};

export const ViwslotMap=(payload:any,page:number,size:number)=>{
    return axiosInstance.post(`/milk-api/milk-sales/list-slot-mapping?pages=${page}&${size}`,payload)
}
