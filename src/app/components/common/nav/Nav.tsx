"use client";

import Link from "next/link";
import styles from "./Nav.module.css";
import LogoutButton from "../LogoutButton";

export default function Nav() {
  return (
    <nav className={styles.navContainer}>
      <header>
        <h1 className={styles.title}>Balance Account</h1>
      </header>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link href="/main">Overview</Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/transaction">Transaction</Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/charge">Charge</Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/friends">Friends</Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/chart">Chart</Link>
        </li>
      </ul>
      <LogoutButton />
    </nav>
  );
}
