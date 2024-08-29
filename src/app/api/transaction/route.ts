import { db } from "@/utils/database";
import { collection, doc, getDocs, query, setDoc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

type TargetInfo =
  | {
      targetUser: string;
      targetAccount: string;
      targetBank: string;
      targetAmount: string;
      targetStatus: number | undefined;
    }
  | undefined;

export async function POST(req: NextRequest) {
  if (req.method == "POST") {
    try {
      // 1) userId 찾기
      const cookieStore = cookies();
      const getUserData = cookieStore.get("refreshToken")?.value;
      const decoded = getUserData ? jwt.verify(getUserData, process.env.PRIVATE_KEY as string) : "";
      const { userId } = decoded as JwtPayload;

      // 2) 사용자의 최근 송금 내역 조회
      const q = query(collection(db, "users", `user_${userId}`, "recentTransaction"));
      const querySnapshot = await getDocs(q);
      const recentData = querySnapshot.docs.map(doc => doc.data());

      const { extractAccount, selected, targetInfo, money, action } = await req.json();
      if (action === "checkAccount") {
        // db에서 계좌 정보 가져오기
        const querySanpshot = await getDocs(collection(db, "accountsInfo"));
        const accountsInfoData = querySanpshot.docs.map(data => data.data());
        console.log(extractAccount);

        // db의 계좌정보가 사용자가 입력한 계좌&은행과 일치하는 지 확인
        const matchedData = accountsInfoData.find(
          data =>
            data.account && data.bank && data.account.replaceAll("-", "") == extractAccount && data.bank == selected,
        );
        // 3) 계좌 & 은행명이 일치하는 경우 : 보낼 금액은 0원
        if (matchedData) {
          // const targetData = accountsInfoData.find(data => data.account.replaceAll("-", "") == extractAccount);

          let updateTargetInfo: TargetInfo = {
            targetUser: matchedData.owner,
            targetAccount: matchedData.account,
            targetBank: matchedData.bank,
            targetAmount: "0",
            targetStatus: 0,
          };

          // 4) 송금하려는 계좌와 일치하는 최근 송금 데이터를 배열로 받아오기 : 기존거래가 있는 경우 targetStatus 갱신
          const findTargetAccount = recentData.filter(data => data.account.replaceAll("-", "") == extractAccount);
          if (!querySnapshot.empty && updateTargetInfo) {
            updateTargetInfo = { ...updateTargetInfo, targetStatus: findTargetAccount.length };
          }

          // 5) 사용자의 지인(friend) 내역 가져오기

          return NextResponse.json({ ...updateTargetInfo }, { status: 200 });
        }
      } else if (action == "transfer") {
        if (!getUserData) {
          return NextResponse.json({ message: "Unauthorized, no token" }, { status: 400 });
        }

        // 본인 계좌 account db의 balance 갱신
        const docRef = doc(collection(db, "users", `user_${userId}`, "account"), `account_${userId}`);
        const userAccountInfo = (await getDoc(docRef)).data();
        const originAmount = Number(userAccountInfo?.balance.replaceAll(",", ""));
        const transferMoney = Number(money.replaceAll(",", ""));

        const responseData = {
          ...userAccountInfo,
          balance: (originAmount - transferMoney).toLocaleString("ko-KR"),
        };
        await setDoc(docRef, {
          ...userAccountInfo,
          balance: (originAmount - transferMoney).toLocaleString("ko-KR"),
        });

        // 송금할때 마다 최근 송금내역 저장(recentTransaction db 추가)
        const num = recentData.length + 1;

        const recentRef = doc(collection(db, "users", `user_${userId}`, "recentTransaction"), `recent_${num}`);
        await setDoc(recentRef, {
          idx: num,
          date: new Date(),
          account: targetInfo.account,
          name: targetInfo.receiver,
          bank: targetInfo.bank,
          sendMoney: money,
        });

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
