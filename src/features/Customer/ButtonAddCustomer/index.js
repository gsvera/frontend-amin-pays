import Button from "@/components/Button";
import FormCustomer from "../FormCustomer";
import { UserAddOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

export const ButtonAddCustomer = ({
  handleCloseModal,
  entityToEdit,
  openEdit = false,
  persistCustomer,
}) => {
  const [openModal, setOpenModal] = useState(false);

  const closeModal = () => {
    setOpenModal(false);
    handleCloseModal?.();
  };

  useEffect(() => {
    openEdit && setOpenModal(true);
  }, [openEdit]);

  return (
    <>
      <Button
        text={
          <div className="btn-center-child">
            <UserAddOutlined
              className="icon-size-17"
              style={{ marginRight: "5px" }}
            />{" "}
            Agregar Cliente
          </div>
        }
        className="btn-add"
        style={{ width: "150px" }}
        onClick={(e) => setOpenModal(true)}
      />
      <FormCustomer
        open={openModal}
        closeModal={closeModal}
        entityToEdit={entityToEdit}
        persistCustomer={persistCustomer}
      />
    </>
  );
};

export default ButtonAddCustomer;
