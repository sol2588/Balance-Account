"use client";

import { useState } from "react";
import Link from "next/link";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import styles from "./Navigation.module.css";
import LogoutButton from "../logout/LogoutButton";

export default function Nav() {
  const [menuToggle, setMenuToggle] = useState<boolean>(false);

  const handleMenuToggle = () => {
    setMenuToggle(!menuToggle);
  };

  const handleMenuItemClick = () => {
    setMenuToggle(false);
  };

  return (
    <nav className={styles.navContainer}>
      <header>
        <h1 className={styles.title}>Balance Account</h1>
      </header>

      <div className={styles.menuIcon} onClick={handleMenuToggle}>
        {menuToggle ? (
          <AiOutlineClose className={styles.menuClose} size={30} />
        ) : (
          <AiOutlineMenu className={styles.menuBar} size={30} />
        )}
      </div>
      <ul className={[styles.navList, menuToggle ? styles.toggleMenu : ""].join(" ")}>
        <li className={styles.navItem}>
          <Link href="/main" onClick={handleMenuItemClick}>
            Overview
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/transaction" onClick={handleMenuItemClick}>
            Transaction
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/charge" onClick={handleMenuItemClick}>
            Charge
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/friends" onClick={handleMenuItemClick}>
            Friends
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/chart" onClick={handleMenuItemClick}>
            Chart
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/report" onClick={handleMenuItemClick}>
            Report
          </Link>
        </li>
      </ul>

      <LogoutButton />
    </nav>
  );
}
