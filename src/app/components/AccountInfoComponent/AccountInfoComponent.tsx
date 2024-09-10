"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoIosAddCircle } from "react-icons/io";
import styles from "./AccountInfoComponent.module.css";
import axios from "axios";

export default function AccountInfoComponent() {
  const [account, setAccount] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/accountInfo");
        if (response.status == 200) {
          const { accountInfo } = response.data;
          setAccount(accountInfo.account);
          setBalance(accountInfo.balance);
        }
      } catch (err: any) {
        console.log(err);
        setMessage(err?.response.data.message);
      }
    };

    fetchData();
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
          {message && <span>{message}</span>}
        </section>
      )}
    </>
  );
}
