"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./TransactionComponent.module.css";
import CurrencyInput from "../common/currencyInput/CurruncyInput";
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
  transferStatus: number;
}

export default function TransActionComponent() {
  const router = useRouter();

  const [accountInfo, setAccountInfo] = useState<AccountProps | undefined>();
  const [inputAccount, setInputAccount] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [selected, setSelected] = useState<string>();
  const [money, setMoney] = useState<string>();
  const [transferRst, setTransferRst] = useState<boolean>(false);
  const [overBalanceMsg, setOverBalanceMsg] = useState<string>();
  const [targetInfo, setTargetInfo] = useState<TargetInfoProps>({
    receiver: "",
    account: "",
    bank: "",
    transferAmount: "",
    transferStatus: 0,
  });

  // ! dispatch로 accountInfo 갱신 필요
  useEffect(() => {
    const storageItem = localStorage.getItem("accountInfo");
    if (storageItem) {
      setAccountInfo(JSON.parse(storageItem));
    }

    // !  금액 합당시 비활성화 해제 & 빨간버튼
    const needBalance = Number(money?.replaceAll(",", ""));
    const realBalance = Number(accountInfo?.balance.replaceAll(",", ""));
    if (needBalance > realBalance) {
      console.log(needBalance);
      setOverBalanceMsg(`잔액이 부족합니다. 보낼 수 있는 금액은 ${realBalance.toLocaleString("ko-KR")}원 입니다.`);
    } else {
      setOverBalanceMsg("");
    }
  }, [money]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputAccount(e.target.value);
  };

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
  };
  const handleButtonClick = async () => {
    try {
      const extractAccount = inputAccount?.replaceAll("-", "");
      const response = await axios.post("/api/transaction", { extractAccount, selected, action: "checkAccount" });
      if (response.status == 200) {
        const { targetUser, targetAccount, targetBank, targetAmount, targetStatus } = response.data;
        setTargetInfo({
          ...targetInfo,
          receiver: targetUser,
          account: targetAccount,
          bank: targetBank,
          transferAmount: targetAmount,
          transferStatus: targetStatus,
        });
      }
    } catch (err: any) {
      if (err.response) {
        setMessage(err.response.data.message);
      }
    }
  };

  const handleClickTransfer = async () => {
    try {
      const response = await axios.post("/api/transaction", { action: "transfer", targetInfo, money });
      if (response.status == 200) {
        const { account, balance } = response.data.responseData;
        localStorage.setItem("accountInfo", JSON.stringify({ account: account, balance: balance }));
        setAccountInfo({ account: account, balance: balance });
        setTransferRst(true);
      }
    } catch (err) {
      return err;
    }
  };

  const handleClickToMain = () => {
    router.push("/main");
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
    <section className={styles.transactionContainer}>
      <div className={styles.transactionInfoWrapper}>
        <header>
          <h3 className={styles.transactionTitle}>Transaction</h3>
        </header>
        <div className={styles.myAccountInfo}>
          <div className={styles.myAccountNumber}>
            <span className={styles.myAccountSubtitle}>YOUR ACCOUNT</span>{" "}
            <span className={styles.myAccountSubcontent}>{accountInfo?.account}</span>
          </div>
          <div className={styles.myAccountBalance}>
            <span className={styles.myAccountSubtitle}>YOUR BALANCE</span>{" "}
            <span className={styles.myAccountSubcontent}>{accountInfo?.balance}</span>
          </div>
        </div>
      </div>
      <div className={styles.receiverWrapper}>
        <header className={styles.receiverSubtitle}>누구에게 보낼까요?</header>
        <div className={styles.receiverInfo}>
          <select value={selected} onChange={handleSelect} required>
            {selectList.map(item => (
              <option key={item.value} value={item.value}>
                {item.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            className={styles.receiverAccountInput}
            value={inputAccount}
            onChange={handleChange}
            placeholder="계좌번호를 입력하세요"
          />
          <button className={styles.submitBtn} onClick={handleButtonClick} disabled={!inputAccount || !selected}>
            다음
          </button>
          {targetInfo.receiver && (
            <p className={targetInfo.transferStatus == 0 ? styles.warningStatus : styles.informStatus}>
              {targetInfo.transferStatus}번째 거래 입니다.
            </p>
          )}
        </div>
        {message && <p>{message}</p>}
      </div>
      {targetInfo.receiver && (
        <div className={styles.targetWrapper}>
          <div className={styles.targetAccountInfo}>
            <span className={styles.targetReceiver}>{targetInfo.receiver}님</span>
            <span className={styles.targetAccountBank}>
              {targetInfo.bank} {targetInfo.account}
            </span>
            <span className={styles.targetAmount}>얼마를 보내시겠습니까?</span>
          </div>
          <CurrencyInput value={money} setMoney={setMoney} />
          <div>
            {overBalanceMsg && <p className={styles.warningStatus}>{overBalanceMsg}</p>}
            <button
              className={styles.commonBtn}
              onClick={handleClickTransfer}
              disabled={overBalanceMsg != "" || !money}
            >
              송금하기
            </button>
            <button className={styles.commonBtn} onClick={handleClickToMain}>
              송금 취소
            </button>
          </div>
        </div>
      )}
      {transferRst && (
        <div className={styles.transferResultWrapper}>
          <p className={styles.transferResult}>
            {targetInfo.receiver}님께 {money}을 보냈습니다.
          </p>
        </div>
      )}
    </section>
  );
}
