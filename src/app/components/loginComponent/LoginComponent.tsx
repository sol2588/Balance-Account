"use client";
import { FormEvent, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLoginSuccess } from "@/lib/actions/userActions";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/reducer";
import styles from "./LoginComponent.module.css";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

interface ErrorType {
  response?: {
    data?: {
      message: string;
    };
  };
}

export default function LoginComponent() {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
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
        dispatch(setLoginSuccess({ id: userId, token: response.data.token }));

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

  // const googleLogin = useGoogleLogin({
  //   scope: "email profile",
  //   onSuccess: async authCode => {
  //     console.log("뭐냐너", authCode);
  //     axios.post("/api/auth/callback", { code: authCode }).then(data => console.log(data));
  //   },
  //   onError: err => console.log(err),
  //   flow: "auth-code",
  // });

  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;

    // authorization code 요청
    const googleAuthUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `response_type=code&` +
      `scope=email profile&` +
      `access_type=offline&` + // access_type을 스코프가 아닌 URL 파라미터로 설정
      `prompt=consent`; // 권한 승인을 항상 요청하는 옵션
    console.log(googleAuthUrl);
    window.location.href = googleAuthUrl;
  };

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
        <button className={styles.submitBtn} type="submit">
          Login
        </button>
        {message.length && <p>{message}</p>}
      </form>

      <button onClick={handleLogin}>로그인 with Google</button>

      <p className={styles.contentsForGuest}>
        New User?{" "}
        <button className={styles.guestBtn} onClick={() => router.push("/signup")}>
          SignUp
        </button>
      </p>
    </section>
  );
}
