"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
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
  const [userName, setUserName] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [pw, setPw] = useState<string>("");
  const [pwChk, setPwChk] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [pwValid, setPwValid] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    if (!pw || !pwChk) {
      setPwValid("");
    } else if (pw != pwChk) {
      setPwValid("비밀번호가 일치하지 않습니다.");
    } else {
      setPwValid("비밀번호가 일치합니다.");
    }
  }, [pw, pwChk]);

  const isDisabled = !userName || !userId || !userEmail || !pw || !pwChk;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/signup", { userName, userEmail, userId, pw, pwChk });
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

  const googleSignup = useGoogleLogin({
    scope: "email profile",
    onSuccess: async authCode => {
      try {
        const response = await axios.post("/api/auth/signup/callback", { authCode: authCode.code });
        if (response.status === 200) {
          router.push("/login");
        }
      } catch (err: any) {
        setMessage(err.response.data.message);
      }
    },
    onError: err => console.log(err),
    flow: "auth-code",
    redirect_uri: "postmessage",
  });

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
            tabIndex={1}
          />

          <label htmlFor="email" className={styles.signupLabel}>
            Email
          </label>
          <input
            className={styles.signupInput}
            type="text"
            id="eamil"
            name="email"
            value={userEmail}
            onChange={e => setUserEmail(e.target.value)}
            tabIndex={2}
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
            tabIndex={3}
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
            tabIndex={4}
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
            tabIndex={5}
          />
          <span className={styles.singupInputPwMsg}>{pwValid}</span>
        </fieldset>

        {message && <p>{message}</p>}
        <button className={styles.submitBtn} type="submit" disabled={isDisabled}>
          가입하기
        </button>

        <button className={styles.googleBtn} onClick={() => googleSignup()}>
          <img src="/web_light_sq_SU@2x.png" alt="google_login" />
        </button>
      </form>
    </section>
  );
}
