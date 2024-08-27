import axios from "axios";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const handleLogout = async () => {
    const response = await axios.post("/api/logout");

    try {
      if (response.status == 200) {
        localStorage.removeItem("accessToken");
        // ! accountInfo 삭제
        localStorage.removeItem("accountInfo");
        localStorage.setItem("loginState", "false");
        router.push("/");
        console.log(response.data);
      } else {
        console.log(new Error());
      }
    } catch (err) {
      console.log("Error during logout", err);
    }
  };
  return <button onClick={handleLogout}>Logout</button>;
}
