import Button from "@/components/Button";
import { Col, Row } from "antd";

export const FooterModal = ({
  handleCancel,
  handleSubmit,
  btnSubmitClass,
  textSubmit,
  btnCancelClass,
  textCancel,
}) => {
  const btnHandleCancel = () => {
    handleCancel?.();
  };

  const btnHandleSubmit = () => {
    handleSubmit?.();
  };
  return (
    <Row>
      <Col span={12}>
        <Button
          onClick={btnHandleCancel}
          className={btnCancelClass}
          text={textCancel}
        />
      </Col>
      <Col span={12}>
        <Button
          className={btnSubmitClass}
          onClick={btnHandleSubmit}
          text={textSubmit}
        />
      </Col>
    </Row>
  );
};

export default FooterModal;
