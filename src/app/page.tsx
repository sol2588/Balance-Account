"use client";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

interface Props {
  id: string;
  contents: string;
}

export default function Home() {
  const router = useRouter();
  const handleLogin = () => {
    router.push("/login");
  };
  const handleSignup = () => {
    router.push("/signup");
  };
  return (
    <section className={styles.contentsContainer}>
      <div className={styles.contentsUser}>
        <p>사용자는</p>
        <button className={styles.button} onClick={handleLogin}>
          로그인
        </button>
      </div>
      <div className={styles.contentsGuest}>
        <p>사용하고 싶다면</p>
        <button className={styles.button} onClick={handleSignup}>
          회원가입
        </button>
      </div>
    </section>
  );
}
