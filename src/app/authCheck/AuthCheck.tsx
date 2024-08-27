import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/reducer";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AuthCheck() {
  const router = useRouter();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  console.log(isLoggedIn);
  useEffect(() => {
    async function tokenRefresher() {
      if (!isLoggedIn) {
        router.push("/login");
      }
      try {
        const response = await axios.get("/api/auth");
        localStorage.setItem("accessToken", response.data.accessToken);
      } catch (err) {
        console.log(err);
      }
    }

    const clearId = setInterval(tokenRefresher, 3600000 - 10000);
    tokenRefresher();

    return () => clearInterval(clearId);
  }, [isLoggedIn]);
  return null;
}
