"use client";
import AccountInfoComponent from "../AccountInfoComponent/AccountInfoComponent";
import styles from "./MainComponent.module.css";

// ! skeleton UI나 loading UI필요
export default function MainComponent() {
  return (
    <>
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
