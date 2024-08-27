"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./SignupComponent.module.css";
import axios from "axios";

interface ErrorType {
  response?: {
    data?: {
      message: string;
    };
  };
}

export default function SignupComponent() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [pw, setPw] = useState("");
  const [pwChk, setPwChk] = useState("");
  const [message, setMessage] = useState("");
  const [pwValid, setPwValid] = useState("");

  // ! 이 부분 이상해 : logic - 현재는 pwChk입력후 pw를 바꾸면 둘이 일치해도 일치하지 않다고 나옴
  useEffect(() => {
    if (pw != pwChk) {
      setPwValid("비밀번호가 일치하지 않습니다.");
    } else if (pw == pwChk) {
      setPwValid("비밀번호가 일치합니다.");
    }
  }, [pwChk]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/signup", { userName, userId, pw, pwChk });
      if (response.status === 200) {
        router.push("/login");
      } else {
        console.log(response.status);
      }
    } catch (error: unknown) {
      const err = error as ErrorType;
      setMessage(err.response?.data?.message || "Unknown error occurred");
    }
  };

  return (
    <section className={styles.signupContainer}>
      <header>
        <h3 className={styles.signupHeader}>회원가입</h3>
      </header>
      <form action="/api/signup" method="post" onSubmit={handleSubmit}>
        <fieldset className={styles.signupField}>
          <legend className={styles.signupDesc}>Welcome, Register your account</legend>
          <label htmlFor="name" className={styles.signupLabel}>
            Name
          </label>
          <input
            className={styles.signupInput}
            type="text"
            id="name"
            name="name"
            value={userName}
            onChange={e => setUserName(e.target.value)}
          />

          <label htmlFor="id" className={styles.signupLabel}>
            ID
          </label>
          <input
            className={styles.signupInput}
            type="text"
            id="id"
            name="id"
            value={userId}
            onChange={e => setUserId(e.target.value)}
          />

          <label htmlFor="pw" className={styles.signupLabel}>
            Password
          </label>
          <input
            className={styles.signupInput}
            type="password"
            id="pw"
            name="pw"
            value={pw}
            onChange={e => setPw(e.target.value)}
          />

          <label htmlFor="pwChk" className={styles.signupLabel}>
            Password Check
          </label>
          <input
            className={styles.signupInput}
            type="password"
            id="pwChk"
            name="pwChk"
            value={pwChk}
            onChange={e => setPwChk(e.target.value)}
          />
          <p>{pwValid}</p>
        </fieldset>
        <button className={styles.submitBtn} type="submit">
          가입하기
        </button>
        {message.length && <p>{message}</p>}
      </form>
    </section>
  );
}
