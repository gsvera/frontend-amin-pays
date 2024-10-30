import SearchContract from "@/components/SearchContract";
import {
  Button,
  DatePicker,
  Form,
  InputNumber,
  Modal,
  Row,
  Upload,
} from "antd";
import "./index.scss";
import { useMemo, useState } from "react";
import { convertCurrency, getStatusContract } from "@/utils/GeneralUtils";
import { DATE_PICKER_PROPS, formatDate } from "@/utils/DateUtils";
import { DollarOutlined, UploadOutlined } from "@ant-design/icons";
import { useForm, useWatch } from "antd/es/form/Form";
import FooterModal from "@/components/FormComponent/FooterModal";
import { useMutation } from "@tanstack/react-query";
import { apiPay } from "@/api/services/apiPay";
import { useNotification } from "@/hooks/UseNotification";
import { FORMAT_DATE, TYPES_PAY } from "@/config/constants";
import { useSelector } from "react-redux";
import moment from "moment";
import CustomModalConfirm from "@/components/CustomModalConfirm";

const beforeUpload = (file) => {
  const isJpgOrPng =
    file.type === "image/jpeg" ||
    file.type === "image/jpg" ||
    file.type === "image/png" ||
    file.type === "application/pdf";

  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

export default function PayModal({ open, handleClose }) {
  const [form] = useForm();
  const {
    openErrorNotification,
    openSuccessNotification,
    openInfoNotification,
  } = useNotification();
  const { dataUser } = useSelector((state) => state.userSlice);
  const [contractSelected, setContractSelected] = useState();
  const [payFile, setPayFile] = useState();
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [wPayDate, wPayAmount] = [
    useWatch("payDate", form),
    useWatch("payAmount", form),
  ];

  /**
   * Query functions
   */
  const { mutate: savePay } = useMutation({
    mutationFn: (data) => apiPay.savePay(data),
    onSuccess: (data) => handleSuccessPay(data?.data),
    onError: (err) => {
      openErrorNotification(err);
    },
  });

  /**
   * useMamos
   */

  const disabledButton = useMemo(
    () => !wPayDate || !wPayAmount || !payFile,
    [wPayDate, wPayAmount, payFile]
  );

  /**
   *
   * Handlers
   */

  const handleSuccessPay = (data) => {
    if (data?.error && data?.items?.typesPay === TYPES_PAY.PAY_MORE_TO_AMOUNT)
      setOpenConfirmModal(true);
    else if (data?.error) openErrorNotification(data?.message);
    else {
      form.resetFields();
      setPayFile("");
      if (data?.items?.typesPay === TYPES_PAY.PAY_LESS_TO_AMOUNT)
        openInfoNotification("Su pago fue menor a la cuota esperada.");

      openSuccessNotification(data?.message);
    }
  };

  const selectContract = (item) => {
    const statusContract = getStatusContract(item?.statusContract);
    setContractSelected({
      ...item,
      statusLabel: statusContract.value,
      bgBack: statusContract.bgColor,
      bgColor: statusContract.color,
    });
  };

  const handleCloseModal = () => {
    handleClose?.();
    setContractSelected(null);
  };

  const handleCloseModalConfirm = () => {
    setOpenConfirmModal(false);
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const handleChangeUploadFile = (info) => {
    if (info.file.status === "uploading") {
      // setLoading(true);
      // return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (url) => {
        setPayFile(url);
        // setLoading(false);
        // setImageUrl(url);
      });
    }
  };

  const handleRemoveFile = () => {
    setPayFile(null);
  };

  const AcceptConfirmForce = () => {
    handleSubmitPay(true);
    setOpenConfirmModal(false);
  };

  const handleSubmitPay = async (force = false) => {
    try {
      await form.validateFields();

      const payDate = formatDate(
        form.getFieldValue("payDate"),
        FORMAT_DATE.EN_FORMAT_DATE
      );
      // Se deja asi por el momento pero este campo tendria que ser la fecha que aparece en el vourcher de pago
      const payDidDate = formatDate(moment(), FORMAT_DATE.EN_FORMAT_DATE);

      savePay({
        ...form.getFieldsValue(),
        payDate,
        payDidDate,
        payFile,
        createdNameUser: `${dataUser?.firstName} ${dataUser.lastName}`,
        idCreatedUser: dataUser?.id,
        idContractDto: contractSelected?.id,
        force,
      });
    } catch (Exception) {}
  };

  return (
    <>
      <Modal
        className="modul-modal-pay"
        open={open}
        closable
        onCancel={handleCloseModal}
        footer={null}
        width={600}
      >
        <Form className="form-modul-pay" form={form}>
          <SearchContract handleSelectContract={selectContract} />
          <Row style={{ justifyContent: "space-between", marginTop: "20px" }}>
            <div>
              <span style={{ fontWeight: "bold" }}>Folio:</span>{" "}
              {contractSelected?.folio}
            </div>

            <div>
              <span style={{ fontWeight: "bold" }}>Ultima fecha de pago: </span>
              {contractSelected?.lastDateDidPay}
            </div>
            <div>
              <span style={{ fontWeight: "bold" }}>
                Monto de ultima cuota:{" "}
              </span>
              {convertCurrency(contractSelected?.lastPayAmount)}
            </div>
            <div>
              <span style={{ fontWeight: "bold" }}>Estatus: </span>
              <span
                className="badge"
                style={{
                  background: contractSelected?.bgBack,
                  color: contractSelected?.bgColor,
                }}
              >
                {contractSelected?.statusLabel}
              </span>
            </div>
          </Row>
          <Row style={{ marginTop: "25px" }}>
            <Form.Item
              label="Fecha de pago"
              name="payDate"
              rules={[
                { required: true, message: "Llene el campo obligatorio" },
              ]}
            >
              <DatePicker
                disabled={!contractSelected}
                {...DATE_PICKER_PROPS.disabledDateAfterToday}
              />
            </Form.Item>
            <Form.Item
              label="Monto de pago"
              name="payAmount"
              rules={[
                { required: true, message: "Llene el campo obligatorio" },
              ]}
            >
              <InputNumber
                addonBefore={<DollarOutlined />}
                min="0"
                step="0.00"
                precision={2}
                disabled={!contractSelected}
              />
            </Form.Item>
            <Form.Item
              label="Ficha de pago"
              name="imgPay"
              rules={[
                { required: true, message: "Debe subir una ficha de pago" },
              ]}
            >
              <Upload
                beforeUpload={beforeUpload}
                onChange={handleChangeUploadFile}
                maxCount={1}
                onRemove={handleRemoveFile}
              >
                <Button
                  className="btn-file"
                  icon={<UploadOutlined />}
                  disabled={!contractSelected}
                >
                  Subir archivo
                </Button>
              </Upload>
            </Form.Item>
          </Row>
          <Row style={{ justifyContent: "end", marginTop: "15px" }}>
            <FooterModal
              btnCancelClass="btn-cancel mr-1"
              textCancel="Cancelar"
              handleCancel={handleCloseModal}
              btnSubmitClass={"btn-accept"}
              textSubmit={"Guardar"}
              handleSubmit={handleSubmitPay}
              disabledBtn={disabledButton}
            />
          </Row>
        </Form>
      </Modal>
      <CustomModalConfirm
        open={openConfirmModal}
        handleClose={handleCloseModalConfirm}
        onSuccessHandle={AcceptConfirmForce}
        textConfirm="¿El monto de pago es mayor al adeudo, quiere que el monto mayor se vaya a pagos futuros?"
      />
    </>
  );
}
