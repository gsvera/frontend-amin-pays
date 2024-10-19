import { useMemo } from "react";
import CustomAntEmpty from "../CustomAntEmpty";

export const CustomTable = ({ dataHead = [], dataBody = [], tableClass }) => {
  const dataTableBody = useMemo(
    () => (dataBody?.length === 0 ? [] : dataBody),
    [dataBody]
  );

  return (
    <table className={tableClass}>
      <thead>
        {dataHead.length > 0 && (
          <tr>
            {dataHead.map((item, index) => (
              <th key={index}>{item?.label}</th>
            ))}
          </tr>
        )}
      </thead>
      <tbody>
        {dataTableBody?.length > 0 ? (
          dataTableBody.map((item, index) => (
            <tr key={index}>
              {dataHead.map((column) => (
                <td key={item.id}>
                  {column?.render(item[column?.index], item)}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={dataHead?.length}>
              <CustomAntEmpty
                type="search"
                msg="No se encontraron registros para visualizar"
              />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default CustomTable;
