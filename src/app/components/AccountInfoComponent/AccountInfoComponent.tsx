"use client";
import { useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import styles from "./AccountInfoComponent.module.css";

export default function AccountInfoComponent() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState(0);

  return (
    <>
      {account ? (
        <section className={styles.makeAccountMenu}></section>
      ) : (
        <section className={styles.makeAccountMenu}>
          <h3 className={styles.title}>
            <a className={styles.accountLink} href="/createAccount">
              계좌생성하기
            </a>
          </h3>
          <a href="/createAccount">
            <IoIosAddCircle className={styles.accountButton} />
          </a>
        </section>
      )}
    </>
  );
}
