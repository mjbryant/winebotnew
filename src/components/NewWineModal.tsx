import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styles from "@/styles/Modal.module.css";

type ModalProps = {
  containerId: string;
  show: boolean;
  onClose: () => void;
  onSubmit: (name: string, subname: string) => void;
};

const Modal = ({ containerId, show, onClose, onSubmit }: ModalProps) => {
  const [isBrowser, setIsBrowser] = useState(false);
  const [name, setName] = useState("");
  const [subname, setSubname] = useState("");

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const content = show ? (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.newWineLabel}>Add a new wine</div>
          <div className={styles.newWineInput}>
            <div>
              <label htmlFor="name-input">Name</label>
              <input
                id="name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="subname-input">Subname</label>
              <input
                id="subname-input"
                type="text"
                value={subname}
                onChange={(e) => setSubname(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.newWineButtons}>
            <button onClick={() => onSubmit(name, subname)}>Okay</button>
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
