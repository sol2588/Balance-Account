"use client";

import { useState, useEffect, MouseEvent } from "react";
import styles from "./PaginationComponent.module.css";

const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];

interface RecentProps {
  idx: number;
  account: string;
  bank: string;
  name: string;
  date: string;
  sendMoney: string;
  purpose: string | null;
}

// Pagination 컴포넌트의 Props 타입을 정의
interface PaginationProps {
  recentData: RecentProps[];
}

export default function Pagination({ recentData }: PaginationProps) {
  const [btnActive, setBtnActive] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalData = items.length; // 총 데이터
  const limitData = 4; // 한페이지에 보여줄 데이터의 개수
  const totalPage = Math.ceil(totalData / limitData); // 전체 페이지 수
  const pageCount = 5; // 보여줄 버튼의 수
  const pageGroup = Math.ceil(currentPage / pageCount); // 현재 버튼 그룹
  const totalGroup = Math.ceil(totalPage / pageCount); // 전체 버튼 그룹

  let lastNum = pageGroup * pageCount;
  if (lastNum > totalPage) lastNum = totalPage;
  let firstNum = (pageGroup - 1) * pageCount + 1;

  const next = lastNum + 1;
  const prev = firstNum - 1;

  if (recentData.length === 0) {
    return <p>No data is available</p>;
  }

  return (
    <>
      <table className={styles.recentTable}>
        <thead>
          <tr className={styles.recentTableRow}>
            <th>순번</th>
            <th>날짜</th>
            <th>이름</th>
            <th>은행</th>
            <th>금액</th>
          </tr>
        </thead>
        <tbody>
          {recentData?.slice((currentPage - 1) * limitData, limitData * currentPage).map((item, idx) => (
            <tr key={item.idx} className={styles.recentTableRow}>
              <td>{idx + 1}</td>
              <td>{item.date}</td>
              <td>{item.name}</td>
              <td>{item.bank}</td>
              <td>{item.sendMoney}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.buttonGroup}>
        {pageGroup > 1 && (
          <button type="button" className={styles.numberBtn} onClick={() => setCurrentPage(prev)}>
            {" "}
            {"<"}{" "}
          </button>
        )}
        {Array(pageCount)
          .fill(firstNum)
          .map((_, i) => {
            return (
              <button
                type="button"
                value={i}
                className={[styles.numberBtn, i == btnActive ? styles.active : ""].join(" ")}
                key={i}
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  setCurrentPage(firstNum + i);
                  setBtnActive(i);
                }}
              >
                {firstNum + i}
              </button>
            );
          })}
        {totalGroup > pageGroup && (
          <button type="button" className={styles.numberBtn} onClick={() => setCurrentPage(next)}>
            {">"}
          </button>
        )}
      </div>
    </>
  );
}
