import { Col, Row, Tooltip } from "antd";
import { useMemo, useState } from "react";
import Button from "@/components/Button";
import {
  FileAddOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import FormContract from "./FormContract";
import SearchCustomerContract from "./SearchCustomerContract";
import { useSelector, useDispatch } from "react-redux";
import { cleanSelection } from "@/store-redux/slide/customerSlide";
import { useMutation, useQuery } from "@tanstack/react-query";
import { REACT_QUERY_KEYS } from "@/config/react-query-keys";
import apiContract from "@/api/services/apiContract";
import { convertCurrency, getStatusContract } from "@/utils/GeneralUtils";
import CustomTable from "@/components/CustomTable";
import {
  FORMAT_DATE,
  PROFILE_PERMISSIONS,
  STATUS_CONTRACT,
} from "@/config/constants";
import { formatDate } from "@/utils/DateUtils";
import "./index.scss";
import CustomModalConfirm from "@/components/CustomModalConfirm";
import { useNotification } from "@/hooks/UseNotification";
import { HasAccessPermission } from "@/hooks/HasAccessPermission";

export default function Contracts() {
  const dispatch = useDispatch();
  const { dataCustomer } = useSelector((state) => state.customerSlice);
  const { openSuccessNotification, openErrorNotification } = useNotification();
  const { hasAccess } = HasAccessPermission();
  const [openModalContract, setOpenModalContract] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [idContractSelected, setIdContractSelected] = useState();
  const [idContractView, setIdContractView] = useState();

  const canAddContract = useMemo(
    () => hasAccess(PROFILE_PERMISSIONS.ADD_CONTRACTS),
    [hasAccess]
  );

  const tableDataHead = [
    {
      index: "statusContract",
      label: "Estatus",
      render: (row) => {
        const { value, bgColor, color } = getStatusContract(row);
        return (
          <div className="badge" style={{ background: bgColor, color: color }}>
            {value}
          </div>
        );
      },
    },
    {
      index: "startDate",
      label: "Fecha de inicio",
      render: (row) => <div>{formatDate(row, FORMAT_DATE.ES_FORMAT_DATE)}</div>,
    },
    {
      index: "typeAmortization",
      label: "Tipo de amorización",
      render: (row) => <div>{row}</div>,
    },
    {
      index: "amount",
      label: "Monto",
      render: (row) => <div>{convertCurrency(row)}</div>,
    },
    {
      index: "",
      label: "Opciones",
      render: (row, item) => {
        return (
          <Row style={{ width: "100%", justifyContent: "space-evenly" }}>
            {item?.statusContract === STATUS_CONTRACT.BORRADOR ? (
              <>
                <Tooltip title="Editar contrato">
                  <EditOutlined
                    className="icon-size-17"
                    onClick={(e) => handleOpenModalEditContract(item?.id)}
                  />
                </Tooltip>
                <Tooltip title="Eliminar contrato">
                  <DeleteOutlined
                    className="icon-size-17"
                    onClick={(e) => handleOpenDeleteModal(item?.id)}
                  />
                </Tooltip>
              </>
            ) : (
              <Tooltip title="Ver contrato">
                <EyeOutlined
                  className="icon-size-17"
                  onClick={(e) => handleViewDetail(item?.id)}
                />
              </Tooltip>
            )}
          </Row>
        );
      },
    },
  ];

  /**
   * Querys
   */

  const { data: dataContracts = [], refetch: refetchContracts } = useQuery({
    queryKey: [REACT_QUERY_KEYS.contract.getByCustomer(dataCustomer?.id)],
    queryFn: () => apiContract.getByCustomer(dataCustomer?.id),
    ...{
      select: (data) => data?.data?.items,
    },
    enabled: !!dataCustomer?.id,
  });

  const { mutate: deleteContract } = useMutation({
    mutationFn: (data) => apiContract.deleteContract(data),
    onSuccess: (data) => handleSuccessDeleteContract(data?.data),
    onError: (err) => openErrorNotification(err),
  });

  /**
   *
   * FUNCTIONS
   */

  const handleSuccessDeleteContract = (data) => {
    if (!data?.error) {
      openSuccessNotification(data?.message);
      refetchContracts();
      setIdContractSelected("");
      setOpenModalDelete(false);
    } else openErrorNotification(data?.message);
  };

  const handleOpenModalContrat = (open = false) => {
    setOpenModalContract(open);
    setIdContractSelected("");
  };

  const cleanSeleccionCustomer = () => {
    dispatch(cleanSelection());
    setIdContractSelected(null);
  };

  const handleOpenDeleteModal = (id) => {
    setIdContractSelected(id);
    setOpenModalDelete(true);
  };

  const handleViewDetail = (id) => {
    setIdContractView(id);
  };

  const handleCloseModalDelete = () => {
    setIdContractSelected("");
    setOpenModalDelete(false);
  };

  const handleDeleteContract = () => {
    deleteContract(idContractSelected);
  };

  const handleOpenModalEditContract = (idContract) => {
    setIdContractSelected(idContract);
    setOpenModalContract(true);
  };

  return (
    <div className="content-module">
      <Row>
        <Row style={{ justifyContent: "space-between", width: "100%" }}>
          <Row>
            <SearchCustomerContract />
            <Button
              style={{ marginLeft: "10px" }}
              text={
                <div>
                  <DeleteOutlined className="icon-size-17" /> Limpiar seleccion
                </div>
              }
              className="btn-cancel"
              onClick={(e) => cleanSeleccionCustomer()}
            />
          </Row>
          {canAddContract && (
            <div>
              <Button
                className="btn-add"
                onClick={(e) => handleOpenModalContrat(true)}
                text={
                  <div>
                    Agregar contrato{" "}
                    <FileAddOutlined style={{ fontSize: "15px" }} />
                  </div>
                }
              />
            </div>
          )}
        </Row>
      </Row>
      <div className="body-module">
        <Col span={9}>
          <Row style={{ width: "100%" }}>
            <div>
              <span className="bold">Cliente:</span> {dataCustomer?.firstName}{" "}
              {dataCustomer?.lastName}
            </div>
          </Row>
          <Row style={{ width: "100%", marginTop: "10px" }}>
            <Col>
              <CustomTable
                tableClass={"list-contract"}
                dataHead={tableDataHead}
                dataBody={dataContracts}
              />
            </Col>
          </Row>
        </Col>
        <Col span={15}>{idContractView}</Col>
      </div>
      <FormContract
        open={openModalContract}
        handleClose={handleOpenModalContrat}
        onSuccessHandler={refetchContracts}
        idToEdit={idContractSelected}
      />
      <CustomModalConfirm
        open={openModalDelete}
        textConfirm={"¿Esta seguro de eliminar el borrador de este contrato?"}
        handleClose={handleCloseModalDelete}
        onSuccessHandle={handleDeleteContract}
      />
    </div>
  );
}
