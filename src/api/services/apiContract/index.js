import axiosInstance from "@/api/api";

const BASE_URL = "/contract";

export const apiContract = {
  getByCustomer: function (idCustomer) {
    return axiosInstance.get(
      `${BASE_URL}/get-by-customer?id-customer=${idCustomer}`
    );
  },
  getById: function (idContract) {
    return axiosInstance.get(`${BASE_URL}/get-by-id?id-contract=${idContract}`);
  },
  getByCustomerContract: function (word) {
    return axiosInstance.get(
      `${BASE_URL}/get-by-customer-contract?word=${word}`
    );
  },
  save: function (data) {
    return axiosInstance.post(`${BASE_URL}/save`, data);
  },
  update: function (data) {
    return axiosInstance.put(`${BASE_URL}/update`, data);
  },
  initContract: function (data) {
    return axiosInstance.post(`${BASE_URL}/init-contract`, data);
  },
  deleteContract: function (idContract) {
    return axiosInstance.post(`${BASE_URL}/delete?id-contract=${idContract}`);
  },
};

export default apiContract;
