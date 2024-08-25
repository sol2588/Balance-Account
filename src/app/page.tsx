"use client";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  contents: string;
}

export default function Home() {
  const router = useRouter();
  const handleLogin = () => {
    router.push("/login");
  };
  const handleSignup = () => {
    router.push("/signup");
  };
  return (
    <div>
      <p>BalanceAccount 회원인 경우</p>
      <button onClick={handleLogin}>로그인</button>
      <p>아직 BalanceAccount 회원이 아닌 경우</p>
      <button onClick={handleSignup}>회원가입</button>
    </div>
  );
}
