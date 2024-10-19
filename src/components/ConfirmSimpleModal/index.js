import { Modal, Row, Typography } from "antd";
import { FooterModal } from "@/components/FormComponent/FooterModal";
import "./index.scss";

const { Text } = Typography;

export const ConfirmSimpleModal = (props) => {
  const { open, message, onSuccess, onCancel, classN, btnAcceptClassName } =
    props;

  const handleCloseModal = () => {
    onCancel?.();
  };

  const handleSuccess = () => {
    onSuccess?.();
  };
  return (
    <Modal
      open={open}
      closable={false}
      className={classN}
      footer={
        <FooterModal
          btnCancelClass="btn-cancel"
          textCancel="Cancelar"
          handleCancel={handleCloseModal}
          btnSubmitClass={
            btnAcceptClassName ? btnAcceptClassName : "btn-warning"
          }
          textSubmit="Aceptar"
          handleSubmit={handleSuccess}
        />
      }
    >
      <Row style={{ justifyContent: "center" }}>
        <Text>{message}</Text>
      </Row>
    </Modal>
  );
};

export default ConfirmSimpleModal;
