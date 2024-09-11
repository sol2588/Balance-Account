import { db } from "@/utils/database";
import { collection, doc, getDocs, query, setDoc, getDoc, where } from "firebase/firestore";
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
      targetPurpose: string;
    }
  | undefined;

export async function POST(req: NextRequest) {
  if (req.method == "POST") {
    try {
      // 1) userId 찾기
      const cookieStore = cookies();
      const getUserData = cookieStore.get("refreshToken")?.value;

      if (!getUserData) {
        return NextResponse.json({ message: "Unauthorized, no token" }, { status: 400 });
      }
      const decoded = getUserData ? jwt.verify(getUserData, process.env.PRIVATE_KEY as string) : "";
      const { userId } = decoded as JwtPayload;

      const { extractAccount, bankSelected, receiverData, money, action, purpose } = await req.json();

      if (action === "checkAccount") {
        // 2) db에서 계좌 정보 가져오기 - where로 필터링(사용자가 입력한 계좌&은행과 일치하는 지 확인)
        const accountsQuery = query(
          collection(db, "accountsInfo"),
          where("account", "==", extractAccount),
          where("bank", "==", bankSelected),
        );
        const accountsSnapshot = await getDocs(accountsQuery);
        const matchedData = accountsSnapshot.docs.map(doc => doc.data()).find(data => data.account == extractAccount);

        if (matchedData) {
          let updateTargetInfo: TargetInfo = {
            targetUser: matchedData.owner,
            targetAccount: matchedData.account,
            targetBank: matchedData.bank,
            targetAmount: "0",
            targetStatus: 0,
            targetPurpose: purpose,
          };

          // 3) 송금하려는 계좌와 일치하는 최근 송금 데이터의 사이즈 : 기존거래가 있는 경우 targetStatus 갱신
          const recentQuery = query(
            collection(db, "users", `user_${userId}`, "recentTransaction"),
            where("account", "==", extractAccount),
          );
          const recentSnapshot = await getDocs(recentQuery);
          // 문서가 있는 경우, 문서 수를 계산하여 targetStatus 갱신
          if (!recentSnapshot.empty) {
            updateTargetInfo.targetStatus = recentSnapshot.size + 1;
          }
          return NextResponse.json({ ...updateTargetInfo, message: "계좌가 확인되었습니다." }, { status: 200 });
        } else {
          return NextResponse.json(
            { message: "계좌정보가 올바르지 않습니다. 확인하여 입력바랍니다." },
            { status: 400 },
          );
        }
      } else if (action == "transfer") {
        // 본인 계좌 account db의 balance 가져오기
        const userDocRef = doc(collection(db, "users", `user_${userId}`, "account"), `account_${userId}`);
        const userDoc = await getDoc(userDocRef);
        const userAccountInfo = userDoc.data();

        if (!userAccountInfo) {
          return NextResponse.json({ message: "Account not found" }, { status: 404 });
        }

        const currentAmount = Number(userAccountInfo?.balance.replaceAll(",", ""));
        const transferMoney = Number(money.replaceAll(",", ""));

        await setDoc(userDocRef, {
          ...userAccountInfo,
          balance: (currentAmount - transferMoney).toLocaleString("ko-KR"),
        });

        // 송금할때 마다 최근 송금내역 저장(recentTransaction db 추가)
        const recentQuery = query(collection(db, "users", `user_${userId}`, "recentTransaction"));
        const recentSnapshot = await getDocs(recentQuery);
        const num = recentSnapshot.size + 1;

        const recentRef = doc(collection(db, "users", `user_${userId}`, "recentTransaction"), `recent_${num}`);
        await setDoc(recentRef, {
          idx: num,
          date: new Date(),
          account: receiverData.account,
          name: receiverData.receiver,
          bank: receiverData.bank,
          sendMoney: money,
          purpose: purpose,
        });

        return NextResponse.json(
          {
            responseData: {
              ...userAccountInfo,
              balance: (currentAmount - transferMoney).toLocaleString("ko-KR"),
            },
          },
          { status: 200 },
        );
      }

      // 6. 다시 송금을 하겠다고 호출을 하는 경우에 targetAmount의 값을 바꿔주기(지금 아님!)

      return NextResponse.json({ message: "계좌정보가 올바르지 않습니다. 확인하여 입력바랍니다." }, { status: 400 });
    } catch (err) {
      console.error("서버 오류:", err);
      return NextResponse.json({ message: "서버에서 오류가 발생했습니다." }, { status: 500 });
    }
  }
}
``;
