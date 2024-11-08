import { convertCurrency } from "@/utils/GeneralUtils";

export const dataHead = [
  {
    label: "#",
    index: "key",
    type: "",
  },
  {
    label: "Fecha pago",
    index: "payDate",
    type: "",
  },
  {
    label: "Pago",
    index: "pay",
    type: "money",
  },
  {
    label: "Interes",
    index: "interest",
    type: "money",
  },
  {
    label: "Amortización",
    index: "amortization",
    type: "money",
  },
  {
    label: "Saldo",
    index: "balance",
    type: "money",
  },
];

export const CustomTableAmortization = ({ dataBody, className }) => {
  return (
    <div>
      <table style={{ width: "100%" }} className={className}>
        <thead>
          <tr>
            {dataHead &&
              dataHead?.map((item, index) => {
                return <th key={index}>{item.label}</th>;
              })}
          </tr>
        </thead>
        <tbody>
          {dataHead &&
            dataBody &&
            dataBody?.dataAmortization?.map((item) => {
              return (
                <tr key={item.key}>
                  {dataHead?.map((column) => {
                    return (
                      <td style={{ textAlign: "center" }} key={item.key}>
                        {column?.type === "money"
                          ? convertCurrency(item[column?.index])
                          : item[column?.index]}
                      </td>
                    );
                  })}
                </tr>
              );
            })}

          {dataBody && (
            <tr className="footer-table">
              <td></td>
              <td className="text-center bold-6">Totales:</td>
              <td className="text-center bold-6">
                {dataBody?.totalPay && convertCurrency(dataBody.totalPay)}
              </td>
              <td className="text-center bold-6">
                {dataBody?.totalInterest &&
                  convertCurrency(dataBody.totalInterest)}
              </td>
              <td className="text-center bold-6">
                {dataBody?.totalAmortization &&
                  convertCurrency(dataBody.totalAmortization)}
              </td>
              <td></td>
            </tr>
          )}
        </tbody>
        <tfooter></tfooter>
      </table>
    </div>
  );
};

export default CustomTableAmortization;
