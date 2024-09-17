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
          color: "#2f2f2f",
          display: true,
        },
        ticks: {
          color: "#2f2f2f",
          padding: 4,
        },
        title: {
          display: true,
          text: "월",
          color: "#2f2f2f",
          size: 20,
        },
      },
      y: {
        grid: {
          color: "#2f2f2f",
        },
        ticks: {
          color: "#2f2f2f",
          min: 0,
          max: 200,
        },
        title: {
          display: true,
          text: "금액",
          color: "#2f2f2f",
        },
      },
    },

    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#2f2f2f", // 범례 텍스트 색상
          font: {
            size: 20,
          },
        },
      },
      title: {
        display: true,
        text: "지출 차트",
        color: "#2f2f2f",
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
