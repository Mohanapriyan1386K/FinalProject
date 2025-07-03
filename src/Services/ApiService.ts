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
  page: number,
  size: number,
  payload:any
) => {
  return axiosInstance.post(
    `/milk-api/user/list-users?page=${page}&size=${size}`,payload);
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

export const fetchPriceTagDropDown = (formData: FormData) => {
  return axiosInstance.post("/milk-api/drop-down/price-tag-drop-down", formData);
};

export const fetchUserById = (payload: any) => {
  return axiosInstance.post("/milk-api/user/view-user", payload);
};

export const handleEditUser = (payload: any) => {
  return axiosInstance.post("/milk-api/user/edit-user", payload);
};

export const handleCreateUser = (formData: any) => {
  return axiosInstance.post("/milk-api/user/create-user", formData);
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

export const getDailymilkrequmernt = (payload: any) => {
  return axiosInstance.post(
    "/milk-api/dashboard/daily-milk-required-report",
    payload
  );
};

// inventory

export const Listinventory = (
  page: number,
  size: number,
  payload:any
) => {
  return axiosInstance.post(
    `/milk-api/inventorylist-inventory?page=${page}&size=${size}`,payload   
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



export const ViwslotMap=(payload:any,page:number,size:number)=>{
    return axiosInstance.post(`/milk-api/milk-sales/list-slot-mapping?pages=${page}&${size}`,payload)
}


export const distributorList=(payload:any)=>{
    return axiosInstance.post("/milk-api/slot-assign/get-distributer-line",payload)
}

export const getRouteDetails = (
  page: number = 1,
  size: number = 5,
  payload: any
) => {
  return axiosInstance.post(`/milk-api/slot-assign/list-assigned-slot?page=${page}&size=${size}`,payload);
};



// Logout Api call
export const Logout = (payload: any) => {
  return axiosInstance.post("/milk-api/auth/logout", payload);
};

// 


export const distributerdropdown=(payload:any)=>{
    return axiosInstance.post("/milk-api/drop-down/distributer-drop-down",payload)
}


export const distributedloginventoy=(payload:any)=>{
  return axiosInstance.post("/milk-api/milk-sales/distributer-inventory-log",payload)
}

export const customerdropdown=(payload:any)=>{
    return axiosInstance.post("/milk-api/drop-down/customer-drop-down",payload)
}

export const assignslotmap=(payload:any)=>{
    return axiosInstance.post("/milk-api/slot-assign/assign-slot-map",payload)
}

export const dailyinventoryreportbydate =(payload:any)=>{
  return axiosInstance.post("/milk-api/dashboard/daily-inventory-report-by-date",payload)
}

export const routgetdistributed=(payload:any)=>{
  return axiosInstance.post("/milk-api/drop-down/lines-drop-down",payload)
}

export const disributedmilkgivenstaus=(payload:any)=>{
   return axiosInstance.post("/milk-api/milk-sales/list-slot-mapping",payload)
}