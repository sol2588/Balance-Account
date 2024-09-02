import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "./Chart.module.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend);
interface Dataset {
  label: string;
  data: number[];
  borderWidth: number;
  borderColor: string;
  backgroundColor: string;
  tension: number;
}

interface BarChartProps {
  labels: string[];
  datasets: Dataset[];
}
const BarChart: React.FC<{ data: { labels: string[]; datasets: Dataset[] } }> = ({ data }) => {
  const options = {
    responsive: true,
    interaction: {
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          color: "#fff",
          display: true,
        },
        ticks: {
          color: "#fff",
          padding: 4,
        },
        title: {
          display: true,
          text: "월",
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
          min: 0,
          max: 200,
        },
        title: {
          display: true,
          text: "금액",
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
        font: {
          size: 20,
        },
      },
    },
  };

  return (
    <div className={styles.chartBox}>
      <Bar data={data} options={options} />
    </div>
  );
};
export default BarChart;
