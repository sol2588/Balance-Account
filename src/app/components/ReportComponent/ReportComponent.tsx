"use client";

import { useState, useEffect, MouseEvent } from "react";
import { Timestamp } from "firebase/firestore";
import axios from "axios";
import styles from "./ReportComponent.module.css";
interface RecentProps {
  idx: number;
  account: string;
  bank: string;
  name: string;
  date: string;
  sendMoney: string;
  purpose: string | null;
}

interface FetchDataProps {
  idx: number;
  account: string;
  bank: string;
  name: string;
  date: Timestamp;
  sendMoney: string;
  purpose: string | null;
}

export default function ReportComponent() {
  const [purposeBtn, setPurposeBtn] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [originData, setOriginData] = useState<RecentProps[]>([]);
  const [recentData, setRecentData] = useState<RecentProps[]>([]);
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const response = await axios.get("/api/report");
    //     if (response.status == 200) {
    //       const data: FetchDataProps[] = response.data.recentTransaction;
    //       const formattedData: RecentProps[] = data.map((d: FetchDataProps) => {
    //         const timestamp = new Date(d.date.seconds * 1000);
    //         const formattedDate = timestamp.toISOString().split("T")[0];
    //         return { ...d, date: formattedDate };
    //       });
    //       setRecentData(formattedData);
    //       localStorage.setItem("temp", JSON.stringify(formattedData));
    //       console.log(formattedData);
    //     } else {
    //       console.log(response.data.message);
    //       // * 메시지 반환되는지 확인
    //       setMessage(response.data.message);
    //     }
    //   } catch (err: any) {
    //     console.log(err.response.message);
    //   }
    // };
    // fetchData();
  }, []);
  useEffect(() => {
    const localValue = localStorage.getItem("temp")!;
    setOriginData(JSON.parse(localValue));
  }, []);

  const handleClickMonth = (e: MouseEvent<HTMLButtonElement>) => {
    const { value } = e.target as HTMLButtonElement;
    const changeValue = parseInt(value.slice(-1));

    const filteredData = originData.filter(recent => {
      const compareDate = new Date(recent.date).toISOString().split("T")[0];
      const newDate = new Date();

      if (value.includes("year")) {
        newDate.setFullYear(newDate.getFullYear() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() - changeValue);
      }
      const targetDate = newDate.toISOString().split("T")[0];
      setStartDate(targetDate);
      setEndDate(new Date().toISOString().split("T")[0]);
      return new Date(compareDate) >= new Date(targetDate);
    });

    setRecentData(filteredData);
  };

  return (
    <section className={styles.reportContainer}>
      <header>
        <h3 className={styles.reportHeader}>Report</h3>
      </header>
      <div role="buttonWrapper" className={styles.btnWrapper}>
        <button onClick={() => setPurposeBtn(false)}>기간별</button>
        <button onClick={() => setPurposeBtn(true)}>목록별</button>

        {purposeBtn ? (
          <div className={styles.purposeWrapper}>
            <button value="transaction">거래</button>
            <button value="trading">주식</button>
            <button value="eat">식비</button>
            <button value="lesuire">여가</button>
            <button value="etc">기타</button>
          </div>
        ) : (
          <div className={styles.periodWrapper}>
            <div className={styles.datePick}>
              <label htmlFor="startDate">시작날짜</label>
              <input type="text" id="startDate" value={startDate} />
              <label htmlFor="endDate">종료날짜</label>
              <input type="text" id="endDate" value={endDate} />
            </div>

            <div className={styles.dateButton}>
              <button value="month1" onClick={handleClickMonth}>
                1개월
              </button>
              <button value="month3" onClick={handleClickMonth}>
                3개월
              </button>
              <button value="month6" onClick={handleClickMonth}>
                6개월
              </button>
              <button value="year1" onClick={handleClickMonth}>
                1년
              </button>
            </div>
          </div>
        )}
      </div>
      <div>기간</div>
      <div className={styles.reportContents}>
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
            {recentData.map((item, idx) => (
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
        <div className={styles.reportResult}></div>
      </div>
    </section>
  );
}
