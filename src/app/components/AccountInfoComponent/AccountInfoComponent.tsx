"use client";
import { useState, useEffect } from "react";
import { IoIosAddCircle } from "react-icons/io";
import styles from "./AccountInfoComponent.module.css";
import { useRouter } from "next/navigation";

export default function AccountInfoComponent() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState();
  const router = useRouter();

  useEffect(() => {
    const accountInfo = localStorage.getItem("accountInfo");
    setAccount(accountInfo ? JSON.parse(accountInfo).account : "");
    setBalance(accountInfo ? JSON.parse(accountInfo).balance : "");
  }, []);

  return (
    <>
      {account ? (
        <section className={styles.makeAccountMenu}>
          <div>
            <h3>
              <span>내 계좌</span> <span>{account}</span>
            </h3>
            <span>잔액</span> <span>{balance}</span>
            <div role="group" className={styles.buttonWrapper}>
              <button onClick={() => router.push("/transaction")}>이체</button>
              <button onClick={() => router.push("/charge")}>충전</button>
            </div>
          </div>
        </section>
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
