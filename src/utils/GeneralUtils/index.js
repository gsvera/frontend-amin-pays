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

export const roundingTwoDecimals = (n) => {
  return Math.round(n * 100) / 100;
};

export const getStatusContract = (id) => {
  return ARRAY_STATUS_CONTRACT.find((item) => item.id === id);
};

/**
 * Funcion para generar un url para pdf para iframe desde un string de base64
 * @param {String} strBs64
 */
export const makePdfBase64 = (strBs64) => {
  const byteCharacters = atob(
    strBs64.split("base64,")[1]?.replace(/[^A-Za-z0-9+/=]/g, "") || ""
  );
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  return url;
};

export default {
  openWindow,
  removeAccents,
  convertCurrency,
  roundingTwoDecimals,
};
