import { WarningOutlined, SearchOutlined } from "@ant-design/icons";
import { Empty } from "antd";
import "./index.scss";

export const CustomAntEmpty = ({ type, msg }) => {
  const types = {
    error: <WarningOutlined className="emptyIcon" />,
    search: <SearchOutlined className="emptyIcon" />,
    default: <WarningOutlined className="emptyIcon" />,
  };

  return (
    <Empty
      className="custom-empty"
      image={types[type] ? types[type] : types.search}
      description={msg}
    />
  );
};

CustomAntEmpty.defaultProps = {
  msg: "No se encontraron registros para visualizar",
  type: "search",
};

export default CustomAntEmpty;
