import CustomTableAmortization from "@/components/CustomTableAmortization";
import { GenerateTableAmortization } from "@/utils/AmortizationUtils";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import "./index.scss";

export const ModalTableAmortization = ({ open, handleClose, contract }) => {
  const {
    startDate,
    amount,
    period,
    numberPeriod: periodNum,
    interestRate,
    interest,
    typeAmortization,
  } = contract ?? {};
  const [dataAmortization, setDataAmortization] = useState([]);

  useEffect(() => {
    setDataAmortization(
      GenerateTableAmortization(
        {
          startDate,
          amount,
          period,
          periodNum,
          interestRate,
          interest,
        },
        typeAmortization
      )
    );
  }, [contract]);
  const handleCloseModal = () => {
    handleClose?.();
  };
  return (
    <Modal
      className="modal-table-amortization"
      open={open}
      onCancel={handleCloseModal}
      closable
      width={650}
      footer={null}
    >
      <div className="title">Tabla de amortizacion</div>
      <CustomTableAmortization
        className="general-style-table"
        dataBody={dataAmortization}
      />
    </Modal>
  );
};

export default ModalTableAmortization;
