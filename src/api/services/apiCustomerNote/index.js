import axiosInstance from "@/api/api";

const BASE_URL = "/customer-note";

const apiCustomerNote = {
  save: function (data) {
    return axiosInstance.post(`${BASE_URL}/save`, data);
  },
  getByCustomer: function (idCustomer) {
    return axiosInstance.get(
      `${BASE_URL}/get-by-customer?id-customer=${idCustomer}`
    );
  },
};

export default apiCustomerNote;
