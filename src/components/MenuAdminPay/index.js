import { Col, Tooltip } from "antd";
import {
  UserOutlined,
  DashboardOutlined,
  FileProtectOutlined,
} from "@ant-design/icons";
import "./index.scss";
import { MODULES } from "@/config/constants";

const MenuAdminPay = ({ changeModule }) => {
  const handleMenuModule = (module) => {
    changeModule?.(module);
  };

  return (
    <div className="menu-admi-pay">
      <Col
        style={{
          marginTop: "20px",
          paddingLeft: "15px",
          paddingRight: "15px",
          color: "white",
        }}
      >
        <Col>
          <div
            className="element-menu"
            onClick={(e) => handleMenuModule(MODULES.DASHBOARD_PRINCIPAL)}
          >
            <Tooltip title="Inicio" placement="right">
              <DashboardOutlined className="icon-menu-principal" />
            </Tooltip>
          </div>
        </Col>
        <Col>
          <div
            className="element-menu"
            onClick={(e) => handleMenuModule(MODULES.MODULE_CUSTOMER)}
          >
            <Tooltip title="Clientes" placement="right">
              <UserOutlined className="icon-menu-principal" />
            </Tooltip>
          </div>
        </Col>
        <Col>
          <div
            className="element-menu"
            onClick={(e) => handleMenuModule(MODULES.MODULE_CONTRACTS)}
          >
            <Tooltip title="Contratos" placement="right">
              <FileProtectOutlined className="icon-menu-principal" />
            </Tooltip>
          </div>
        </Col>
      </Col>
    </div>
  );
};

export default MenuAdminPay;
