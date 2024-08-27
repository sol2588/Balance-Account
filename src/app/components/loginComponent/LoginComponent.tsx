"use client";
import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./LoginComponent.module.css";
import axios from "axios";
import Router from "next/router";

interface ErrorType {
  response?: {
    data?: {
      message: string;
    };
  };
}

export default function LoginComponent() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [pw, setPw] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login", { userId, pw });
      if (response.status == 200) {
        // access token은 localstorage에 저장하고 refresh는 HttpOnly로 클라이언트 JS로는 접근하여 확인 불가
        // session Storage - cookie 탭에 담겨있고 클라이언트에서 request보낼때 자동으로 http의 모든 내용을 포함함
        localStorage.setItem("accessToken", response.data.token);
        localStorage.setItem("loginState", "true");
        router.push("/main");
      } else {
        console.log(response.status);
      }
    } catch (error: unknown) {
      const err = error as ErrorType;
      setMessage(err.response?.data?.message || "Unknown error");
    }
  };

  return (
    <section className={styles.loginContainer}>
      <header>
        <h3 className={styles.loginHeader}>로그인</h3>
      </header>
      <form action="/api/login" method="post" onSubmit={handleSubmit}>
        <fieldset className={styles.loginField}>
          <legend>로그인정보를 입력하세요</legend>

          <label htmlFor="id">아이디</label>
          <input type="text" id="id" name="id" value={userId} onChange={e => setUserId(e.target.value)} />

          <label htmlFor="pw">비밀번호</label>
          <input type="password" id="pw" name="pw" value={pw} onChange={e => setPw(e.target.value)} />
        </fieldset>
        <button type="submit">로그인하기</button>
        {message.length && <p>{message}</p>}
      </form>
    </section>
  );
}
