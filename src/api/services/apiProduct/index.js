import axiosInstance from "@/api/api";

const BASE_URL = "/product";

export const apiProduct = {
  getAllProducts: function () {
    return axiosInstance.get(`${BASE_URL}/get-products`);
  },
};
