import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setLogoutSuccess } from "@/lib/actions/userActions";
import { setAccountLogout } from "@/lib/actions/accountActions";

export default function LogoutButton() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    const response = await axios.post("/api/logout");

    try {
      if (response.status == 200) {
        dispatch(setLogoutSuccess());
        dispatch(setAccountLogout());
        router.push("/");
      } else {
        console.log(new Error());
      }
    } catch (err) {
      console.log("Error during logout", err);
    }
  };
  return (
    <button style={{ width: "100px", height: "20px", display: "inline-block" }} onClick={handleLogout}>
      Logout
    </button>
  );
}
