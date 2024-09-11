"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { makeAccountSuccess } from "@/lib/actions/accountActions";
import { RootState } from "@/lib/reducer";
import { LiaUserFriendsSolid, LiaPiggyBankSolid } from "react-icons/lia";
import { GiReceiveMoney } from "react-icons/gi";
import styles from "./CreateAccountComponent.module.css";
import axios from "axios";

export default function CreateAccountComponent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");

  const create = useSelector((state: RootState) => state.account.created);
  const handleButton = async () => {
    try {
      const response = await axios.get("/api/createAccount");
      if (response.status == 200) {
        const accountData = {
          account: response.data.account,
          balance: response.data.balance,
        };
        setMessage(response.data.message);
        dispatch(makeAccountSuccess(accountData));
      }
    } catch (err: any) {
      if (err.response.data.message === "Account has already created") {
        setMessage("계좌가 이미 존재합니다. 메인페이지로 이동해주세요");
      } else {
        setMessage("계좌생성 중 문제가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <section className={styles.createContainer}>
      <header>
        <h3 className={styles.title}>Create Account</h3>
      </header>
      <ul className={styles.featList}>
        <li className={styles.featItem}>
          <GiReceiveMoney className={styles.iconButton} />
          <span className={styles.itemDesc}>첫 사용자도 손쉬운 사용</span>
        </li>
        <li className={styles.featItem}>
          <LiaUserFriendsSolid className={styles.iconButton} />
          <span className={styles.itemDesc}>지인 추가로 빠른 송금</span>
        </li>
        <li className={styles.featItem}>
          <LiaPiggyBankSolid className={styles.iconButton} />
          <span className={styles.itemDesc}>저축도우미</span>
        </li>
      </ul>

      {message && <span className={styles.showMessage}>{message}</span>}
      {message ? (
        <button type="button" className={styles.button} onClick={() => router.push("/main")}>
          메인페이지로 가기
        </button>
      ) : (
        <button type="button" className={styles.button} onClick={handleButton}>
          사용해보기
        </button>
      )}
    </section>
  );
}
