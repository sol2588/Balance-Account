"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import CurrencyInput from "../common/currencyInput/CurruncyInput";
import styles from "./ChargeComponent.module.css";
import axios from "axios";
import { setAccountCharge } from "@/lib/actions/accountActions";

interface setFunction {
  setMoney: React.Dispatch<React.SetStateAction<string>>;
}

// ! 계좌 생선 전인 경우 접근 못하도록 예외처리
export default function ChargeComponent() {
  const [account, setAccount] = useState<string>("");
  const [balance, setBalance] = useState<string>();
  const [confirmCharge, setConfirmCharge] = useState<string>("");
  const [chargeAmount, setChargeAmount] = useState<string>();
  const [chargeMessage, setChargeMessage] = useState<string>("");
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    // 모든 사용자는 로그인 후 메인페이지(overview로 이동 : account 정보를 db로부터 받아옴)
    const persistData = sessionStorage.getItem("persist:root");
    const accountInfo = persistData ? JSON.parse(JSON.parse(persistData).account) : null;
    setAccount(accountInfo.account);
    setBalance(accountInfo.balance);
  }, []);

  const handleClickCharge = async () => {
    try {
      const response = await axios.post("/api/charge", { chargeAmount });

      if (response.status == 200) {
        const { updateBalance } = response.data;
        dispatch(setAccountCharge(updateBalance));
        setBalance(updateBalance);
        setConfirmCharge(response.data.chargeAmount);
        setChargeMessage(response.data.message);
        setChargeAmount("");
      } else {
        setChargeMessage("충전에 실패했습니다. 다시 시도해주세요");
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
    <section className={styles.chargeContainer}>
      <div className={styles.chargeInfoWrapper}>
        <header>
          <h3 className={styles.chargeInfoTitle}>Charge</h3>
        </header>
        <div className={styles.chargeInfo}>
          <div className={styles.chargeAccount}>
            <span className={styles.chargeAccountSubtitle}>YOUR ACCOUNT</span>{" "}
            <span className={styles.chargeAccountSubcontent}>{account}</span>
          </div>
          <div className={styles.chargeBalance}>
            <span className={styles.chargeBalanceSubtitle}>YOUR BALANCE</span>{" "}
            <span className={styles.chargeAccountSubcontent}>{balance}</span>
          </div>
        </div>
      </div>
      <div className={styles.chargeDataWrapper}>
        <CurrencyInput value={chargeAmount} setMoney={setChargeAmount} setMessage={setChargeMessage} title="충전" />
        <div>
          <button type="button" className={styles.chargeBtn} onClick={handleClickCharge} disabled={!chargeAmount}>
            충전하기
          </button>
          <button type="button" className={styles.mainBtn} onClick={handleClickToMain}>
            메인 페이지가기
          </button>
        </div>
      </div>
      {chargeMessage && (
        <div className={styles.chargeResult}>
          <span className={styles.chargeResultTitle}>충전결과</span>
          <span className={styles.chargeResultDesc}>
            {confirmCharge}원 {chargeMessage}
          </span>
          <span className={styles.chargeTotalAmount}>충전 후 금액은 {balance}원 입니다.</span>
        </div>
      )}
    </section>
  );
}
