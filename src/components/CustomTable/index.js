import { useEffect, useMemo, useState } from "react";
import CustomAntEmpty from "../CustomAntEmpty";

export const CustomTable = ({ dataHead = [], dataBody = [], tableClass }) => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setTableData([]);
    const timeout = setTimeout(() => {
      setTableData(dataBody?.length === 0 ? [] : dataBody);
    }, 0);
    return () => clearTimeout(timeout);
  }, [dataBody]);

  return (
    <table className={tableClass}>
      <thead>
        {dataHead.length > 0 && (
          <tr>
            {dataHead.map(
              (item, index) =>
                !item?.hidden && (
                  <th key={index} style={{ width: item?.width ?? "auto" }}>
                    {item?.label}
                  </th>
                )
            )}
          </tr>
        )}
      </thead>
      <tbody>
        {tableData?.length > 0 ? (
          tableData.map((item, index) => (
            <tr key={index}>
              {dataHead.map(
                (column) =>
                  !column?.hidden && (
                    <td key={item.id}>
                      {column?.render(item[column?.index], item, index)}
                    </td>
                  )
              )}
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
