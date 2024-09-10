import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const withAuthAccount = WrappedComponent => {
  return props => {
    const router = useRouter();
    let accountInfo = "";

    useEffect(() => {
      if (!accountInfo) {
        router.push("/createAccount");
      } else {
        return;
      }
    }, []);
    return <WrappedComponent {...props} />;
  };
};
export default withAuthAccount;
