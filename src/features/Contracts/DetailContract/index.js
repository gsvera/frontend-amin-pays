import { Row, Tooltip } from "antd";
import "./index.scss";
import Button from "@/components/Button";
import {
  AuditOutlined,
  CalculatorOutlined,
  DeleteOutlined,
  EyeOutlined,
  FilePdfOutlined,
  FileSyncOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { REACT_QUERY_KEYS } from "@/config/react-query-keys";
import apiContract from "@/api/services/apiContract";
import {
  convertCurrency,
  getStatusContract,
  roundingTwoDecimals,
} from "@/utils/GeneralUtils";
import { useMemo, useState } from "react";
import CustomTable from "@/components/CustomTable";
import { setContract } from "@/store-redux/slide/contractSlide";
import { useDispatch } from "react-redux";
import { HasAccessPermission } from "@/hooks/HasAccessPermission";
import { PROFILE_PERMISSIONS, STATUS_CONTRACT } from "@/config/constants";
import ModalTableAmortization from "../ModalTableAmortization";
import ModalViewFile from "@/components/ModalViewFile";
import CustomAntEmpty from "@/components/CustomAntEmpty";
import CustomModalConfirm from "@/components/CustomModalConfirm";
import { apiPay } from "@/api/services/apiPay";
import { useNotification } from "@/hooks/UseNotification";

export const DetailContract = ({ idContract, handleModalPay = {} }) => {
  const dispatch = useDispatch();
  const { hasAccess } = HasAccessPermission();
  const { openErrorNotification, openSuccessNotification } = useNotification();
  const [openModalAmortization, setOpenModalAmortization] = useState(false);
  const [openModalViewFile, setOpenModalViewFile] = useState(false);
  const [openModalPayDelete, setOpenModalPayDelete] = useState(false);
  const [payDelete, setPayDelete] = useState(null);
  const [fileView, setFileView] = useState(null);

  const canAddPayModule = useMemo(
    () => hasAccess(PROFILE_PERMISSIONS.ADD_PAYS),
    [hasAccess]
  );

  const canDeletePayPermission = useMemo(
    () => hasAccess(PROFILE_PERMISSIONS.DELETE_PAYS),
    [hasAccess]
  );

  /**
   * USE QUERYS
   */

  const {
    data: dataContract,
    isLoading: loadingDetail,
    refetch: refetchContract,
  } = useQuery({
    queryKey: [REACT_QUERY_KEYS.contract.getContractWithDetails(idContract)],
    queryFn: () => apiContract.getContractWithDetail(idContract),
    ...{
      select: (data) => data?.data?.items,
    },
    enabled: !!idContract,
  });

  const { mutate: deletePay } = useMutation({
    mutationFn: (data) => apiPay.deletePay(data),
    onSuccess: (data) => handleSuccessPay(data?.data),
    onError: (err) => openErrorNotification(err),
  });

  const handleSuccessPay = (data) => {
    if (data?.error) openErrorNotification(data?.message);
    else {
      openSuccessNotification(data?.message);
      refetchContract();
    }
  };

  /**
   * USE MEMOS
   */
  const showButtonPay = useMemo(
    () =>
      canAddPayModule &&
      dataContract?.statusContract !== STATUS_CONTRACT.TERMINADO,
    [canAddPayModule, dataContract]
  );

  const canDeletePay = useMemo(
    () =>
      dataContract?.statusContract !== STATUS_CONTRACT.TERMINADO &&
      canDeletePayPermission,
    [dataContract, canDeletePayPermission]
  );

  const statusContract = useMemo(() => {
    const dataStatus = getStatusContract(dataContract?.statusContract);
    return {
      statusLabel: dataStatus?.value,
      bgBack: dataStatus?.bgColor,
      bgColor: dataStatus?.color,
    };
  }, [dataContract]);

  const lastPay = useMemo(
    () =>
      dataContract?.pays
        ? dataContract?.pays[dataContract?.pays?.length - 1]
        : [],
    [dataContract]
  );

  const detailAccount = useMemo(() => {
    var pendingBalance = 0;
    var totalPay = 0;
    var arrPay = dataContract?.paysAmortization
      ? dataContract?.paysAmortization
      : [];

    for (var i = 0; i < arrPay?.length; i++) {
      pendingBalance += arrPay[i]?.agreedPay;
      totalPay += arrPay[i]?.payAmount;
    }

    return {
      pendingBalance: roundingTwoDecimals(pendingBalance),
      totalPay: roundingTwoDecimals(totalPay),
    };
  }, [dataContract]);

  /**
   * TABLES HEADERS
   */

  const tablePays = [
    {
      index: "",
      label: "#",
      width: "80px",
      render: (_, row, index) => (
        <div style={{ width: "100%", textAlign: "center" }}>{index + 1}</div>
      ),
    },
    {
      index: "payAmount",
      label: "Monto de pago",
      render: (row) => <div>{convertCurrency(row)}</div>,
    },
    {
      index: "payDate",
      label: "Fecha de pago",
      render: (row) => <div>{row}</div>,
    },
    {
      index: "",
      label: "Archivo",
      render: (_, row) => (
        <div>
          <Tooltip title="Ver archivo">
            <EyeOutlined
              className="click"
              onClick={(e) => handleViewFile(row?.payFile)}
            />
          </Tooltip>
        </div>
      ),
    },
    {
      index: "",
      label: "Eliminar",
      hidden: !canDeletePay,
      render: (_, row) => (
        <div>
          <Tooltip title="Eliminar pago">
            <DeleteOutlined
              className="icon-size-17"
              onClick={(e) => handleOpenDeletePayModal(row?.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const tableHeadAmortization = [
    {
      index: "payNumber",
      label: "Cuota",
      render: (row) => <div>{row}</div>,
    },
    {
      index: "agreedDate",
      label: "Fecha limite",
      render: (row) => <div>{row}</div>,
    },
    {
      index: "payDidDate",
      label: "Fecha de pago",
      render: (row) => <div>{row}</div>,
    },
    {
      index: "agreedPay",
      label: "Monto a pagar",
      render: (row) => <div>{convertCurrency(row)}</div>,
    },
    {
      index: "payAmount",
      label: "Monto pagado",
      render: (row) => <div>{convertCurrency(row)}</div>,
    },
  ];

  const handlePay = () => {
    const statusContract = getStatusContract(dataContract?.statusContract);
    dispatch(
      setContract({
        ...dataContract,
        lastDateDidPay: lastPay?.payDate,
        lastPayAmount: lastPay?.payAmount,
        statusLabel: statusContract.value,
        bgBack: statusContract.bgColor,
        bgColor: statusContract.color,
      })
    );
    handleModalPay?.();
  };

  const handleViewFile = (file) => {
    setFileView({ fileData: file });
    setOpenModalViewFile(true);
  };

  const handleShowTableAmortization = () => {
    setOpenModalAmortization(true);
  };

  const handleCloseTableAmortization = () => {
    setOpenModalAmortization(false);
  };

  const handleCloseViewFile = () => {
    setOpenModalViewFile(false);
    setFileView(null);
  };

  const handleOpenDeletePayModal = (id) => {
    setPayDelete(id);
    setOpenModalPayDelete(true);
  };
  const closeModalPayDelete = () => {
    setOpenModalPayDelete(false);
    setPayDelete(null);
  };
  const confirmDeletePay = () => {
    deletePay({ idPay: payDelete, idContract });
    closeModalPayDelete();
  };

  if (loadingDetail)
    return (
      <div className="loading">
        <LoadingOutlined style={{ fontSize: "35px" }} />
      </div>
    );

  return (
    <>
      {idContract ? (
        <div className="detail-contract">
          <Row className="head-buttons" style={{ justifyContent: "end" }}>
            <Button
              className="btn-cancel"
              text={<CalculatorOutlined className="icon" />}
              tooltip="Tabla de amortizacion"
              onClick={handleShowTableAmortization}
            />
            <Button
              className="btn-action"
              text={<FileSyncOutlined className="icon" />}
              tooltip="Generar convenio"
            />
            <Button
              className="btn-cancel"
              text={<FilePdfOutlined className="icon" />}
              tooltip="Descargar pdf"
            />
            {showButtonPay && (
              <Button
                className="btn-add"
                text={<AuditOutlined className="icon" />}
                tooltip="Aplicar pago"
                onClick={handlePay}
              />
            )}
          </Row>
          <div className="detail-body">
            <div className="head-detail-contract">
              <div className="content-info">
                <div className="title-info">Información del contrato</div>
                <Row>
                  <div className="bold-6">Folio:</div>
                  <div>{dataContract?.folio}</div>
                </Row>
                <Row>
                  <div className="bold-6">Fecha de inicio:</div>
                  <div>{dataContract?.startDate}</div>
                </Row>
                <Row>
                  <div className="bold-6">Fecha de fin:</div>
                  <div>{dataContract?.endDate}</div>
                </Row>
                <Row>
                  <div className="bold-6">Tipo de producto:</div>
                  <div>{dataContract?.typeAmortization}</div>
                </Row>
                <Row>
                  <div className="bold-6">Periodo:</div>
                  <div>{dataContract?.period}</div>
                </Row>
                <Row>
                  <div className="bold-6">Cuotas:</div>
                  <div>{dataContract?.numberPeriod}</div>
                </Row>
                <Row>
                  <div className="bold-6">Monto del contrato:</div>
                  <div>
                    {dataContract?.amount &&
                      convertCurrency(dataContract?.amount)}
                  </div>
                </Row>
                <Row>
                  <div className="bold-6">Tasa de interés:</div>
                  <div>{dataContract?.interestRate}</div>
                </Row>
                <Row>
                  <div className="bold-6">Interés:</div>
                  <div>
                    {dataContract?.interest && `${dataContract?.interest}%`}
                  </div>
                </Row>
              </div>
              <div className="content-info">
                <div className="title-info">Estatus del contrato</div>
                <Row>
                  <div>Estatus:</div>
                  <div>
                    <span
                      className="badge"
                      style={{
                        background: statusContract?.bgBack,
                        color: statusContract?.bgColor,
                      }}
                    >
                      {statusContract?.statusLabel}
                    </span>
                  </div>
                </Row>
                <Row>
                  <div>Fecha de ultimo pago:</div>
                  <div>{lastPay?.payDate}</div>
                </Row>
                <Row>
                  <div>Monto de ultimo pago:</div>
                  <div>
                    {lastPay?.payAmount && convertCurrency(lastPay?.payAmount)}
                  </div>
                </Row>
                <Row>
                  <div>Total a pagar:</div>
                  <div>{convertCurrency(detailAccount.pendingBalance)}</div>
                </Row>
                <Row>
                  <div>Saldo pendiente:</div>
                  <div>
                    {convertCurrency(
                      detailAccount.pendingBalance - detailAccount.totalPay
                    )}
                  </div>
                </Row>
                <Row>
                  <div>Total pagado:</div>
                  <div>{convertCurrency(detailAccount.totalPay)}</div>
                </Row>
              </div>
            </div>
            <div className="head-table-pays">
              <div className="head-table-pays-card">
                <div className="title-info">Pagos realizados</div>
                <CustomTable
                  tableClass="table-detail general-style-table"
                  dataHead={tablePays}
                  dataBody={dataContract?.pays}
                />
              </div>
              <div className="head-table-pays-card">
                <div className="title-info">Amortización de pagos</div>
                <CustomTable
                  tableClass="table-detail general-style-table"
                  dataHead={tableHeadAmortization}
                  dataBody={dataContract?.paysAmortization}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <CustomAntEmpty msg="No ha seleccionado un contrato" />
      )}
      <ModalTableAmortization
        open={openModalAmortization}
        handleClose={handleCloseTableAmortization}
        contract={dataContract}
      />
      <ModalViewFile
        open={openModalViewFile}
        handleClose={handleCloseViewFile}
        file={fileView}
      />
      <CustomModalConfirm
        open={openModalPayDelete}
        handleClose={closeModalPayDelete}
        onSuccessHandle={confirmDeletePay}
        textConfirm="¿Esta seguro de eliminar el pago?, esta acción no podra revertirse!"
      />
    </>
  );
};

export default DetailContract;
