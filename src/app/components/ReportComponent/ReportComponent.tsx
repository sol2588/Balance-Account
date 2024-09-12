"use client";

import { useState, useEffect, MouseEvent } from "react";
import { Timestamp } from "firebase/firestore";
import Pagination from "../PaginationComponent/PagiantionComponent";
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
  const [activeBtn, setActiveBtn] = useState<string>("peroid");
  const [purposeBtn, setPurposeBtn] = useState<boolean>(false);
  const [periodBtn, setPeroidBtn] = useState<string>("full");
  const [message, setMessage] = useState<string>("");
  const [originData, setOriginData] = useState<RecentProps[]>([]);
  const [recentData, setRecentData] = useState<RecentProps[]>([]);
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/report");
        if (response.status == 200) {
          const data: FetchDataProps[] = response.data.recentTransaction;
          const formattedData: RecentProps[] = data.map((dataItem: FetchDataProps) => {
            const timestamp = new Date(dataItem.date.seconds * 1000);
            const formattedDate = timestamp.toISOString().split("T")[0];
            return { ...dataItem, date: formattedDate };
          });
          setRecentData(formattedData);
          setOriginData(formattedData);
        } else {
          console.log(response.data.message);
          // ! 메시지 반환되는지 확인
          setMessage(response.data.message);
        }
      } catch (err: any) {
        console.log(err.response.message);
      }
    };
    fetchData();
  }, []);

  const getTargetDate = (value: string) => {
    const selectDate = new Date();
    if (value.includes("year")) {
      selectDate.setFullYear(selectDate.getFullYear() - 1);
    } else if (value.includes("month")) {
      const selectMonth = parseInt(value.replace("month", ""));
      selectDate.setMonth(selectDate.getMonth() - selectMonth);
    } else {
      selectDate.setFullYear(2023);
      selectDate.setMonth(0);
      selectDate.setDate(1);
    }
    return selectDate.toISOString().split("T")[0];
  };

  const filteredByDate = (targetDate: string): RecentProps[] => {
    return originData.filter(recent => {
      const compareDate = new Date(recent.date).toISOString().split("T")[0];
      return new Date(compareDate) >= new Date(targetDate);
    });
  };

  const handleClickMonth = (e: MouseEvent<HTMLButtonElement>) => {
    const { value } = e.target as HTMLButtonElement;

    const targetDate = getTargetDate(value);
    const filterdData = filteredByDate(targetDate);
    setStartDate(targetDate);
    setEndDate(new Date().toISOString().split("T")[0]);
    setRecentData(filterdData);
  };

  const periodOptions = [
    { label: "전체", value: "full" },
    { label: "1개월", value: "month1" },
    { label: "3개월", value: "month3" },
    { label: "6개월", value: "month6" },
    { label: "1년", value: "year1" },
  ];

  const totalSendMoney = recentData
    .reduce((acc, cur) => {
      const amount = parseInt(cur.sendMoney.replace(",", ""));
      return acc + (isNaN(amount) ? 0 : amount);
    }, 0)
    .toLocaleString("ko-KR");

  return (
    <section className={styles.reportContainer}>
      <header>
        <h3 className={styles.reportHeader}>Report</h3>
      </header>
      <div className={styles.reportContents}>
        <div className={styles.reportList}>
          <div role="buttonWrapper" className={styles.btnWrapper}>
            <button
              type="button"
              value="period"
              className={[styles.selectBtn, activeBtn == "peroid" ? styles.active : ""].join(" ")}
              onClick={() => {
                setPurposeBtn(false);
                setActiveBtn("peroid");
              }}
            >
              기간별
            </button>
            <button
              type="button"
              value="purpose"
              className={[styles.selectBtn, activeBtn == "purpose" ? styles.active : ""].join(" ")}
              onClick={() => {
                setPurposeBtn(true);
                setActiveBtn("purpose");
              }}
            >
              목록별
            </button>

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
                  <label className={styles.visuallyHidden} htmlFor="startDate">
                    시작날짜
                  </label>
                  <input
                    className={styles.periodInput}
                    type="text"
                    id="startDate"
                    value={startDate}
                    placeholder="시작날짜"
                  />
                  <span className={styles.space}>~</span>
                  <label className={styles.visuallyHidden} htmlFor="endDate">
                    종료날짜
                  </label>
                  <input
                    className={styles.periodInput}
                    type="text"
                    id="endDate"
                    value={endDate}
                    placeholder="종료날짜"
                  />
                </div>
                <div className={styles.peroidBtnWrapper}>
                  {periodOptions.map(option => (
                    <button
                      className={[styles.clickPeroidBtn, periodBtn == option.value ? styles.periodActive : ""].join(
                        " ",
                      )}
                      key={option.value}
                      value={option.value}
                      onClick={(e: MouseEvent<HTMLButtonElement>) => {
                        handleClickMonth(e);
                        const { value } = e.target as HTMLButtonElement;
                        setPeroidBtn(value);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className={styles.pagination}>
            <Pagination recentData={recentData} />
          </div>
        </div>
        <div className={styles.reportResult}>
          <div className={styles.reportTitle}>
            <span className={styles.reportResultTotal}>지출 총금액</span>
          </div>
          <span>{startDate ? `${startDate}부터${endDate} 기간 동안` : "전체기간 동안"}</span>
          <span className={styles.reportValue}>{totalSendMoney}원</span>
        </div>
      </div>
    </section>
  );
}
