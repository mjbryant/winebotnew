import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styles from "@/styles/Modal.module.css";

type ModalProps = {
  containerId: string;
  show: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

const Modal = ({ containerId, show, onClose, onSubmit }: ModalProps) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const content = show ? (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div>
          Are you sure?
          <button onClick={() => onSubmit()}>Okay</button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : null;

  if (isBrowser) {
    const modalContainer = document.getElementById(containerId);
    if (modalContainer) {
      return ReactDOM.createPortal(content, modalContainer);
    } else {
      throw new Error(`No #${containerId} element in which to mount the modal`);
    }
  } else {
    return null;
  }
};

export default Modal;
