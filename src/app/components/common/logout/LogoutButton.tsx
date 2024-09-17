import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setLogoutSuccess } from "@/lib/actions/userActions";
import { setAccountLogout } from "@/lib/actions/accountActions";
import { RootState } from "@/lib/reducer";
import { FiLogOut } from "react-icons/fi";
import styles from "./LogoutButton.module.css";

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
        <button className={styles.button} onClick={handleLogout}>
          <FiLogOut />
        </button>
      )}
    </>
  );
}
