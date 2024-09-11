import axios from "axios";
// import { ENVS } from 'utils/constants';

// const apiUrl = ENVS.REACT_APP_API_URL;

export const axiosInstance = axios.create({
  baseURL: "/api",
});

axios.defaults.withCredentials = true;
axiosInstance.defaults.withCredentials = false;

const isStatusError = (error) => {
  return error.response.status === 401 || error.response.status === 403;
};

axiosInstance.defaults.headers.common["Accept-Language"] = "es";

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error && error.response && isStatusError(error)) {
      // mostrar mensaje de error generico, capaz desloguear
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
