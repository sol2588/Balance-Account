"use client";

import { useState, useEffect, MouseEvent } from "react";
import { Timestamp } from "firebase/firestore";
import Pagination from "../PaginationComponent/PagiantionComponent";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  const [activeBtn, setActiveBtn] = useState<string>("period");
  const [purposeBtn, setPurposeBtn] = useState<string>("전체");
  const [periodBtn, setPeriodBtn] = useState<string>("full");
  const [message, setMessage] = useState<string>("");
  const [originData, setOriginData] = useState<RecentProps[]>([]);
  const [recentData, setRecentData] = useState<RecentProps[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(new Date("2023-01-01"));
  const [endDate, setEndDate] = useState<Date | null>(new Date());

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
          setRecentData([...formattedData].sort((a, b) => b.idx - a.idx));
          setOriginData(formattedData);
        } else {
          console.log(response.data.message);
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
    setStartDate(new Date(targetDate));
    setEndDate(new Date());
    setRecentData([...filterdData].sort((a, b) => b.idx - a.idx));
  };

  const handleChangeDate = (date: Date) => {
    const targetDateToString = date.toISOString().split("T")[0];
    const filteredData = filteredByDate(targetDateToString);
    setStartDate(date);
    setRecentData([...filteredData].sort((a, b) => b.idx - a.idx));
  };

  const handleClickPurpose = (e: MouseEvent<HTMLButtonElement>) => {
    const { value } = e.target as HTMLButtonElement;
    const newData = originData.filter(recent => recent?.purpose == value);
    setRecentData([...newData].sort((a, b) => b.idx - a.idx));
  };

  const changeDateToString = (targetDate: Date) => {
    return targetDate.toISOString().split("T")[0];
  };

  const periodOptions = [
    { label: "전체", value: "full" },
    { label: "1개월", value: "month1" },
    { label: "3개월", value: "month3" },
    { label: "6개월", value: "month6" },
    { label: "1년", value: "year1" },
  ];
  const purposeOptions = [
    { value: "all", text: "전체" },
    { value: "transaction", text: "거래" },
    { value: "trading", text: "주식" },
    { value: "food", text: "식비" },
    { value: "lesuire", text: "여가" },
    { value: "etc", text: "기타" },
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
              className={[styles.selectBtn, activeBtn == "period" ? styles.active : ""].join(" ")}
              onClick={() => setActiveBtn("period")}
            >
              기간별
            </button>
            <button
              type="button"
              value="purpose"
              className={[styles.selectBtn, activeBtn == "purpose" ? styles.active : ""].join(" ")}
              onClick={() => {
                setActiveBtn("purpose");
              }}
            >
              목록별
            </button>

            {activeBtn == "purpose" ? (
              <div className={styles.purposeWrapper}>
                {purposeOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    className={[styles.purposeTypeBtn, purposeBtn == option.text ? styles.purposeActive : ""].join(" ")}
                    value={option.text}
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      const { value } = e.target as HTMLButtonElement;
                      setPurposeBtn(value);
                      handleClickPurpose(e);
                    }}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            ) : (
              <div className={styles.periodWrapper}>
                <div className={styles.datePicker}>
                  <ReactDatePicker
                    className={styles.dateCalendar}
                    showIcon
                    dateFormat="yyyy-MM-dd"
                    selected={startDate}
                    onChange={date => handleChangeDate(date!)}
                  />

                  <span className={styles.space}>~</span>
                  <ReactDatePicker
                    className={styles.dateCalendar}
                    showIcon
                    disabled
                    dateFormat="yyyy-MM-dd"
                    selected={endDate}
                    onChange={date => setEndDate(date)}
                  />
                </div>
                <div className={styles.periodBtnWrapper}>
                  {periodOptions.map(option => (
                    <button
                      className={[styles.clickPeriodBtn, periodBtn == option.value ? styles.periodActive : ""].join(
                        " ",
                      )}
                      key={option.value}
                      value={option.value}
                      onClick={(e: MouseEvent<HTMLButtonElement>) => {
                        handleClickMonth(e);
                        const { value } = e.target as HTMLButtonElement;
                        setPeriodBtn(value);
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
          {activeBtn == "period" ? (
            <span className={styles.reportContent}>
              {startDate ? (
                <>
                  <span>{changeDateToString(startDate)}부터 </span>
                  <br />
                  <span>{changeDateToString(endDate!)} 기간 동안</span>
                </>
              ) : (
                "전체기간 동안"
              )}
            </span>
          ) : (
            <span>{purposeBtn} 지출 금액은</span>
          )}
          <span className={styles.reportValue}>{totalSendMoney}원</span>
        </div>
      </div>
    </section>
  );
}
