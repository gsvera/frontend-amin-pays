import { Row, Tooltip } from "antd";
import "./index.scss";
import {
  BellOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import ModalLogout from "./ModalLogout";
import { useState } from "react";

const MenuAdminPayHeader = () => {
  const [showLogout, setShowLogout] = useState(false);

  function openLogoutModal() {
    setShowLogout(true);
  }

  return (
    <div className="menu-admi-pay-header">
      <div className="content-img-logo">
        <img
          className="logo-menu"
          src="/assets/starcraft-wide.png"
          alt="Logo"
        />
      </div>
      <Row className="aling-icon-menu">
        <Tooltip placement="top" title="Notificaciones">
          <BellOutlined className="icon-menu" />
        </Tooltip>
        <Tooltip placement="top" title="Configuración">
          <SettingOutlined className="icon-menu" />
        </Tooltip>
        <Tooltip placement="top" title="Cerrar sesión">
          <LogoutOutlined className="icon-menu" onClick={openLogoutModal} />
        </Tooltip>
      </Row>
      <ModalLogout open={showLogout} handleClose={setShowLogout} />
    </div>
  );
};

export default MenuAdminPayHeader;
