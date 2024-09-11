"use client";
import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { setLoginSuccess } from "@/lib/actions/userActions";
import styles from "./LoginComponent.module.css";
import axios from "axios";

interface ErrorType {
  response?: {
    data?: {
      message: string;
    };
  };
}

export default function LoginComponent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [pw, setPw] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login", { userId, pw });
      if (response.status == 200) {
        dispatch(setLoginSuccess({ id: userId, token: response.data.token, name: response.data.name }));
        // access token은 sessionStorage 저장하고 refresh는 HttpOnly로 클라이언트 JS로는 접근하여 확인 불가
        // session Storage - cookie 탭에 담겨있고 클라이언트에서 request보낼때 자동으로 http의 모든 내용을 포함함
        if (response.data.pinExist) {
          router.push("/main");
        } else {
          router.push("/login/success");
        }
      } else {
        console.log(response.status);
      }
    } catch (error: unknown) {
      const err = error as ErrorType;
      setMessage(err.response?.data?.message || "Unknown error");
    }
  };

  const googleLogin = useGoogleLogin({
    scope: "email profile",
    onSuccess: async authCode => {
      try {
        const response = await axios.post("/api/auth/login/callback", { authCode: authCode.code });
        if (response.status == 200) {
          if (response.data.pinExist) {
            dispatch(
              setLoginSuccess({
                id: response.data.userId,
                token: response.data.token,
                name: response.data.name,
              }),
            );
            router.push("/main");
          } else {
            dispatch(
              setLoginSuccess({
                id: response.data.userId,
                token: response.data.token,
                name: response.data.name,
              }),
            );
            router.push("/login/success");
          }
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
    <section className={styles.loginContainer}>
      <header>
        <h3 className={styles.loginHeader}>Login</h3>
      </header>
      <form action="/api/login" method="post" onSubmit={handleSubmit}>
        <fieldset className={styles.loginField}>
          <legend className={styles.loginDesc}>Welcome back! Please login to your account.</legend>

          <label htmlFor="id" className={styles.loginLabel}>
            User Id
          </label>
          <input
            className={styles.loginInput}
            type="text"
            id="id"
            name="id"
            value={userId}
            onChange={e => setUserId(e.target.value)}
          />

          <label htmlFor="pw" className={styles.loginLabel}>
            Password
          </label>
          <input
            className={styles.loginInput}
            type="password"
            id="pw"
            name="pw"
            value={pw}
            onChange={e => setPw(e.target.value)}
          />
        </fieldset>
        <button className={styles.submitBtn} type="submit" disabled={!userId || !pw}>
          Login
        </button>
        {message && <span>{message}</span>}
      </form>
      <button className={styles.pinLoginBtn} onClick={() => router.push("/pin/login")}>
        간편로그인 하기
      </button>

      <button type="button" className={styles.googleBtn} onClick={googleLogin}>
        <img src="/web_light_sq_SU@2x.png" alt="Sign in with Google" />
      </button>

      <p className={styles.contentsForGuest}>
        New User?{" "}
        <button type="button" className={styles.guestBtn} onClick={() => router.push("/signup")}>
          SignUp
        </button>
      </p>
    </section>
  );
}
