import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setLogoutSuccess } from "@/lib/actions/userActions";
import { setAccountLogout } from "@/lib/actions/accountActions";
import { RootState } from "@/lib/reducer";

export default function LogoutButton() {
  const dispatch = useDispatch();
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

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
    <>
      {isLoggedIn && (
        <button
          style={{
            width: "100px",
            height: "20px",
            display: "inline-block",
            backgroundColor: "inherit",
            border: "1px solid #f9b179",
            borderRadius: "8px",
            color: "#fff",
            fontSize: "16px",
            margin: 0,
            padding: "10px 20px 30px",
            cursor: "pointer",
          }}
          onClick={handleLogout}
        >
          Logout
        </button>
      )}
    </>
  );
}
