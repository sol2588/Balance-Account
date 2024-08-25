"use client";

import styles from "./CreateAccountComponent.module.css";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CreateAccountComponent() {
  const router = useRouter();
  const handleButton = async () => {
    // ! 여기서 토큰을 보내면 내가 누구인지 인증가능?
    // ! 토큰 구현하고 토큰으로 userId?
    // 어떤 데이터를 보낼건지
    // 클라이언트에서 사용자 정볼르 받아서 전달하는게 가능한가?
    const response = await axios.post("/api/createAccount", {});
    try {
      if (response.status == 200) {
        // 1) main으로 이동
        router.push("/main");
      }
    } catch (err) {
      console.log("Error on creatAccount...");
      return err;
    }
  };

  return (
    <>
      <header>
        <h3 className={styles.title}>Balance Account 입출금 통장</h3>
      </header>
      <ul className={styles.featList}>
        <li className={styles.featItem}>첫 사용자도 손쉬운 사용</li>
        <li className={styles.featItem}>지인 추가로 빠른 송금</li>
        <li className={styles.featItem}>저축도우미</li>
      </ul>
      <button className={styles.button} onClick={handleButton}>
        사용해보기
      </button>
    </>
  );
}
