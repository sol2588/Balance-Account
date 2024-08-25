import { collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/database";

export async function GET() {
  try {
    const dbQuery = await getDocs(collection(db, "users"));
    const data = dbQuery.docs.map(doc => doc.data());
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("Error, ", error);
    return new Response(JSON.stringify({ error: "Error fetching documents" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

// const [data, setData] = useState<Props[]>([]);
// const fetchData = async () => {
//   try {
//     const response = await fetch("/api/firestore");
//     const result = await response.json();
//     setData(result);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// };
// useEffect(() => {
//   fetchData();
// }, []);
