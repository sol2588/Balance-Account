"use client";
import AccountInfoComponent from "../AccountInfoComponent/AccountInfoComponent";
import LogoutButton from "../common/LogoutButton";
import styles from "./MainComponent.module.css";

// ! skeleton UI나 loading UI필요
// ! db에 계좌정보가 있다면 다른 화면 렌더 필요
export default function MainComponent() {
  return (
    <>
      {/* <LogoutButton /> */}
      <main className={styles.mainContainer}>
        <h3 className={styles.mainTitle}>Overview</h3>
        <section className={styles.mainContents}>
          <AccountInfoComponent />
          <aside className={styles.sideMenu}></aside>
        </section>
      </main>
    </>
  );
}
