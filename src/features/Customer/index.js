import { Table, Row, Tooltip, Col } from "antd";
import { useEffect, useMemo, useState } from "react";
import Button from "@/components/Button";
import { PhoneOutlined, MailOutlined, SyncOutlined } from "@ant-design/icons";
import "./index.scss";
import {
  defaultPageParams,
  pageSizeOptions,
  PROFILE_PERMISSIONS,
} from "@/config/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { REACT_QUERY_KEYS } from "@/config/react-query-keys";
import apiCustomer from "@/api/services/apiCustomer";
import { EditIcon } from "@/components/Icons/EditIcon";
import { DeleteOutlined, WhatsAppOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import DelaySearcher from "@/components/DelaySearcher";
import { useNotification } from "@/hooks/UseNotification";
import { openWindow } from "@/utils/GeneralUtils";
import CustomerNote from "./CustomerNote";
import ButtonAddCustomer from "./ButtonAddCustomer";
import { HasAccessPermission } from "@/hooks/HasAccessPermission";
import CustomModalConfirm from "@/components/CustomModalConfirm";

export default function Customer() {
  const { openErrorNotification, openSuccessNotification } = useNotification();
  const { hasAccess } = HasAccessPermission();
  const { dataUser } = useSelector((state) => state.userSlice);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [pageParams, setPageParams] = useState(defaultPageParams);
  const [entityCustomerId, setEntityCustomerId] = useState(null);
  const [entityToDelete, setEntityToDelete] = useState(null);
  const [entityToEdit, setEntityToEdit] = useState(null);
  const [rowSelected, setRowSelected] = useState(null);
  const queryClient = useQueryClient();

  const permissionToAddCustomer = useMemo(
    () => hasAccess(PROFILE_PERMISSIONS.ADD_CUSTOMER),
    [hasAccess]
  );

  const permissionToOptionsContact = useMemo(
    () => hasAccess(PROFILE_PERMISSIONS.VIEW_OPTIONS_CONTACT),
    [hasAccess]
  );

  const permissionToEditCustomer = useMemo(
    () => hasAccess(PROFILE_PERMISSIONS.EDIT_CUSTOMER),
    [hasAccess]
  );

  const permissionToDeleteCustomer = useMemo(
    () => hasAccess(PROFILE_PERMISSIONS.DELETE_CUSTOMER),
    [hasAccess]
  );

  const { data: customerData = [], isLoading } = useQuery({
    queryKey: [REACT_QUERY_KEYS.customer.filterData("customer-table")],
    queryFn: () =>
      apiCustomer.filterData({
        ...pageParams,
        codeCompany: dataUser?.codeCompany,
      }),
    ...{
      select: (data) => data?.data?.items,
    },
  });

  const { data: customerEntity } = useQuery({
    queryKey: [REACT_QUERY_KEYS.customer.getById(entityCustomerId)],
    queryFn: () => apiCustomer.getById(entityCustomerId),
    ...{
      select: (data) => {
        return data?.data?.items;
      },
    },
    enabled: !!entityCustomerId,
  });

  const { mutate: deleteCusomer } = useMutation({
    mutationFn: (data) => apiCustomer.delete(data),
    onSuccess: (data) => {
      handleSuccessDelete(data);
    },
    onError: (err) => {
      openErrorNotification(err);
    },
  });

  useEffect(() => {
    if (customerEntity) {
      setEntityToEdit(customerEntity);
      setOpenModal(true);
    }
  }, [customerEntity]);

  useEffect(() => {
    if (rowSelected) {
      const customerEdited = customerData?.content.filter(
        (item) => item?.id === rowSelected?.id
      );
      setRowSelected(...customerEdited);
    }
  }, [customerData]);

  useEffect(() => {
    reloadTableCustomer();
  }, [pageParams]);

  const handleDeleteCustomer = () => {
    deleteCusomer({
      idCustomer: entityToDelete?.id,
      codeCompany: dataUser?.codeCompany,
    });
  };

  function reloadTableCustomer() {
    queryClient.invalidateQueries([
      REACT_QUERY_KEYS.customer.filterData("customer-table"),
    ]);
  }

  const handleSuccessDelete = (data) => {
    if (data?.data?.error) openErrorNotification(data?.data?.message);
    else openSuccessNotification(data?.data?.message);

    reloadTableCustomer();
    setOpenDeleteModal(false);
    setEntityToDelete(null);
  };

  const GetEntity = (event, idEntity) => {
    if (rowSelected?.id === idEntity) event.stopPropagation();
    setEntityCustomerId(idEntity);
  };

  const closeModal = () => {
    setOpenModal(false);
    setEntityCustomerId(null);
    setEntityToEdit(null);
  };

  const openModalDelete = (event, idCustomer) => {
    if (rowSelected?.id === idCustomer) event.stopPropagation();
    setOpenDeleteModal(true);
    const customer = customerData?.content?.filter(
      (item) => item?.id === idCustomer
    );
    setEntityToDelete(...customer);
  };

  const closeDeleteModal = () => {
    setOpenDeleteModal(false);
    setEntityToDelete(null);
  };

  const columns = [
    {
      title: "Nombre completo",
      width: 150,
      //fixed: "left", // Para que se quede fijo de lado izquierdo
      render: (_, row) => (
        <div>
          {row?.firstName} {row?.lastName}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 150,
      // fixed: "left", // Para que se quede fijo de lado izquierdo
    },
    {
      title: "Telefono celular",
      dataIndex: "celPhone",
      width: 150,
    },
    {
      title: "Telefono oficina/casa",
      dataIndex: "phoneOffice",
      width: 150,
    },
    {
      title: "Descripcion",
      dataIndex: "description",
      // fixed: "right", // Para que se quede fijo de lado derecho
      width: 100,
    },
    {
      title: <div style={{ textAlign: "center" }}>Opciones</div>,
      width: 100,
      fixed: "right",
      render: (_, row) => (
        <Row style={{ justifyContent: "space-evenly" }}>
          {permissionToEditCustomer && (
            <div>
              <Tooltip title="Editar cliente">
                <EditIcon
                  className="click"
                  onClick={(e) => GetEntity(e, row?.id)}
                />
              </Tooltip>
            </div>
          )}
          {permissionToDeleteCustomer && (
            <div>
              <Tooltip title="Borrar cliente">
                <DeleteOutlined
                  className="click"
                  onClick={(e) => openModalDelete(e, row?.id)}
                />
              </Tooltip>
            </div>
          )}
        </Row>
      ),
    },
  ];

  const handlePaginate = (pagination, filters, sorter, extra) => {
    setPageParams({ size: filters, page: pagination - 1 });
  };

  const searchCustomer = (value) => {
    setPageParams({ ...pageParams, word: value });
  };

  const selectedRowCustom = (item, index) => {
    if (rowSelected?.id === item?.id) setRowSelected(null);
    else setRowSelected(item);
  };

  const rowClassName = (record) => {
    return record.id === rowSelected?.id ? "selected-customer" : "";
  };

  const handleWhatsapp = (number) => {
    openWindow(`https://wa.me/${number}`);
  };

  const handleCall = (number) => {
    openWindow(`tel:${number}`);
  };

  const handleEmail = (email) => {
    openWindow(`mailto:${email}`);
  };

  return (
    <div className="content-module">
      <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
        <Row
          style={{
            marginBottom: "20px",
            alignItems: "center",
          }}
        >
          <div style={{ marginRight: "10px" }}>
            <DelaySearcher
              onChangeHandler={searchCustomer}
              timeDelay={1000}
              infoText="Se busca por: nombre, email"
              loadingSearch={isLoading}
            />
          </div>
          {permissionToAddCustomer && (
            <div style={{ marginRight: "10px" }}>
              <ButtonAddCustomer
                handleCloseModal={closeModal}
                entityToEdit={entityToEdit}
                openEdit={openModal}
              />
            </div>
          )}
          <div>
            <Button
              className="btn-simple"
              onClick={(e) => reloadTableCustomer()}
              text={
                <div className="btn-center-child" style={{ fontSize: "17px" }}>
                  <Tooltip title="Actualizar tabla de datos">
                    <SyncOutlined spin={isLoading} />
                  </Tooltip>
                </div>
              }
            />
          </div>
        </Row>
        {permissionToOptionsContact && (
          <Row style={{ marginBottom: "20px", alignItems: "center" }}>
            {rowSelected?.celPhone && (
              <div style={{ width: "100px", textAlign: "center" }}>
                <Col style={{ fontWeight: "bold" }}>Celular</Col>
                <Col>
                  <Row style={{ justifyContent: "space-evenly" }}>
                    {rowSelected?.celPhone && rowSelected?.celPhoneWhatsapp && (
                      <Tooltip
                        title={`Enviar WhatsApp al numero ${rowSelected?.celPhone}`}
                      >
                        <WhatsAppOutlined
                          className="click icon-contact"
                          style={{ color: "var(--color-checked)" }}
                          onClick={(e) => handleWhatsapp(rowSelected?.celPhone)}
                        />
                      </Tooltip>
                    )}
                    {rowSelected?.celPhone && (
                      <Tooltip
                        title={`Llamar al numero ${rowSelected?.celPhone}`}
                      >
                        <PhoneOutlined
                          className="click icon-contact"
                          style={{ color: "var(--color-primary)" }}
                          onClick={(e) => handleCall(rowSelected?.celPhone)}
                        />
                      </Tooltip>
                    )}
                  </Row>
                </Col>
              </div>
            )}
            {rowSelected?.phoneOffice && (
              <div style={{ width: "100px", textAlign: "center" }}>
                <Col style={{ fontWeight: "bold" }}>Oficina</Col>
                <Col>
                  <Row style={{ justifyContent: "space-evenly" }}>
                    {rowSelected?.phoneOffice &&
                      rowSelected?.phoneOfficeWhatsapp && (
                        <Tooltip
                          title={`Enviar WhatsApp al numero ${rowSelected?.phoneOffice}`}
                        >
                          <WhatsAppOutlined
                            style={{ color: "var(--color-checked)" }}
                            className="click"
                            onClick={(e) =>
                              handleWhatsapp(rowSelected?.phoneOffice)
                            }
                          />
                        </Tooltip>
                      )}
                    {rowSelected?.phoneOffice && (
                      <Tooltip
                        title={`Llamar al numero ${rowSelected?.phoneOffice}`}
                      >
                        <PhoneOutlined
                          style={{ color: "var(--color-primary)" }}
                          className="click"
                          onClick={(e) => handleCall(rowSelected?.phoneOffice)}
                        />
                      </Tooltip>
                    )}
                  </Row>
                </Col>
              </div>
            )}
            {rowSelected?.email && (
              <div style={{ width: "100px", textAlign: "center" }}>
                <Col style={{ fontWeight: "bold" }}>Correo</Col>
                <Row style={{ justifyContent: "center" }}>
                  <Tooltip title={`Enviar correo a ${rowSelected?.email}`}>
                    <MailOutlined
                      style={{ color: "var(--color-primary)" }}
                      className="click"
                      onClick={(e) => handleEmail(rowSelected?.email)}
                    />
                  </Tooltip>
                </Row>
              </div>
            )}
          </Row>
        )}
      </Row>
      <div
        style={{
          display: "flex",
          flexWrap: "nowrap",
          justifyContent: "space-between",
        }}
      >
        <Col span={19}>
          <Table
            columns={columns}
            dataSource={customerData?.content}
            scroll={
              {
                // x: 1200,
                // y: "auto",
              }
            }
            size="small"
            showPaginator={false}
            loading={isLoading}
            pagination={{
              pageSize: pageParams.size,
              current: pageParams.page + 1,
              total: customerData?.totalElements,
              onChange: handlePaginate,
              pageSizeOptions: pageSizeOptions,
            }}
            rowClassName={rowClassName}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  selectedRowCustom(record, rowIndex);
                },
              };
            }}
          />
        </Col>
        <Col style={{ paddingLeft: "25px" }}>
          <CustomerNote customer={rowSelected} user={dataUser} />
        </Col>
      </div>
      <CustomModalConfirm
        open={openDeleteModal}
        handleClose={closeDeleteModal}
        onSuccessHandle={handleDeleteCustomer}
        textConfirm={
          <div>
            Estas seguro de eliminar al cliente{" "}
            <span style={{ fontWeight: "bold" }}>
              {entityToDelete?.firstName} {entityToDelete?.lastName}
            </span>
          </div>
        }
      />
    </div>
  );
}
