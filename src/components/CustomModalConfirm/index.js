import { Modal } from "antd";
import Button from "@/components/Button";
import "./index.scss";

export const CustomModalConfirm = ({
  open,
  handleClose,
  onSuccessHandle,
  textConfirm,
  buttonAccept = "Aceptar",
  buttonCancel = "Cancelar",
}) => {
  const handleSuccesAction = () => {
    onSuccessHandle?.();
  };

  const handleCancelAction = () => {
    handleClose?.();
  };
  return (
    <Modal
      className="custom-modal-confirm"
      open={open}
      footer={null}
      onCancel={handleCancelAction}
    >
      <div className="text-confirm">{textConfirm}</div>
      <div className="modal-confirm-buttons">
        <Button
          className="btn-cancel-confirm-modal"
          text={buttonCancel}
          onClick={handleCancelAction}
        />
        <Button
          className="btn-accept-confirm-modal"
          text={buttonAccept}
          onClick={handleSuccesAction}
        />
      </div>
    </Modal>
  );
};

export default CustomModalConfirm;
