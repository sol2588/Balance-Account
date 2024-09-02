"use client";
import BarChart from "./Chart";
import { useState, useEffect, ChangeEvent } from "react";
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
  const [selectYear, setSelectyear] = useState<number>(new Date().getFullYear());
  const [selectMonth, setSelectMonth] = useState<string>();
  const [isDay, setIsDay] = useState<boolean>(false);
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

    yearData.forEach(item => {
      const timestamp = item.date.seconds * 1000;
      const targetDate = new Date(timestamp);
      const year = targetDate.getFullYear();
      const month = (targetDate.getMonth() + 1).toString() + "월";

      if (year == selectYear) {
        updatedMonthlyExpenses[month] += parseInt(item.sendMoney.replaceAll(",", ""));
      }
    });
    setMonthlyExpenses(updatedMonthlyExpenses);
  };

  const expenseInDay = (yearData: FullDataProps[]) => {
    const dates = selectMonth && selectYear && new Date(selectYear, parseInt(selectMonth.slice(0, 1)), 0).getDate();
    const updatedDayExpenses: { [key: string]: number } = {};
    console.log(dates, typeof dates);
    if (dates) {
      for (let day = 1; day <= dates; day++) {
        updatedDayExpenses[day] = 0;
      }
    }

    yearData.forEach(item => {
      const timestamp = item.date.seconds * 1000;
      const targetDate = new Date(timestamp);
      const year = targetDate.getFullYear();
      const month = (targetDate.getMonth() + 1).toString() + "월";
      const date = targetDate.getDate() + "일";

      if (year == selectYear && selectMonth == month) {
        updatedDayExpenses[date] = (updatedDayExpenses[date] || 0) + parseInt(item.sendMoney.replaceAll(",", ""));
      }
    });
    setMonthlyExpenses(updatedDayExpenses);
  };

  useEffect(() => {
    if (!fullData?.length) return;
    if (isDay) {
      expenseInDay(fullData);
    } else {
      expenseInMonth(fullData);
    }
  }, [fullData, selectYear, selectMonth, isDay]);

  const chartData = {
    labels: Object.keys(monthlyExpenses),
    datasets: [
      {
        label: "합계",
        data: Object.values(monthlyExpenses),
        borderWidth: 2,
        borderColor: "#FD9DB2",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        tension: 0.2,
      },
    ],
  };

  const onChangeYear = (e: ChangeEvent<HTMLSelectElement>) => {
    setIsDay(false);
    setSelectMonth("1월");
    setSelectyear(parseInt(e.target.value));
  };
  const onChangeMonth = (e: ChangeEvent<HTMLSelectElement>) => {
    setIsDay(true);
    setSelectMonth(e.target.value);
  };
  return (
    <section className={styles.chartContainer}>
      <header>
        <h3 className={styles.title}>Chart</h3>
      </header>
      <div className={styles.chartArea}>
        <select value={selectYear} onChange={onChangeYear}>
          <option value={2024}>2024</option>
          <option value={2023}>2023</option>
          <option value={2022}>2022</option>
        </select>

        <button onClick={() => setIsDay(true)}>월별보기</button>

        <select value={selectMonth} onChange={onChangeMonth} disabled={!isDay}>
          <option value="1월">1월</option>
          <option value="2월">2월</option>
          <option value="3월">3월</option>
          <option value="4월">4월</option>
          <option value="5월">5월</option>
          <option value="6월">6월</option>
          <option value="7월">7월</option>
          <option value="8월">8월</option>
          <option value="9월">9월</option>
          <option value="10월">10월</option>
          <option value="11월">11월</option>
          <option value="12월">12월</option>
        </select>

        <BarChart data={chartData} />
      </div>
    </section>
  );
}
