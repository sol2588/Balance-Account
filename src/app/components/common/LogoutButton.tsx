import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setLogoutSuccess } from "@/lib/actions/userActions";

export default function LogoutButton() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    const response = await axios.post("/api/logout");

    try {
      if (response.status == 200) {
        // 전역상태 : 로그아웃(isLoggedIn : false)
        dispatch(setLogoutSuccess());
        localStorage.removeItem("accessToken");
        // ! accountInfo 삭제
        localStorage.removeItem("accountInfo");
        localStorage.setItem("loginState", "false");
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
