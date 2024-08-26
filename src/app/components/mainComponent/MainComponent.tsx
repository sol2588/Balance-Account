"use client";
import styles from "./MainComponent.module.css";
import LogoutButton from "../common/LogoutButton";
import AccountInfoComponent from "../AccountInfoComponent/AccountInfoComponent";

// ! skeleton UI나 loading UI필요
// ! db에 계좌정보가 있다면 다른 화면 렌더 필요
export default function MainComponent() {
  return (
    <>
      <LogoutButton />
      <main className={styles.mainContainer}>
        <AccountInfoComponent />
        <aside className={styles.sideMenu}></aside>
      </main>
    </>
  );
}
