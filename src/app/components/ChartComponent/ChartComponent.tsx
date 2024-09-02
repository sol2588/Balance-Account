"use client";
import LineChart from "./Chart";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ChartComponent.module.css";
import { Timestamp } from "firebase/firestore";

interface FullDataProps {
  account: string;
  bank: string;
  date: Timestamp;
  idx: number;
  name: string;
  sendMoney: string;
}
interface ExpenseProps {
  [key: string]: number;
}

export default function ChartComponent() {
  const [fullData, setFullData] = useState<FullDataProps[]>();
  const [monthlyExpenses, setMonthlyExpenses] = useState<ExpenseProps>({
    "1월": 0,
    "2월": 0,
    "3월": 0,
    "4월": 0,
    "5월": 0,
    "6월": 0,
    "7월": 0,
    "8월": 0,
    "9월": 0,
    "10월": 0,
    "11월": 0,
    "12월": 0,
  });

  // 전체 송금 내역 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/chart");
        if (response.status == 200) {
          const data = response.data.allTransactionData;
          setFullData(data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const expenseInMonth = (yearData: FullDataProps[]) => {
    const updatedMonthlyExpenses: ExpenseProps = {
      "1월": 0,
      "2월": 0,
      "3월": 0,
      "4월": 0,
      "5월": 0,
      "6월": 0,
      "7월": 0,
      "8월": 0,
      "9월": 0,
      "10월": 0,
      "11월": 0,
      "12월": 0,
    };
    console.log(yearData);
    yearData.forEach(item => {
      const timestamp = item.date.seconds * 1000;
      const targetDate = new Date(timestamp);
      const year = targetDate.getFullYear();
      const month = (targetDate.getMonth() + 1).toString() + "월";

      updatedMonthlyExpenses[month] += parseInt(item.sendMoney.replaceAll(",", "")) || 0;
    });
    setMonthlyExpenses(updatedMonthlyExpenses);
  };

  useEffect(() => {
    if (!fullData?.length) return;
    expenseInMonth(fullData);
  }, [fullData]);

  const chartData = {
    labels: Object.keys(monthlyExpenses),
    datasets: [
      {
        label: "합계",
        data: Object.values(monthlyExpenses),
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
