import FooterModal from "@/components/FormComponent/FooterModal";
import { REGEX } from "@/config/constants";
import { Form, Modal, Input, Row, Col } from "antd";
import { useForm, useWatch } from "antd/es/form/Form";
import apiCustomer from "@/api/services/apiCustomer";
import "./index.scss";
import { useMutation } from "@tanstack/react-query";
import { useNotification } from "@/hooks/UseNotification";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { REACT_QUERY_KEYS } from "@/config/react-query-keys";
import { useSelector, useDispatch } from "react-redux";
import { setCustomer } from "@/store-redux/slide/customerSlide";
import CustomSwitch from "@/components/CustomSwitch";

export default function FormCustomer({
  open,
  closeModal,
  entityToEdit = null,
  persistCustomer = false,
}) {
  const [form] = useForm();
  const dispatch = useDispatch();
  const { openErrorNotification, openSuccessNotification } = useNotification();
  const { dataUser } = useSelector((state) => state.userSlice);
  const queryClient = useQueryClient();
  const [checkCelWhatsapp, setCheckCelWhatsapp] = useState(false);
  const [checkOfficeWhatsapp, setCheckOfficeWhatsapp] = useState(false);
  const [wCelPhone, wPhoneOffice] = [
    useWatch("celPhone", form),
    useWatch("phoneOffice", form),
  ];

  const { mutate: saveCustomer } = useMutation({
    mutationFn: (data) => apiCustomer.save(data),
    onSuccess: (data) => {
      handleSucccessCustomer(data);
    },
    onError: (err) => {
      openErrorNotification(err);
    },
  });

  const { mutate: updateCustomer } = useMutation({
    mutationFn: (data) => apiCustomer.update(data),
    onSuccess: (data) => {
      handleSucccessCustomer(data);
    },
    onError: (err) => {
      openErrorNotification(err);
    },
  });

  useEffect(() => {
    if (entityToEdit) {
      form.setFieldsValue({
        firstName: entityToEdit?.firstName,
        lastName: entityToEdit?.lastName,
        email: entityToEdit?.email,
        celPhone: entityToEdit?.celPhone,
        phoneOffice: entityToEdit?.phoneOffice,
        description: entityToEdit?.description,
      });
      setCheckCelWhatsapp(entityToEdit?.celPhoneWhatsapp);
      setCheckOfficeWhatsapp(entityToEdit?.phoneOfficeWhatsapp);
    } else {
      setCheckCelWhatsapp(false);
      setCheckOfficeWhatsapp(false);
    }
  }, [entityToEdit]);

  useEffect(() => {
    if (!form.getFieldValue("celPhone")) setCheckCelWhatsapp(false);

    if (!form.getFieldValue("phoneOffice")) setCheckOfficeWhatsapp(false);
  }, [form.getFieldValue("celPhone"), form.getFieldValue("phoneOffice")]);

  const handleClose = () => {
    form.resetFields();
    closeModal?.();
  };
  const handleSucccessCustomer = (data) => {
    if (!data.error) {
      queryClient.invalidateQueries([
        REACT_QUERY_KEYS.customer.filterData("customer-table"),
      ]);
      if (entityToEdit)
        openSuccessNotification("Se actualizo el cliente con exito");
      else openSuccessNotification("Cliente guardado con exito");

      if (persistCustomer) {
        dispatch(
          setCustomer({ ...form.getFieldsValue(), id: data?.data?.items })
        );
      }

      handleClose();
    } else {
      openErrorNotification("Ha ocurrido algo, intentelo mas tarde");
    }
  };
  const handleSubmitCustomer = async () => {
    try {
      await form.validateFields();

      if (entityToEdit)
        updateCustomer({
          ...form.getFieldsValue(),
          updatedUser: dataUser?.id,
          id: entityToEdit?.id,
          celPhoneWhatsapp: checkCelWhatsapp,
          phoneOfficeWhatsapp: checkOfficeWhatsapp,
        });
      else
        saveCustomer({
          ...form.getFieldsValue(),
          createdUser: dataUser?.id,
          codeCompany: dataUser?.codeCompany,
          celPhoneWhatsapp: checkCelWhatsapp,
          phoneOfficeWhatsapp: checkOfficeWhatsapp,
        });
    } catch (error) {
      // console.log(error);
    }
  };
  return (
    <Modal
      open={open}
      closable
      className="form-add-customer"
      footer={null}
      onCancel={handleClose}
    >
      <h4>{!!entityToEdit ? "Agregar nuevo cliente" : "Editar cliente"}</h4>
      <Form form={form}>
        <Form.Item
          label="Nombre(s)"
          name="firstName"
          className="form-add-customer-item"
          rules={[
            {
              required: true,
              message: "Campo obligatorio",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Apellido(s)"
          name="lastName"
          className="form-add-customer-item"
          rules={[
            {
              required: true,
              message: "Campo obligatorio",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          className="form-add-customer-item"
          rules={[
            {
              required: true,
              message: "Campo obligatorio",
            },
            {
              pattern: REGEX.EMAIL,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Row>
          <Col span={19} style={{ paddingRight: "10px" }}>
            <Form.Item
              label="Telefono Celular"
              name="celPhone"
              className="form-add-customer-item"
              rules={[
                {
                  required: true,
                  message: "Campo obligatorio",
                },
                {
                  pattern: REGEX.NUMBER,
                  message: "Agregue un numero valido",
                },
              ]}
            >
              <Input maxLength={13} suffix={`${wCelPhone?.length || 0}/13`} />
            </Form.Item>
          </Col>
          <Col span={5}>
            <CustomSwitch
              title="WhatsApp"
              checked={checkCelWhatsapp}
              setChecked={setCheckCelWhatsapp}
              disabled={form.getFieldValue("celPhone") ? false : true}
            />
          </Col>
        </Row>
        <Row>
          <Col span={19} style={{ paddingRight: "10px" }}>
            <Form.Item
              label="Telefono oficina/casa"
              name="phoneOffice"
              className="form-add-customer-item"
              rules={[
                {
                  pattern: REGEX.NUMBER,
                  message: "Agregue un numero valido",
                },
              ]}
            >
              <Input
                maxLength={13}
                suffix={`${wPhoneOffice?.length || 0}/13`}
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <CustomSwitch
              title="WhatsApp"
              checked={checkOfficeWhatsapp}
              setChecked={setCheckOfficeWhatsapp}
              disabled={form.getFieldValue("phoneOffice") ? false : true}
            />
          </Col>
        </Row>
        <Form.Item
          label="Descripcion"
          name="description"
          className="form-add-customer-item"
        >
          <Input.TextArea
            rows={4}
            placeholder="Ingrese una nota sobre el cliente"
          />
        </Form.Item>
        <Row style={{ justifyContent: "end", marginTop: "15px" }}>
          <FooterModal
            btnCancelClass="btn-cancel mr-1"
            textCancel="Cancelar"
            handleCancel={handleClose}
            btnSubmitClass={`${
              !!entityToEdit ? "btn-update" : "btn-accept"
            } ml-1`}
            textSubmit={!!entityToEdit ? "Actualizar" : "Guardar"}
            handleSubmit={handleSubmitCustomer}
          />
        </Row>
      </Form>
    </Modal>
  );
}
