import { db } from "@/utils/database";
import { collection, doc, getDocs, query, setDoc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  if (req.method == "POST") {
    try {
      const { inputAccount, selected, money, action } = await req.json();
      if (action === "checkAccount") {
        // db에서 계좌 정보 가져오기
        const querySanpshot = await getDocs(collection(db, "accountsInfo"));
        const accountsInfoData = querySanpshot.docs.map(data => data.data());
        // db의 계좌정보가 사용자가 입력한 계좌&은행과 일치하는 지 확인

        const matchedData = accountsInfoData.find(
          data =>
            data.account && data.bank && data.account.replaceAll("-", "") == inputAccount && data.bank == selected,
        );

        // 1) 계좌 & 은행명이 일치하는 경우 : 보낼 금액은 0원
        if (matchedData) {
          const targetData = accountsInfoData.find(data => data.account.replaceAll("-", "") == inputAccount);
          const targetInfo = targetData && {
            targetUser: targetData.owner,
            targetAccount: targetData.account,
            targetBank: targetData.bank,
            targetAmount: "0",
          };
          return NextResponse.json({ ...targetInfo }, { status: 200 });
        }
      } else if (action == "transfer") {
        const cookieStore = cookies();
        const getUserData = cookieStore.get("refreshToken")?.value;

        if (!getUserData) {
          return NextResponse.json({ message: "Unauthozired, no token" }, { status: 400 });
        }
        const decoded = jwt.verify(getUserData, process.env.PRIVATE_KEY as string);
        const { userId } = decoded as JwtPayload;

        const docRef = doc(collection(db, "users", `user_${userId}`, "account"), `account_${userId}`);
        const userAccountInfo = (await getDoc(docRef)).data();
        const originAmount = Number(userAccountInfo?.balance.replaceAll(",", ""));
        const transferMoney = Number(money.replaceAll(",", ""));

        const responseData = {
          ...userAccountInfo,
          balance: (originAmount - transferMoney).toLocaleString("ko-KR"),
        };

        await setDoc(docRef, { ...userAccountInfo, balance: (originAmount - transferMoney).toLocaleString("ko-KR") });
        return NextResponse.json({ responseData }, { status: 200 });
      }

      // 4-2. 클라이언트에서 지인 추가 하기전에 송금한 이력이 없다면

      // 6. 다시 송금을 하겠다고 호출을 하는 경우에 targetAmount의 값을 바꿔주기(지금 아님!)

      return NextResponse.json({ message: "계좌정보가 올바르지 않습니다. 확인하여 입력바랍니다." }, { status: 400 });
    } catch (err) {
      console.error("서버 오류:", err);
      return NextResponse.json({ message: "서버에서 오류가 발생했습니다." }, { status: 500 });
    }
  }
}
