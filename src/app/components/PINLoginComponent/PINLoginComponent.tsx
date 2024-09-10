"use client";

import { useState, ChangeEvent, MouseEvent } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import styles from "./PINLoginComponent.module.css";
import clsx from "clsx";
import axios from "axios";
import { setLoginSuccess } from "@/lib/actions/userActions";

export default function PINComponent() {
  const dispatch = useDispatch();
  const [userId, setUserId] = useState<string>("");
  const [pinPw, setPinPw] = useState<string>("");
  const router = useRouter();
  const [message, setMessage] = useState<string>("");

  const buttonArr: number[] = [1, 2, 3, 4, 5, 6];
  const keyArr: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const needFocus = pinPw ? pinPw.length + 1 : 1;

  const buttonPwClick = (e: MouseEvent<HTMLButtonElement>) => {
    const { value } = e.target as HTMLButtonElement;
    if (pinPw.length < 6) {
      setPinPw(prev => prev + value);
    }
  };

  const deletePw = () => {
    if (pinPw) {
      setPinPw(prev => prev.slice(0, -1));
    }
  };

  const submitButton = async () => {
    try {
      const response = await axios.post("/api/pin/login", { userId, pinPw });
      if (response.status == 200) {
        dispatch(setLoginSuccess({ id: userId, token: response.data.token, name: response.data.name }));
        setMessage(response.data.message);
        router.push("/main");
      }
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Unknown error");
      console.log(err.response?.data?.message);
    }
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };

  return (
    <section className={styles.pinContainer}>
      <header>
        <h4 className={styles.pinTitle}>간편 로그인</h4>
      </header>
      <div className={styles.pinContents}>
        <label htmlFor="userId" className={styles.pinLabel}>
          UserId를 입력하세요
        </label>
        <input className={styles.pinInput} type="text" id="userId" value={userId} onChange={handleInput} />
        <ul className={styles.pinList}>
          {buttonArr.map(item => (
            <li key={item} className={clsx(styles.pinItem, needFocus == item || needFocus == 7 ? styles.active : "")}>
              {pinPw?.length >= item ? "*" : ""}
            </li>
          ))}
        </ul>
        <div className={styles.pinKeypad}>
          {keyArr.map(keynum => (
            <button key={keynum} className={styles.pinKey} value={keynum} data-value={keynum} onClick={buttonPwClick}>
              {keynum}
            </button>
          ))}
          <button className={styles.deleteBtn} onClick={deletePw}>
            지우기
          </button>
        </div>
        {message && <span>{message}</span>}
        <div>
          <button
            className={styles.confirmBtn}
            type="button"
            onClick={submitButton}
            disabled={pinPw?.length != 6 || !userId}
          >
            확인
          </button>
        </div>
      </div>
    </section>
  );
}
