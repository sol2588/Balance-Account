import styles from "./MainComponent.module.css";
import { IoIosAddCircle } from "react-icons/io";

// ! skeleton UI나 loading UI필요
// ! db에 계좌정보가 있다면 다른 화면 렌더 필요
export default function MainComponent() {
  return (
    <>
      <main className={styles.mainContainer}>
        <section className={styles.makeAccountMenu}>
          <h3 className={styles.title}>
            <a className={styles.accountLink} href="/createAccount">
              계좌생성하기
            </a>
          </h3>
          <a href="/createAccount">
            <IoIosAddCircle className={styles.accountButton} />
          </a>
        </section>
        <aside className={styles.sideMenu}></aside>
      </main>
    </>
  );
}
