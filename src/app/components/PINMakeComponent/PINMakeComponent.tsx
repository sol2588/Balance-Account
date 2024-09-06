"use client";

import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./PINMakeComponent.module.css";
import axios from "axios";

export default function PINMakeComponent() {
  const router = useRouter();
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
        console.log(response);
        setShowRst(response.data.message);
        // setTimeout(() => {
        //   router.push("/pin/login");
        // }, 1000);
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

        <div>
          <form className={styles.pinForm} action="/pin/make" method="post" onSubmit={handleSubmit}>
            <input
              className={styles.pinInput}
              type="password"
              value={pin}
              name="pin"
              maxLength={6}
              onChange={handlerPin}
            />
            <input
              className={styles.pinInput}
              type="password"
              value={pinCheck}
              name="pinCheck"
              maxLength={6}
              onChange={handlerPinCheck}
            />
            {message && <div>{message}</div>}
            <button
              className={styles.submitBtn}
              disabled={message == "PIN 번호가 일치하지 않습니다." || !pinCheck || pinCheck.length != 6}
            >
              확인
            </button>
          </form>
        </div>
      </div>
      {showRst && <div>{showRst}</div>}
    </section>
  );
}
