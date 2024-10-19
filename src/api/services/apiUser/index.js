import axiosInstance from "../../api";

const BASE_URL_AUTH = "/auth/user";
const BASE_URL_PUBLIC = "/public";

const apiUser = {
  prueba: function (data) {
    return axiosInstance.get(`${BASE_URL_PUBLIC}/prueba`);
  },
  login: function (data) {
    return axiosInstance.post(`${BASE_URL_PUBLIC}/login`, data);
  },
  logout: function () {
    return axiosInstance.post(`${BASE_URL_AUTH}/logout`);
  },
};

export default apiUser;
