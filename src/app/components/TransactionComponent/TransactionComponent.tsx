"use client";

import { MouseEvent, ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./TransactionComponent.module.css";
import CurrencyInput from "../common/currencyInput/CurruncyInput";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/reducer";
import { modalOpen } from "@/lib/actions/modalActions";
import Modal from "../common/modal/Modal";
import { SELECT_BANK } from "@/utils/data/selectBank";
import { BUTTON_TYPES } from "@/utils/data/buttonTypes";

interface AccountProps {
  account: string;
  balance: string;
}
interface TargetInfoProps {
  receiver: string;
  account: string;
  bank: string;
  transferAmount: string;
  transferStatus: number | null;
}

export default function TransActionComponent() {
  const router = useRouter();
  const dispatch = useDispatch();

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
    transferStatus: null,
  });
  const [purpose, setPurpose] = useState<string>();

  useEffect(() => {
    dispatch(modalOpen({ title: "최초 거래입니다. 확인 후 송금 진행바랍니다." }));
  }, [targetInfo.transferStatus]);

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

  const modalState = useSelector((state: RootState) => state.modal.isOpen);

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
      const response = await axios.post("/api/transaction", { action: "transfer", targetInfo, money, purpose });
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

      {/* 송금 받을 사람 계좌 입력 */}
      <div className={styles.receiverWrapper}>
        <header className={styles.receiverSubtitle}>누구에게 보낼까요?</header>
        <div className={styles.receiverInfo}>
          <select
            value={selected}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelected(e.target.value)}
            required
          >
            {SELECT_BANK.map(item => (
              <option key={item.value} value={item.value}>
                {item.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            className={styles.receiverAccountInput}
            value={inputAccount}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setInputAccount(e.target.value)}
            placeholder="계좌번호를 입력하세요"
          />
          <button
            className={styles.submitBtn}
            onClick={() => {
              handleButtonClick();
            }}
            disabled={!inputAccount || !selected}
          >
            다음
          </button>
          {modalState && targetInfo.transferStatus == 0 && <Modal />}
          {targetInfo.receiver && (
            <p className={targetInfo.transferStatus == 0 ? styles.warningStatus : styles.informStatus}>
              {targetInfo.transferStatus}번째 거래 입니다.
            </p>
          )}
          {targetInfo.transferStatus == 0 && <Modal />}
        </div>
        {message && <p>{message}</p>}
      </div>

      {/* 보낼 금액 및 목적 */}
      {targetInfo.receiver && (
        <div className={styles.targetWrapper}>
          <div className={styles.targetAccountInfo}>
            <span className={styles.targetReceiver}>{targetInfo.receiver}님</span>
            <span className={styles.targetAccountBank}>
              {targetInfo.bank} {targetInfo.account}
            </span>
          </div>

          <div className={styles.targetDatas}>
            <div className={styles.targetMoney}>
              <span className={styles.targetAmount}>얼마를 보내시겠습니까?</span>
              <CurrencyInput value={money} setMoney={setMoney} />
            </div>
            <div className={styles.targetPurpose}>
              <span className={styles.purposeTitle}>송금 목적을 선택해주세요</span>
              <div className={styles.choosePurpose}>
                {BUTTON_TYPES.map((btn, idx) => (
                  <button
                    key={`${idx}_${btn}`}
                    className={styles.purposeBtn}
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      console.log(e);
                      const { innerText } = e.target as HTMLButtonElement;
                      setPurpose(innerText);
                    }}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.chooseBtnWrapper}>
            {overBalanceMsg && <p className={styles.warningStatus}>{overBalanceMsg}</p>}
            <button
              className={styles.chooseBtn}
              onClick={handleClickTransfer}
              disabled={overBalanceMsg != "" || !money || !purpose}
            >
              송금하기
            </button>
            <button className={styles.chooseBtn} onClick={() => router.push("/main")}>
              송금 취소
            </button>
          </div>
        </div>
      )}

      {/* 송금 결과 확인 창 */}
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
