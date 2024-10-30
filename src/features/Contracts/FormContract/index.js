import {
  Modal,
  Form,
  Row,
  Col,
  DatePicker,
  Select,
  InputNumber,
  Tooltip,
} from "antd";
import {
  DollarOutlined,
  PercentageOutlined,
  CalculatorOutlined,
  DeleteOutlined,
  SaveOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { useForm, useWatch } from "antd/es/form/Form";
import SearchCustomer from "../../../components/SearchCustomer";
import ButtonAddCustomer from "@/features/Customer/ButtonAddCustomer";
import { useSelector } from "react-redux";
import "./index.scss";
import Button from "@/components/Button";
import {
  AMORTIZATION,
  ARRAY_AMORTIZATION,
  ARRAY_PERIOD_DATE,
  ARRAY_INTEREST_RATE,
  FORMAT_DATE,
  INTEREST_RATE,
  STATUS_CONTRACT,
  PROFILE_PERMISSIONS,
} from "@/config/constants";
import {
  GenerateAlemanAmortizacion,
  GenerateAmericanAmortization,
  GenerateFrancesAmortizacion,
} from "@/utils/AmortizationUtils";
import { useState, useEffect, useMemo } from "react";
import CustomTableAmortization from "@/components/CustomTableAmortization";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiContract from "@/api/services/apiContract";
import { useNotification } from "@/hooks/UseNotification";
import { formatDate } from "@/utils/DateUtils";
import moment from "moment";
import { REACT_QUERY_KEYS } from "@/config/react-query-keys";
import dayjs from "dayjs";
import { HasAccessPermission } from "@/hooks/HasAccessPermission";

const defaultData = {
  typeAmortization: AMORTIZATION.FRANCES,
  periodNum: 12,
  period: "mes",
  interestRate: INTEREST_RATE.MES,
  interest: 10,
};

export const FormContract = ({
  open,
  handleClose,
  onSuccessHandler,
  idToEdit,
}) => {
  const [form] = useForm();
  const { openErrorNotification, openSuccessNotification } = useNotification();
  const { hasAccess } = HasAccessPermission();
  const { dataCustomer } = useSelector((state) => state.customerSlice);
  const { dataUser } = useSelector((state) => state.userSlice);
  const [dataAmortization, setDataAmortization] = useState([]);
  const [startDate, setStartDate] = useState();
  const [wStartDate, wAmount] = [
    useWatch("startDate", form),
    useWatch("amount", form),
  ];

  /**
   * Para setear los valores por defecto al cargar el componente
   */
  useEffect(() => {
    form.setFieldsValue(defaultData);
  }, []);

  const permissionToAddCustomer = useMemo(
    () => hasAccess(PROFILE_PERMISSIONS.ADD_CUSTOMER),
    [hasAccess]
  );

  const disabledCalculator = useMemo(
    () => !wStartDate || !wAmount,
    [wStartDate, wAmount]
  );

  const disabledSave = useMemo(
    () =>
      disabledCalculator ||
      !dataAmortization?.dataAmortization ||
      !dataCustomer?.id,
    [disabledCalculator, dataAmortization, dataCustomer?.id]
  );

  /**
   *  QUERYS
   */

  const { data: entityToEdit } = useQuery({
    queryKey: [REACT_QUERY_KEYS.contract.getById(idToEdit)],
    queryFn: () => apiContract.getById(idToEdit),
    ...{
      select: (data) => data?.data?.items,
    },
    enabled: !!idToEdit,
  });

  const { mutate: saveContract } = useMutation({
    mutationFn: (data) => apiContract.save(data),
    onSuccess: (data) => handleSuccessContract(data),
    onError: (error) => {
      openErrorNotification(error);
    },
  });

  const { mutate: updateContract } = useMutation({
    mutationFn: (data) => apiContract.update(data),
    onSuccess: (data) => handleSuccessContract(data),
    onError: (err) => {
      openErrorNotification(err);
    },
  });

  const { mutate: initContract } = useMutation({
    mutationFn: (data) => apiContract.initContract(data),
    onSuccess: (data) => handleSuccessContract(data),
    onError: (err) => {
      openErrorNotification(err);
    },
  });

  /**
   * EFFECTS
   */
  useEffect(() => {
    if (entityToEdit) {
      form.setFieldsValue({
        ...entityToEdit,
        periodNum: entityToEdit?.numberPeriod,
        startDate: "",
      });
      setTimeout(() => {
        form.setFieldsValue({
          startDate: dayjs(entityToEdit?.startDate, FORMAT_DATE.EN_FORMAT_DATE),
        });
      }, 100);
    }
  }, [entityToEdit]);

  /**
   * FUNCTIONS
   */

  const handleSuccessContract = (data) => {
    if (!data?.data?.error) {
      if (!idToEdit) openSuccessNotification("Se guardo el contrato con exito");
      else openSuccessNotification("Se ha actualizado el contrato con exito");
      onSuccessHandler?.();
      handleCloseModal();
    } else openErrorNotification(data?.data?.message);
  };

  const handleCloseModal = () => {
    handleClose?.(false);
    handleCleanFields();
  };

  const calculateAmortization = () => {
    let calculateDataAmortization;

    switch (form.getFieldValue("typeAmortization")) {
      case AMORTIZATION.AMERICANO:
        calculateDataAmortization = GenerateAmericanAmortization({
          ...form.getFieldsValue(),
          startDate: startDate,
        });
        break;
      case AMORTIZATION.ALEMAN:
        calculateDataAmortization = GenerateAlemanAmortizacion({
          ...form.getFieldsValue(),
          startDate: startDate,
        });
        break;
      case AMORTIZATION.FRANCES:
        calculateDataAmortization = GenerateFrancesAmortizacion({
          ...form.getFieldsValue(),
          startDate: startDate,
        });
        break;
    }

    setDataAmortization(calculateDataAmortization);
  };

  const onChangeDate = (date, dateString) => {
    setStartDate(dateString);
  };

  const handleCleanFields = () => {
    form.resetFields();
    form.setFieldsValue(defaultData);
    setDataAmortization([]);
  };

  const handleChangeTypeAmortization = () => {
    setDataAmortization([]);
  };

  const saveDrafContract = () => {
    const dataEntity = generateEntity(true);
    if (!idToEdit) saveContract(dataEntity);
    else {
      dataEntity.id = idToEdit;
      updateContract(dataEntity);
    }
  };

  const saveInitContract = () => {
    const dataEntity = generateEntity();
    if (idToEdit) dataEntity.id = idToEdit;
    dataEntity.nameUserCreated = `${dataUser?.firstName} ${dataUser?.lastName}`;
    initContract(dataEntity);
  };

  function generateEntity(draft) {
    const listPay = dataAmortization?.dataAmortization
      ?.filter((item) => item?.key !== 0)
      .map((item) => ({
        payNumber: item?.key,
        agreedDate: item?.payDate,
        agreedPay: item?.pay,
      }));

    return {
      ...form.getFieldsValue(),
      startDate: formatDate(startDate, FORMAT_DATE.EN_FORMAT_DATE),
      endDate: formatDate(
        moment(dataAmortization?.lastDatePay, FORMAT_DATE.ES_FORMAT_DATE),
        FORMAT_DATE.EN_FORMAT_DATE
      ),
      numberPeriod: form.getFieldValue("periodNum"),
      idCustomer: dataCustomer?.id,
      idCreatedUser: dataUser?.id,
      statusContract: draft ? STATUS_CONTRACT.BORRADOR : STATUS_CONTRACT.ACTIVO,
      listPay,
    };
  }

  return (
    <Modal
      className="form-contract"
      open={open}
      closable={true}
      onCancel={handleCloseModal}
      width={"80%"}
      footer={null}
    >
      <div style={{ paddingTop: "30px" }}>
        <Form form={form}>
          {!idToEdit && (
            <Row
              style={{ marginBottom: "10px", justifyContent: "space-between" }}
            >
              <Col style={{ marginRight: "10px" }}>
                <div style={{ fontWeight: "bold" }}>Buscar cliente</div>
                <SearchCustomer />
              </Col>
              {permissionToAddCustomer && (
                <Col style={{ display: "flex", alignItems: "end" }}>
                  <div>
                    <ButtonAddCustomer persistCustomer />
                  </div>
                </Col>
              )}
            </Row>
          )}
          <Row style={{ marginTop: "25px" }}>
            <span style={{ fontWeight: "bold", marginRight: "5px" }}>
              Cliente:{" "}
            </span>
            {dataCustomer?.id && (
              <span>
                {dataCustomer?.firstName + " " + dataCustomer?.lastName}
              </span>
            )}
          </Row>
          <hr style={{ marginBottom: "10px" }} />
          <Row className="group-inputs-contract">
            <Col span={4}>
              <Form.Item
                label="Fecha de inicio"
                name="startDate"
                rules={[
                  {
                    required: true,
                    message: "Campo obligatorio",
                  },
                ]}
              >
                <DatePicker onChange={onChangeDate} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label="Monto"
                name="amount"
                rules={[
                  {
                    required: true,
                    message: "Campo obligatorio",
                  },
                ]}
              >
                <InputNumber
                  addonBefore={<DollarOutlined />}
                  min="0"
                  step="0.00"
                  precision={2}
                />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item label="Período" name="period">
                <Select options={ARRAY_PERIOD_DATE} />
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item label="Plazo / cuotas" name="periodNum">
                <InputNumber min={1} max={100} />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item label="Tasa de interés" name="interestRate">
                <Select options={ARRAY_INTEREST_RATE} />
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item label="Interés" name="interest">
                <InputNumber
                  addonBefore={<PercentageOutlined />}
                  min="1"
                  precision={0}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Tipo de amortización" name="typeAmortization">
                <Select
                  onChange={handleChangeTypeAmortization}
                  options={ARRAY_AMORTIZATION.map((item) => ({
                    value: item.value,
                    label: <Tooltip title={item.tooltip}>{item.label}</Tooltip>,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ justifyContent: "end" }}>
            <Col style={{ display: "flex" }}>
              <div className="button-action">
                <Button
                  text={
                    <div>
                      <CalculatorOutlined className="icon-size-17" /> Calcular
                    </div>
                  }
                  disabled={disabledCalculator}
                  className="btn-action"
                  onClick={(e) => calculateAmortization()}
                />
              </div>
              <div className="button-action">
                <Button
                  text={
                    <div>
                      <DeleteOutlined className="icon-size-17" /> Limpiar campos
                    </div>
                  }
                  className="btn-cancel"
                  onClick={(e) => handleCleanFields()}
                />
              </div>
              <div className="button-action">
                <Button
                  text={
                    <div>
                      <SaveOutlined className="icon-size-17" /> Guardar borrador
                    </div>
                  }
                  className="btn-add"
                  disabled={disabledCalculator}
                  onClick={(e) => saveDrafContract()}
                />
              </div>
              <div>
                <Button
                  text={
                    <div>
                      <FormOutlined className="icon-size-17" /> Inicializar
                      contrato
                    </div>
                  }
                  className="btn-accept"
                  disabled={disabledSave}
                  onClick={(e) => saveInitContract()}
                />
              </div>
            </Col>
          </Row>
        </Form>
      </div>
      <div>
        <CustomTableAmortization dataBody={dataAmortization} />
      </div>
    </Modal>
  );
};

export default FormContract;
