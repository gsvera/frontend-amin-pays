"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import MenuAdminPay from "@/components/MenuAdminPay";
import { Spin } from "antd";
import MenuAdminPayHeader from "@/components/MenuAdminPayHeader";
import "./index.scss";
import { MODULES, MODULES_MODALS } from "@/config/constants";
import Dashboard from "@/features/Dashboard";
import QuickApps from "@/features/QuickApps";
import Customer from "@/features/Customer";
import { LoadingOutlined } from "@ant-design/icons";
import Contracts from "@/features/Contracts";
import PayModal from "@/features/PayModal";

export default function Principal() {
  const { token, dataUser } = useSelector((state) => state.userSlice);
  const router = useRouter();
  const [component, setComponent] = useState(MODULES.DASHBOARD_PRINCIPAL);
  const [componentModal, setComponenteModal] = useState(null);
  const [modalPay, setModalPay] = useState(false);

  useEffect(() => {
    switch (componentModal) {
      case MODULES_MODALS.MODAL_PAY:
        setModalPay(true);
        break;
    }
  }, [componentModal]);

  const handleClosePay = () => {
    setModalPay(false);
    setComponenteModal(null);
  };

  const handleModalComponente = (component) => {
    setModalPay(component);
  };

  if (!token) {
    router.push("/login");
    return (
      <div className="white-space-load">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </div>
    );
  } else {
    return (
      <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
        <div className="container-menu-header">
          <MenuAdminPayHeader />
        </div>
        <div style={{ display: "flex", height: "100%", width: "100%" }}>
          <MenuAdminPay
            changeModule={setComponent}
            openModuleModal={setComponenteModal}
          />
          {component === MODULES.DASHBOARD_PRINCIPAL && (
            <div style={{ marginTop: "15px", marginLeft: "15px" }}>
              Bienvenido {dataUser?.firstName} {dataUser?.lastName}
              <Dashboard />
              <QuickApps />
            </div>
          )}
          {component === MODULES.MODULE_CUSTOMER && <Customer />}
          {component === MODULES.MODULE_CONTRACTS && (
            <Contracts handlePrincipalModal={handleModalComponente} />
          )}
          <PayModal open={modalPay} handleClose={handleClosePay} />
        </div>
      </div>
    );
  }
}
