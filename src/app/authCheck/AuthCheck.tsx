import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/reducer";
import { useRouter, usePathname } from "next/navigation";

export default function AuthCheck() {
  const router = useRouter();
  const pathname = usePathname();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  console.log(isLoggedIn);

  useEffect(() => {
    if (pathname != "/signup" && !isLoggedIn) {
      router.push("/login");
      return;
    }
  }, [isLoggedIn, pathname, router]);
  return null;
}
