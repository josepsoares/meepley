import React from "react";

import { Modal } from "native-base";

import Loading from "./Loading";

const LoadingModal: React.FC<{ condition: boolean; message?: string }> = ({
  condition,
  message,
}) => {
  return (
    <Modal
      isOpen={condition}
      closeOnOverlayClick={false}
      isKeyboardDismissable={false}
      size="lg"
    >
      <Modal.Content bgColor="white">
        <Modal.Body py="10" bgColor="white">
          {message ? <Loading customMessage={message} /> : <Loading />}
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default LoadingModal;
