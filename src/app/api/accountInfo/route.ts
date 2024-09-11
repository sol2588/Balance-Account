import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/database";
import { getDoc, doc, collection } from "firebase/firestore";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function GET(req: NextRequest) {
  if (req.method == "GET") {
    try {
      const cookieStore = cookies();
      const getUserData = cookieStore.get("refreshToken")?.value;

      if (!getUserData) {
        return NextResponse.json({ message: "Unauthorized, no token" }, { status: 401 });
      }
      const decoded = getUserData ? jwt.verify(getUserData, process.env.PRIVATE_KEY as string) : "";
      const { userId } = decoded as JwtPayload;

      // 계좌정보가 있다면 가져오기
      const accountRef = doc(collection(db, "users", `user_${userId}`, "account"), `account_${userId}`);
      const accountSnapshot = await getDoc(accountRef);
      const accountData = accountSnapshot.data();

      if (!accountData) {
        return NextResponse.json({ message: "계좌를 생성하시기 바랍니다. " }, { status: 400 });
      } else {
        const accountInfo = {
          account: accountData.account,
          balance: accountData.balance,
        };
        return NextResponse.json({ accountInfo }, { status: 200 });
      }
    } catch (err) {
      return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
  }
}
