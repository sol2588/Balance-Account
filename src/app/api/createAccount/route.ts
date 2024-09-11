import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/database";
import { getDocs, getDoc, collection, setDoc, doc, query } from "firebase/firestore";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  if (req.method == "GET") {
    // 계좌 생성 로직
    const account = () => {
      const middle = new Date().getTime().toString().substr(7);
      const end = Math.floor(Math.random() * 1000);
      return `110-${middle}-${end}`;
    };

    try {
      // ! 토큰으로 userId 찾기 : 모듈화?
      const cookieStore = cookies();
      const token = cookieStore.get("refreshToken")?.value;
      const decoded = token ? jwt.verify(token, process.env.PRIVATE_KEY as string) : "";
      const { userId } = decoded as JwtPayload;

      // 1) 계좌존재 여부 확인
      const userDoc = doc(collection(db, "users", `user_${userId}`, "account"), `account_${userId}`);
      const userSnapshot = await getDoc(userDoc);
      const accountRef = userSnapshot.data();

      console.log(accountRef);
      // 1-1) 계좌존재하는 경우
      if (accountRef) {
        const accountData = {
          message: "Account has already created",
          account: accountRef.account,
          balance: accountRef.balance,
        };
        return NextResponse.json(accountData, { status: 400 });
      }

      // 1-2) 계좌신규 개설인 경우 user의 db에 독립된 doc 추가
      const docRef = doc(collection(db, "users", `user_${userId}`, "account"), `account_${userId}`);
      await setDoc(docRef, { account: account(), balance: "0" });
      return NextResponse.json(
        { account: account(), balance: "0", message: "계좌 생성이 완료되었습니다. 메인페이지로 이동해주세요" },
        { status: 200 },
      );
    } catch (err) {
      console.log(err);
      return NextResponse.json({ message: "Error on CreateAccount" }, { status: 400 });
    }
  }
}
