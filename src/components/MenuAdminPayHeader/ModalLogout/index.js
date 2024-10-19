import { Modal, Typography, Row } from "antd";
import apiUser from "@/api/services/apiUser";
import { useMutation } from "@tanstack/react-query";
import { useNotification } from "@/hooks/UseNotification";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setToken, setDataUser } from "@/store-redux/slide/userSlide";
import { FooterModal } from "@/components/FormComponent/FooterModal";
import "./index.scss";

const { Text } = Typography;

export default function ModalLogout({ open, handleClose }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { openErrorNotification } = useNotification();

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      const response = await apiUser.logout();
      return response.data;
    },
    onSuccess: (data) => {
      if (!data?.error) {
        dispatch(setToken(null));
        dispatch(setDataUser(null));
        router.push("/login");
      }
    },
    onError: (error) => {
      openErrorNotification(t("general_message.error_system"));
    },
  });

  const handleCancel = () => {
    handleClose?.(false);
  };

  const handleLogout = () => {
    logout();
    handleClose?.(false);
  };

  return (
    <Modal
      open={open}
      closable={false}
      className="modal-logout"
      footer={
        <FooterModal
          btnCancelClass="btn-cancel"
          textCancel="Cancelar"
          handleCancel={handleCancel}
          btnSubmitClass="btn-accept"
          textSubmit="Aceptar"
          handleSubmit={handleLogout}
        />
      }
    >
      <Row style={{ justifyContent: "center" }}>
        <Text style={{ fontWeight: "600" }}>
          ¿Estás seguro ded finaliza la sessión?
        </Text>
      </Row>
    </Modal>
  );
}
