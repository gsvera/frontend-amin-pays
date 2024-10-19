import axiosInstance from "@/api/api";

const BASE_URL = "/customer";

const apiCustomer = {
  save: function (data) {
    return axiosInstance.post(`${BASE_URL}/save`, data);
  },
  update: function (data) {
    return axiosInstance.put(`${BASE_URL}/update`, data);
  },
  filterData: function (data) {
    return axiosInstance.get(
      `${BASE_URL}/filter/data?page=${data?.page}&size=${
        data?.size
      }&code-company=${data?.codeCompany}${
        data?.word ? "&word=" + data?.word : ""
      }`
    );
  },
  filterAllData: function (data) {
    return axiosInstance.get(`${BASE_URL}/filter/all-data?value=${data}`);
  },
  getById: function (data) {
    return axiosInstance.get(`${BASE_URL}/get-by-id?idcustomer=${data}`);
  },
  delete: function (data) {
    return axiosInstance.post(
      `${BASE_URL}/delete?idcustomer=${data?.idCustomer}&code-company=${data?.codeCompany}`
    );
  },
};

export default apiCustomer;
