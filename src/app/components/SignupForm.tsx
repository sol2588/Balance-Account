"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SignupForm.module.css";
import axios from "axios";

export default function Signup() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [pw, setPw] = useState("");
  const [pwChk, setPwChk] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/signup", { userName, userId, pw, pwChk });
      console.log(res);
      if (res.status === 200) {
        router.push("/login");
      }
    } catch (e) {
      console.log(e);
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
        </fieldset>
        <button type="submit">가입하기</button>
      </form>
    </section>
  );
}
