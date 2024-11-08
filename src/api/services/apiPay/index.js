import axiosInstance from "@/api/api";

const BASE_URL = "/pay";

export const apiPay = {
  savePay: function (data) {
    return axiosInstance.post(
      `${BASE_URL}/save-pay?force=${data?.force}`,
      data
    );
  },
  deletePay: function (data) {
    return axiosInstance.post(
      `${BASE_URL}/delete-pay?id-pay=${data?.idPay}&id-contract=${data?.idContract}`
    );
  },
};
