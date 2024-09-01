import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/database";
import { collection, doc, getDocs, query, setDoc, getDoc, where, limit, orderBy } from "firebase/firestore";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  if (req.method == "GET") {
    try {
      const cookieStore = cookies();
      const getUserData = cookieStore.get("refreshToken")?.value;
      if (!getUserData) {
        return NextResponse.json({ message: "Unauthorized, no token" }, { status: 400 });
      }
      const decoded = getUserData ? jwt.verify(getUserData, process.env.PRIVATE_KEY as string) : "";
      const { userId } = decoded as JwtPayload;

      const transactionRef = query(collection(db, "users", `user_${userId}`, "recentTransaction"));
      const transactionSnapshot = await getDocs(transactionRef);

      const allTransactionData = transactionSnapshot.docs.map(doc => doc.data());

      if (allTransactionData.length > 0) {
        return NextResponse.json({ allTransactionData }, { status: 200 });
      } else {
        return NextResponse.json({ message: "최근 거래내역이 없네요" }, { status: 200 });
      }
    } catch (err) {
      return NextResponse.json({ message: "server error" }, { status: 500 });
    }
  }
}
