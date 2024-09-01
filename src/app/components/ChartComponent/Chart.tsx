import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "./Chart.module.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = ({ data }) => {
  const options = {
    responsive: true,
    interaction: {
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          color: "blue",
          display: false,
        },
        ticks: {
          color: "#fff",
        },
        title: {
          display: true,
          text: "month",
          color: "#fff",
          size: 20,
        },
      },
      y: {
        grid: {
          color: "#fff",
        },
        ticks: {
          color: "#fff",
        },
        title: {
          display: true,
          text: "count",
          color: "#fff",
        },
      },
    },

    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#fff", // 범례 텍스트 색상
          font: {
            size: 20,
          },
        },
      },
      title: {
        display: true,
        text: "지출 차트",
        color: "#fff",
      },
    },
  };

  return (
    <div className={styles.chartBox}>
      <Line data={data} options={options} />
    </div>
  );
};
export default LineChart;
