import { ExportOutlined } from "@ant-design/icons";
import "./index.scss";
import { Tooltip } from "antd";

export const CustomerListSearch = ({ customer, onClick }) => {
  const handleClick = (customerId) => {
    onClick?.(customerId);
  };
  return (
    <Tooltip title={`Correo: ${customer?.email}`}>
      <div className="item-list" onClick={(e) => handleClick(customer)}>
        {customer?.firstName} {customer?.lastName}
        <ExportOutlined />
      </div>
    </Tooltip>
  );
};

export default CustomerListSearch;
