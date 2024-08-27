"use client";

import { ChangeEvent, useEffect, useState } from "react";
import styles from "./TransActionComponent.module.css";
import CurrencyInput from "@/app/components/common/CurruncyInput";
import axios from "axios";

interface AccountProps {
  account: string;
  balance: string;
}
interface TargetInfoProps {
  receiver: string;
  account: string;
  bank: string;
  transferAmount: string;
}

export default function TransActionComponent() {
  const [accountInfo, setAccountInfo] = useState<AccountProps | undefined>();
  const [inputAccount, setInputAccount] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [selected, setSelected] = useState<string>();
  const [money, setMoney] = useState<string>();
  const [inputCurrency, setInputCurrency] = useState<string>();
  const [targetInfo, setTargetInfo] = useState<TargetInfoProps>({
    receiver: "",
    account: "",
    bank: "",
    transferAmount: "",
  });

  useEffect(() => {
    const storageItem = localStorage.getItem("accountInfo");
    if (storageItem) {
      setAccountInfo(JSON.parse(storageItem));
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputAccount(e.target.value);
  };

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
  };
  const handleButtonClick = async () => {
    try {
      const response = await axios.post("/api/transaction", { inputAccount, selected });
      if (response.status == 200) {
        const { targetUser, targetAccount, targetBank, targetAmount } = response.data;
        setTargetInfo({
          ...targetInfo,
          receiver: targetUser,
          account: targetAccount,
          bank: targetBank,
          transferAmount: targetAmount,
        });
      } else {
        console.log("Error");
      }
    } catch (err) {
      console.log("Error ", err);
    }
  };

  const selectList = [
    { value: "none", name: "===선택===" },
    { value: "국민", name: "국민은행" },
    { value: "농협", name: "농협은행" },
    { value: "신한", name: "신한은행" },
    { value: "우리", name: "우리은행" },
    { value: "카카오", name: "카카오뱅크" },
  ];

  return (
    <section className={styles.accountDetailsContainer}>
      <div className={styles.myAccountInfoWrapper}>
        <h3>
          <span>내 계좌</span> <span>{accountInfo?.account}</span>
        </h3>
        <span>잔액</span> <span>{accountInfo?.balance}</span>
      </div>
      <div className={styles.recipientAccountInfo}>
        <h4>누구에게 보낼까요?</h4>
        <div>
          <select value={selected} onChange={handleSelect} required>
            {selectList.map(item => (
              <option key={item.value} value={item.value}>
                {item.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            className={styles.accountInput}
            value={inputAccount}
            onChange={handleChange}
            placeholder="계좌번호를 입력하세요"
          />
          <button onClick={handleButtonClick} disabled={!inputAccount || !selected}>
            다음
          </button>
        </div>
        {message && <p>{message}</p>}
      </div>
      {targetInfo.receiver && (
        <div className={styles.receiverInfoWrapper}>
          <div className={styles.target}>
            <span>{targetInfo.receiver}님께</span> <span>{targetInfo.account}</span> <span>{targetInfo.bank}</span>
          </div>
          <CurrencyInput value={inputCurrency} setMoney={setMoney} />
        </div>
      )}
    </section>
  );
}
