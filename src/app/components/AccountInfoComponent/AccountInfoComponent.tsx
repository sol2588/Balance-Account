"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoIosAddCircle } from "react-icons/io";
import styles from "./AccountInfoComponent.module.css";

export default function AccountInfoComponent() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState();
  const router = useRouter();

  useEffect(() => {
    const accountInfo = sessionStorage.getItem("accountInfo");
    setAccount(accountInfo ? JSON.parse(accountInfo).account : "");
    setBalance(accountInfo ? JSON.parse(accountInfo).balance : "");
  }, []);

  return (
    <>
      {account ? (
        <section className={styles.makeAccountMenu}>
          <div className={styles.overviewContents}>
            <div className={styles.overviewAccountInfo}>
              <span className={styles.subTitle}>YOUR ACCOUNT</span>
              <span className={styles.subContent}>{account}</span>
              <span className={styles.subTitle}>YOUR BALANCE</span>
              <span className={styles.subContent}>{balance}</span>
            </div>
            <div role="group" className={styles.buttonWrapper}>
              <button className={styles.btn} onClick={() => router.push("/transaction")}>
                이체
              </button>
              <button className={styles.btn} onClick={() => router.push("/charge")}>
                충전
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className={styles.makeAccountMenu}>
          <header>
            <h3 className={styles.createTitle}>Create Account</h3>
          </header>
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
