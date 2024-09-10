"use client";

import { useRouter } from "next/navigation";
import styles from "./LoginSuccessComponent.module.css";

export default function LoginSuccessComponent() {
  const router = useRouter();
  const persistData = sessionStorage.getItem("persist:root");
  const userData = persistData ? JSON.parse(JSON.parse(persistData).user) : null;

  return (
    <section className={styles.successContainer}>
      <header>
        <h3 className={styles.successHeader}>Login Success!!</h3>
      </header>

      <div className={styles.pinContents}>
        <h4 className={styles.successMsg}>🎉 환영합니다, {userData.userName}님!</h4>
        <div className={styles.pinDesc}>
          간편 로그인 기능을 설정하여 빠르고 안전하게
          <br />
          로그인할 수 있습니다. 아래 옵션을 확인해보세요.
        </div>
        <div role="buttonWrapper">
          <button className={styles.commonBtn} onClick={() => router.push("/main")}>
            메인페이지 가기
          </button>
          <button className={styles.commonBtn} onClick={() => router.push("/pin/make")}>
            간편로그인 설정하기
          </button>
        </div>
      </div>
    </section>
  );
}
