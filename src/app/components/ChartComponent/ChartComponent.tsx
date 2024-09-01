"use client";
import LineChart from "./Chart";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ChartComponent.module.css";
import { Timestamp } from "firebase/firestore";
import { DateAdapter } from "chart.js";

interface FullDataProps {
  account: string;
  bank: string;
  date: Timestamp;
  idx: number;
  name: string;
  sendMoney: string;
}

interface DataProps {
  date: string;
  name: string;
  send: string;
  idx: number;
}

export default function ChartComponent() {
  const [fullData, setFullData] = useState<FullDataProps[]>();
  const [sortedData, setSortedData] = useState({});

  // 전체 송금 내역 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/chart");
        if (response.status == 200) {
          setFullData(response.data.allTransactionData);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  // 송금내역 날짜 변환
  useEffect(() => {
    if (!fullData?.length) return;
    const groupData: { [year: number]: { [month: string]: DataProps[] } } = {};

    fullData.forEach(({ idx, date, name, sendMoney }) => {
      const targetDate = new Date(date.seconds * 1000);
      const year = targetDate.getFullYear();
      const month = ("0" + (targetDate.getMonth() + 1)).slice(-2);
      const day = ("0" + targetDate.getDate()).slice(-2);
      const dateString = year + "년" + month + "월" + day + "일";

      const formatData = { idx, date: dateString, name, send: sendMoney };
      if (!groupData[year]) {
        groupData[year] = {};
      }
      if (!groupData[year][month]) {
        groupData[year][month] = [];
        groupData[year][month].push(formatData);
      } else {
        groupData[year][month].push(formatData);
      }
    });
    setSortedData(groupData);
  }, [fullData]);

  console.log(sortedData);

  const chartData = {
    labels: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
    datasets: [
      {
        label: "TestData",
        data: [0, 1, 2, 3, 10, 11, 4, 6, 1, 0, 12, 12],
        borderWidth: 2,
        borderColor: "#EFAA75",
        backgroundColor: "#fff",
        tension: 0.2,
      },
    ],
  };

  return (
    <section className={styles.chartContainer}>
      <header>
        <h3 className={styles.title}>Chart</h3>
      </header>
      <LineChart data={chartData} />
    </section>
  );
}
