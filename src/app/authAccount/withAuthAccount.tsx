import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/reducer";

const withAuthAccount = (WrappedComponent: () => JSX.Element) => (props: any) => {
  const selector = useSelector((state: RootState) => state.account);
  console.log("selector 반환값 확인", selector, selector.created);
  const router = useRouter();

  useEffect(() => {
    if (!selector) {
      router.push("/createAccount");
    }
  }, []);
  return <WrappedComponent {...props} />;
};
export default withAuthAccount;
