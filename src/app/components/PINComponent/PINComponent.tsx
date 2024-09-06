"use client";
import { useState, useEffect, ChangeEvent, MouseEvent } from "react";
import styles from "./PINComponent.module.css";
import clsx from "clsx";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function PINComponent() {
  const [pinPw, setPinPw] = useState<string>("");
  const router = useRouter();
  const [message, setMessage] = useState<string>("");

  const buttonArr: number[] = [1, 2, 3, 4, 5, 6];
  const keyArr: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const needFocus = pinPw ? pinPw.length + 1 : 1;

  const buttonClick = (e: MouseEvent<HTMLButtonElement>) => {
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
    const response = await axios.post("/api/pin/login", { pinPw });
    if (response.status == 200) {
      try {
        console.log(response.data.message);
        // router.push("/main");
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <section className={styles.pinContainer}>
      <header>
        <h4 className={styles.pinTitle}>간편 로그인</h4>
      </header>
      <div className={styles.pinContents}>
        <div className={styles.pinList}>
          {buttonArr.map(item => (
            <div key={item} className={clsx(styles.pinItem, needFocus == item || needFocus == 7 ? styles.active : "")}>
              {pinPw?.length >= item ? "*" : ""}
            </div>
          ))}
        </div>
        <div className={styles.pinKeypad}>
          {keyArr.map(keynum => (
            <button key={keynum} className={styles.pinKey} value={keynum} data-value={keynum} onClick={buttonClick}>
              {keynum}
            </button>
          ))}
          <button className={styles.deleteBtn} onClick={deletePw}>
            지우기
          </button>
        </div>
        <button onClick={submitButton} className={styles.confirmBtn} disabled={pinPw?.length != 6}>
          확인
        </button>
      </div>
    </section>
  );
}
