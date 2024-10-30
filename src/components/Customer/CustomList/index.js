import CustomAntEmpty from "@/components/CustomAntEmpty";
import { ExportOutlined } from "@ant-design/icons";
import { List, Tooltip } from "antd";
import "./index.scss";

const CustomListItem = ({ item, onClick }) => {
  const { text, tooltip } = item;
  const handleClick = (item) => {
    onClick?.(item);
  };
  return (
    <Tooltip title={tooltip}>
      <div className="item-list" onClick={(e) => handleClick(item)}>
        {text} <ExportOutlined />
      </div>
    </Tooltip>
  );
};

export const CustomList = ({ dataList, handleSelect, widthList }) => {
  const handleClickList = (item) => {
    handleSelect?.(item);
  };
  return (
    <List
      className="custom-list"
      style={{ width: widthList ?? "90%" }}
      dataSource={dataList}
      renderItem={(item) => (
        <CustomListItem item={item} onClick={handleClickList} />
      )}
      locale={{
        emptyText: dataList ? (
          <CustomAntEmpty type="error" msg="No se encontraron registros" />
        ) : (
          <div></div>
        ),
      }}
    />
  );
};

export default CustomList;
