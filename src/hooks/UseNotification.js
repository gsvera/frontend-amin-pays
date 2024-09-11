import {
  CheckOutlined,
  WarningOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { notification, Typography } from "antd";

const { Text } = Typography;

const defaultNotificationProps = {
  duration: 3,
  placement: "topRight",
  style: { borderRadius: "10px", width: "255px", zIndex: "999" },
  closeIcon: <CloseOutlined width="10" height="10" />,
};

const useNotification = () => {
  const openErrorNotification = (message = "Error") => {
    notification.error({
      ...defaultNotificationProps,
      message: <Text style={{ color: "white" }}>{message}</Text>,
      style: { color: "#ffff", backgroundColor: "#FF4D4D" },
      icon: <WarningOutlined style={{ color: "white" }} />,
    });
  };

  const openSuccessNotification = (message = "Exito") => {
    notification.success({
      ...defaultNotificationProps,
      message: <Text style={{ color: "white" }}>{message}</Text>,
      style: { color: "white", backgroundColor: "#02BF80" },
      icon: <CheckOutlined style={{ color: "white" }} />,
    });
  };

  const openInfoNotification = (message = "Info") => {
    notification.info({
      ...defaultNotificationProps,
      message: <Text style={{ color: "white" }}>{message}</Text>,
      style: { color: "white", backgroundColor: "#3867FC" },
      icon: <WarningOutlined style={{ color: "white" }} />,
    });
  };

  const destroyAllNotification = () => {
    notification.destroy();
  };

  const destroyNotification = (key) => {
    notification.destroy(key);
  };

  return {
    openErrorNotification,
    openSuccessNotification,
    destroyAllNotification,
    destroyNotification,
    openInfoNotification,
  };
};

export { useNotification };
