"use client";

import { MouseEvent, ChangeEvent } from "react";
import styles from "./CurrencyInput.module.css";

interface setFunction {
  setMoney: React.Dispatch<React.SetStateAction<string | undefined>>;
  value: string | undefined;
}

export default function CurrencyInput({ setMoney, value }: setFunction) {
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    let strToNum = Number(value.replaceAll(",", ""));
    if (isNaN(strToNum)) {
      setMoney("0");
    } else {
      setMoney(strToNum.toLocaleString("ko-KR"));
    }
  };

  const handleClickMoney = (e: MouseEvent<HTMLButtonElement>) => {
    const clickedMoney = Number((e.target as HTMLButtonElement).value);
    setMoney(prev => {
      if (prev) {
        const updateMoney = Number(prev?.replaceAll(",", "")) + clickedMoney;
        return updateMoney.toLocaleString("ko-KR");
      }
      return clickedMoney.toLocaleString("ko-KR");
    });
  };

  return (
    <>
      <label htmlFor="charge" className={styles.visuallyHidden}>
        Charge:
      </label>
      <input
        type="text"
        className={styles.chargeInput}
        id="charge"
        value={value}
        onChange={handleInput}
        placeholder="충전 금액을 입력해주세요"
      />
      <div role="group">
        <button className={styles.button} name="amount" value="5000" onClick={handleClickMoney}>
          5천
        </button>
        <button className={styles.button} name="amount" value="10000" onClick={handleClickMoney}>
          1만
        </button>
        <button className={styles.button} name="amount" value="50000" onClick={handleClickMoney}>
          5만
        </button>
        <button className={styles.button} name="amount" value="100000" onClick={handleClickMoney}>
          10만
        </button>
        <button className={styles.button} name="amount" value="1000000" onClick={handleClickMoney}>
          100만
        </button>
      </div>
    </>
  );
}
