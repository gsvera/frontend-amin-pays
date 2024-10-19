"use client";
import { createContext, useCallback, useEffect, useState } from "react";
import axiosInstance from "@/api/api";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "@/store-redux/slide/userSlide";
import { useNotification } from "@/hooks/UseNotification";

const axiosInstances = [axiosInstance];

const ApiRequestContext = createContext(null);

const ApiRequestProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.userSlice);
  const { openErrorNotification } = useNotification();

  const interceptRequestHandler = useCallback(
    /**
     * Agrega el token a cada request
     * @param {import('axios').AxiosRequestConfig<any>} config
     * @returns
     */
    (config) => {
      config.params = { ...(config?.params ?? {}) };
      const fullUrl = `${config.baseURL}/${config.url}`;
      // Checkea excepciones para agregar token
      //   if (addTokenUrlExceptions.reduce((pv, cv) => fullUrl.includes(cv) || pv, false)) {
      //     return config;
      //   }
      config.headers = {
        ...config.headers,
        Authorization: token ? `Bearer ${token}` : undefined,
      };

      return config;
    },
    [token]
  );

  const interceptResponseErrorHandler = useCallback(
    (error) => {
      const { status: statusCode, data, headers } = error?.response ?? {};
      if (statusCode === 403 && token) {
        dispatch(setToken(null));
        dispatch(setDataUser(null));
        openErrorNotification(t("logout.token_expired"));
      }
      // Reject promise if usual error
      if (statusCode !== 401) {
        return Promise.reject(error);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const requestInterceptors = axiosInstances?.map((axiosInstance) =>
      axiosInstance.interceptors.request.use(interceptRequestHandler)
    );
    const responseInterceptors = axiosInstances?.map((axiosInstance) =>
      axiosInstance.interceptors.response.use(
        (response) => response,
        interceptResponseErrorHandler
      )
    );

    return () => {
      for (let index = 0; index < axiosInstances.length; index++) {
        const axiosInstance = axiosInstances[index];

        axiosInstance.interceptors.request.eject(requestInterceptors[index]);
        axiosInstance.interceptors.request.eject(responseInterceptors[index]);
      }
    };
  }, [interceptRequestHandler, interceptResponseErrorHandler, token]);

  return <ApiRequestContext.Provider>{children}</ApiRequestContext.Provider>;
};

const useApiRequestContext = () => useContext(ApiRequestContext);

export { ApiRequestProvider, useApiRequestContext };
