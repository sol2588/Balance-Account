"use client";
import { useState, useEffect } from "react";
import styles from "./PINComponent.module.css";

export default function PINComponent() {
  const [pinPw, setPinPw] = useState<number>();

  const needFocus = pinPw ? pinPw.toString().length + 1 : 1;
  console.log(typeof needFocus, needFocus);
  console.log(pinPw);
  const handleSubmit = () => {};

  const handleClick = () => {
    setPinPw;
  };

  return (
    <section className={styles.pinContainer}>
      <header>
        {/* // * 타이틀만 변경 - redux 사용? */}
        <h4 className={styles.pinTitle}>간편 로그인</h4>
      </header>
      <form onSubmit={handleSubmit}>
        <input
          className={[styles.pinPassword, needFocus == 1 ? styles.active : ""].join(" ")}
          type="password"
          value={pinPw}
          maxLength={1}
          onClick={handleClick}
        />
        <input
          className={[styles.pinPassword, needFocus == 2 ? styles.active : ""].join(" ")}
          type="password"
          value={pinPw}
          maxLength={1}
          onClick={handleClick}
        />
        <input
          className={[styles.pinPassword, needFocus == 3 ? styles.active : ""].join(" ")}
          type="password"
          value={pinPw}
          maxLength={1}
          onClick={handleClick}
        />
        <input
          className={[styles.pinPassword, needFocus == 4 ? styles.active : ""].join(" ")}
          type="password"
          value={pinPw}
          maxLength={1}
          onClick={handleClick}
        />
        <input
          className={[styles.pinPassword, needFocus == 5 ? styles.active : ""].join(" ")}
          type="password"
          value={pinPw}
          maxLength={1}
          onClick={handleClick}
        />
        <input
          className={[styles.pinPassword, needFocus == 6 ? styles.active : ""].join(" ")}
          type="password"
          value={pinPw}
          maxLength={1}
          onClick={handleClick}
        />
      </form>
    </section>
  );
}
