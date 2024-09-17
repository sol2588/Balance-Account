"use client";

import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import styles from "./PINMakeComponent.module.css";
import axios from "axios";

export default function PINMakeComponent() {
  const [pin, setPin] = useState<string>("");
  const [pinCheck, setPinCheck] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showRst, setShowRst] = useState<string>("");

  useEffect(() => {
    if (pinCheck == "") {
      setMessage("");
    } else if (pin == pinCheck) {
      setMessage("PIN 번호가 일치합니다.");
    } else {
      setMessage("PIN 번호가 일치하지 않습니다.");
    }
  }, [pinCheck]);

  const handlerPin = (e: ChangeEvent<HTMLInputElement>) => {
    setPin(e.target.value);
  };
  const handlerPinCheck = (e: ChangeEvent<HTMLInputElement>) => {
    setPinCheck(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/pin/make", { pin });
      if (response.status == 200) {
        setShowRst(response.data.message);
      }
    } catch (err: unknown) {
      console.log(err);
    }
  };

  return (
    <section className={styles.pinMakeContainer}>
      <header>
        <h3 className={styles.pinMakeHeader}>PIN Password</h3>
      </header>

      <div className={styles.pinMakeContents}>
        <div className={styles.pinMakeDesc}>
          간편 비밀번호를 설정해주세요.
          <br />
          6자리 숫자로 로그인할 수 있어요.
        </div>

        <form className={styles.pinForm} action="/pin/make" method="post" onSubmit={handleSubmit}>
          <label htmlFor="pinPW">간편번호 입력</label>
          <input
            className={styles.pinInput}
            type="password"
            id="pinPw"
            value={pin}
            name="pin"
            maxLength={6}
            onChange={handlerPin}
          />
          <label htmlFor="pinPW">간편번호 확인</label>
          <input
            className={styles.pinInput}
            type="password"
            id="pinChk"
            value={pinCheck}
            name="pinCheck"
            maxLength={6}
            onChange={handlerPinCheck}
          />
          {message && <span className={styles.pinMsg}>{message}</span>}
          <button
            type="button"
            className={styles.submitBtn}
            disabled={message.length != 0 || pin.length == 0 || pinCheck.length == 0 || pinCheck.length != 6}
          >
            확인
          </button>
        </form>
      </div>
      {showRst && <div>{showRst}</div>}
    </section>
  );
}
