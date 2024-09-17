"use client";

import { MouseEvent, ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { setAccountCharge } from "@/lib/actions/accountActions";
import { modalOpen } from "@/lib/actions/modalActions";
import { RootState } from "@/lib/reducer";
import { SELECT_BANK } from "@/utils/data/selectBank";
import { BUTTON_TYPES } from "@/utils/data/buttonTypes";
import CurrencyInput from "../common/currencyInput/CurruncyInput";
import Modal from "../common/modal/Modal";
import styles from "./TransactionComponent.module.css";
import axios from "axios";

interface AccountProps {
  account: string | null;
  balance: string | null;
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
  const modalState = useSelector((state: RootState) => state.modal.isOpen);
  const accountState = useSelector((state: RootState) => state.account);

  // ! transaction 새로고침하면 login 풀리는 현상 있음 + authCheck확인
  // const [accountInfo, setAccountInfo] = useState<AccountProps>({account: accountState.account, balance: accountState.balance});
  const [bankSelected, setBankSelected] = useState<string>("");
  const [receiverAccount, setReceiverAccount] = useState<string>("");
  const [receiverData, setReceiverData] = useState<TargetInfoProps>({
    receiver: "",
    account: "",
    bank: "",
    transferAmount: "",
    transferStatus: null,
  });
  const [money, setMoney] = useState<string>();
  const [purpose, setPurpose] = useState<string>();
  const [accountMessage, setAccountMessage] = useState<string>();
  const [confirmMessage, setConfirmMessage] = useState<string>();
  const [notAllowedMessage, setNotAllowedMessage] = useState<string>();
  const [transferResult, setTransferResult] = useState<string>("");

  // 계좌 정보 저장(redux)
  const accountInfo = { account: accountState.account, balance: accountState.balance };

  useEffect(() => {
    const requiredAmount = Number(money?.replaceAll(",", ""));
    const currentBalance = Number(accountInfo?.balance?.replaceAll(",", ""));
    if (requiredAmount > currentBalance) {
      setNotAllowedMessage(
        `잔액이 부족합니다. 보낼 수 있는 금액은 ${currentBalance.toLocaleString("ko-KR")}원 입니다.`,
      );
    } else {
      setNotAllowedMessage("");
    }
  }, [money]);

  const handleReceiverAccount = async () => {
    try {
      const extractAccount = receiverAccount?.replaceAll("-", "");
      const response = await axios.post("/api/transaction", {
        extractAccount,
        bankSelected,
        action: "checkAccount",
      });
      if (response.status == 200) {
        const { targetUser, targetAccount, targetBank, targetAmount, targetStatus, message } = response.data;
        setReceiverData({
          ...receiverData,
          receiver: targetUser,
          account: targetAccount,
          bank: targetBank,
          transferAmount: targetAmount,
          transferStatus: targetStatus,
        });
        setConfirmMessage(`${targetStatus}번째 거래입니다.`);

        if (targetStatus == 0) {
          dispatch(modalOpen({ title: "첫번째 거래입니다. 한번 더 확인 후 송금하시기 바랍니다." }));
        }
      }
    } catch (err: any) {
      if (err.response) {
        setAccountMessage(err.response.data.message || "계좌 정보를 확인할 수 없습니다.");
      }
    }
  };

  const handleExecuteTransfer = async () => {
    try {
      const response = await axios.post("/api/transaction", { action: "transfer", receiverData, money, purpose });
      if (response.status == 200) {
        const { account, balance } = response.data.responseData;
        dispatch(setAccountCharge(balance));
        setTransferResult("success");
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
            value={bankSelected}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setBankSelected(e.target.value)}
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
            value={receiverAccount}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setAccountMessage("");
              setConfirmMessage("");
              setReceiverAccount(e.target.value);
            }}
            placeholder="계좌번호를 입력하세요"
          />
          <button
            type="button"
            className={styles.submitBtn}
            onClick={() => {
              handleReceiverAccount();
            }}
            disabled={!receiverAccount || !bankSelected}
          >
            다음
          </button>
          {modalState && receiverData.transferStatus == 0 && <Modal />}
          {confirmMessage && <p className={styles.informStatus}>{confirmMessage}</p>}
        </div>
        {accountMessage && <span className={styles.informMessage}>{accountMessage}</span>}
      </div>

      {/* 보낼 금액 및 목적 */}
      {receiverData.receiver && confirmMessage && (
        <div className={styles.targetWrapper}>
          <div className={styles.targetAccountInfo}>
            <span className={styles.targetReceiver}>{receiverData.receiver}님</span>
            <span className={styles.targetAccountBank}>
              {receiverData.bank} {receiverData.account}
            </span>
          </div>

          <div className={styles.targetDatas}>
            <div className={styles.targetMoney}>
              <span className={styles.targetAmount}>얼마를 보내시겠습니까?</span>
              <CurrencyInput value={money} setMoney={setMoney} setMessage={setTransferResult} title="송금" />
            </div>
            <div className={styles.targetPurpose}>
              <span className={styles.purposeTitle}>송금 목적을 선택해주세요</span>
              <div className={styles.choosePurpose}>
                {BUTTON_TYPES.map((btn, idx) => (
                  <button
                    key={`${idx}_${btn}`}
                    className={[styles.purposeBtn, purpose == btn ? styles.active : ""].join(" ")}
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      const { innerText } = e.target as HTMLButtonElement;
                      setPurpose(innerText);
                    }}
                  >
                    {btn}
                  </button>
                ))}
                <span className={styles.purposeContent}>송금 목적 : {purpose}</span>
              </div>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className={styles.chooseBtnWrapper}>
            {notAllowedMessage && <span className={styles.notAllowedStatus}>{notAllowedMessage}</span>}
            <button
              type="button"
              className={styles.chooseBtn}
              onClick={handleExecuteTransfer}
              disabled={notAllowedMessage != "" || !money || !purpose}
            >
              송금하기
            </button>
            <button type="button" className={styles.chooseBtn} onClick={() => router.push("/main")}>
              송금 취소
            </button>
          </div>
        </div>
      )}

      {/* 송금 결과 확인 창 */}
      {transferResult && (
        <div className={styles.transferResultWrapper}>
          <span className={styles.transferResult}>
            {receiverData.receiver}님께 {money}을 보냈습니다.
          </span>
          <span className={styles.transferResultBalance}>이체 후 잔액은 {accountInfo?.balance}원 입니다.</span>
        </div>
      )}
    </section>
  );
}
