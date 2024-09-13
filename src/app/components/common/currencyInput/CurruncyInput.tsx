"use client";

import { useState, MouseEvent, ChangeEvent } from "react";
import styles from "./CurrencyInput.module.css";

interface setFunction {
  setMoney: React.Dispatch<React.SetStateAction<string | undefined>>;
  value: string | undefined;
  setMessage: React.Dispatch<React.SetStateAction<string | "">>;
  title: string;
}

export default function CurrencyInput({ setMoney, value, setMessage, title }: setFunction) {
  const [active, setActive] = useState<string>("");
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    let strToNum = Number(value.replaceAll(",", ""));
    setMessage("");
    if (isNaN(strToNum)) {
      setMoney("0");
    } else {
      setMoney(strToNum.toLocaleString("ko-KR"));
    }
  };

  const handleClickMoney = (e: MouseEvent<HTMLButtonElement>) => {
    setMessage("");
    const clickedMoney = Number((e.target as HTMLButtonElement).value);
    setMoney(prev => {
      if (prev) {
        const updateMoney = Number(prev?.replaceAll(",", "")) + clickedMoney;
        return updateMoney.toLocaleString("ko-KR");
      }
      return clickedMoney.toLocaleString("ko-KR");
    });
    const { innerText } = e.target as HTMLButtonElement;
    setActive(innerText);
  };

  const moneyVariation = [
    { value: 5000, text: "5천" },
    { value: 10000, text: "1만" },
    { value: 50000, text: "5만" },
    { value: 100000, text: "10만" },
    { value: 1000000, text: "100만" },
  ];

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
        placeholder={`${title} 금액을 입력해주세요`}
      />
      <div role="group">
        {moneyVariation.map(money => (
          <button
            key={money.value}
            type="button"
            className={[styles.button, active == money.text ? styles.active : ""].join(" ")}
            name="amount"
            value={money.value}
            onClick={handleClickMoney}
          >
            {money.text}
          </button>
        ))}
      </div>
    </>
  );
}
