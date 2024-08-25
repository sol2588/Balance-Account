import axios from "axios";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();
  const handleLogout = async () => {
    const response = await axios.post("/api/logout");

    try {
      if (response.status == 200) {
        localStorage.removeItem("refreshToken");
        router.push("/");
      } else {
        console.log(new Error());
      }
    } catch (err) {
      console.log("Error during logout", err);
    }
  };
  return <button onClick={handleLogout}>Logout</button>;
}
