"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./SignupForm.module.css";
import axios from "axios";

interface ErrorType {
  response?: {
    data?: {
      message: string;
    };
  };
}

export default function Signup() {
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
          <legend>회원정보 입력</legend>
          <label htmlFor="name">성함</label>
          <input type="text" id="name" name="name" value={userName} onChange={e => setUserName(e.target.value)} />

          <label htmlFor="id">아이디</label>
          <input type="text" id="id" name="id" value={userId} onChange={e => setUserId(e.target.value)} />

          <label htmlFor="pw">비밀번호</label>
          <input type="password" id="pw" name="pw" value={pw} onChange={e => setPw(e.target.value)} />

          <label htmlFor="pwChk">비밀번호 확인</label>
          <input type="password" id="pwChk" name="pwChk" value={pwChk} onChange={e => setPwChk(e.target.value)} />
          <p>{pwValid}</p>
        </fieldset>
        <button type="submit">가입하기</button>
        {message.length && <p>{message}</p>}
      </form>
    </section>
  );
}
