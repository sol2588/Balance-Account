"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "./ChargeComponent.module.css";
import CurrencyInput from "../common/CurruncyInput";

interface setFunction {
  setMoney: React.Dispatch<React.SetStateAction<string>>;
}

// ! 계좌 생선 전인 경우 접근 못하도록 예외처리
export default function ChargeComponent() {
  const [account, setAccount] = useState<string>("");
  const [balance, setBalance] = useState<string>();
  const [chargeAmount, setChargeAmount] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    const accountInfo = localStorage.getItem("accountInfo");
    setAccount(accountInfo ? JSON.parse(accountInfo).account : "");
    setBalance(accountInfo ? JSON.parse(accountInfo).balance : "");
  }, []);

  // ! chargeAmount가 0이면 충전하기 버튼 비활성화
  const handleClickCharge = async () => {
    console.log(chargeAmount);
    try {
      const response = await axios.post("/api/charge", { chargeAmount });

      if (response.status == 200) {
        const { updateBalance } = response.data;
        setBalance(updateBalance);
        let storageItems = JSON.parse(localStorage.getItem("accountInfo") || "{}");
        storageItems = { ...storageItems, balance: updateBalance.toLocaleString("ko-KR") };
        localStorage.setItem("accountInfo", JSON.stringify(storageItems));
        setChargeAmount("");
      } else {
        console.log("충전이 실패했슴니다.");
      }
    } catch (err) {
      alert("충전 중 오류가 발생했습니다. 다시 시도해주세요.");
      return err;
    }
  };

  const handleClickToMain = () => {
    router.push("/main");
  };

  return (
    <section className={styles.myAccount}>
      <div className={styles.accountWrapper}>
        <h3>
          <span>내 계좌</span> <span>{account}</span>
        </h3>
        <span>잔액</span> <span>{balance}</span>
      </div>
      <div className={styles.chargeWrapper}>
        <CurrencyInput value={chargeAmount} setMoney={setChargeAmount} />
        <div>
          <button onClick={handleClickCharge}>충전하기</button>
          <button onClick={handleClickToMain}>메인 페이지로 돌아가기</button>
        </div>
      </div>
    </section>
  );
}
