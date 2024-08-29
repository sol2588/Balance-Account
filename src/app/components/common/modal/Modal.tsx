"use client";
import { useState } from "react";
import styles from "./Modal.module.css";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/reducer";
import { modalClose } from "@/lib/actions/modalActions";

export default function Modal() {
  const { isOpen, title } = useSelector((state: RootState) => state.modal);

  const dispatch = useDispatch();

  const handleModalClose = () => {
    dispatch(modalClose());
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalWrapper}>
      <div className={styles.modalBody}>
        <p className={styles.modalTitle}>{title}</p>
        <div className={styles.modalButtonWrapper} role="group">
          <button className={styles.chkBtn} onClick={handleModalClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
