import { ARRAY_STATUS_CONTRACT } from "@/config/constants";

export const openWindow = (route, width, height) => {
  return window.open(
    route,
    "_blank",
    `directories=no,titlebar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=${
      width || window.innerWidth
    },height=${height || window.innerHeight}`
  );
};

export const removeAccents = (value) => {
  return value?.normalize("NFD")?.replace(/[\u0300-\u036f]/g, "");
};

export const convertCurrency = (n) => {
  let currencyLocal = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return currencyLocal.format(n);
};

export const getStatusContract = (id) => {
  return ARRAY_STATUS_CONTRACT.find((item) => item.id === id);
};

export default {
  openWindow,
  removeAccents,
  convertCurrency,
};
