import { Modal } from "antd";
import { useEffect, useState } from "react";
import "./index.scss";
import { makePdfBase64 } from "@/utils/GeneralUtils";

export const ModalViewFile = ({ open, file, handleClose }) => {
  const { fileData } = file ?? {};
  const [filePdf, setFilePdf] = useState();
  const [fileImage, setFileImage] = useState();

  useEffect(() => {
    if (fileData) {
      if (fileData.includes("application/pdf")) {
        const url = makePdfBase64(fileData);
        setFilePdf(url);
        return () => URL.revokeObjectURL(url);
      }
      setFileImage(fileData);
    }
  }, [fileData]);

  const handleCloseModal = () => {
    setFilePdf(null);
    setFileImage(null);
    handleClose?.();
  };
  return (
    <Modal
      open={open}
      onCancel={handleCloseModal}
      closable
      className={filePdf ? "modal-view-pdf" : "modal-view-img`"}
      footer={null}
    >
      {filePdf && (
        <iframe src={filePdf} style={{ width: "100%", height: "80vh" }} />
      )}
      {fileImage && (
        <img src={fileImage} style={{ width: "100%", height: "100%" }} />
      )}
    </Modal>
  );
};

export default ModalViewFile;
