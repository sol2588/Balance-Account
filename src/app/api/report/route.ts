import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/database";
import { getDoc, getDocs, collection, query, where } from "firebase/firestore";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  console.log("???");
  if (req.method == "GET") {
    try {
      const cookieStore = cookies();
      const getUserData = cookieStore.get("refreshToken")?.value;
      if (!getUserData) {
        return NextResponse.json({ message: "Unauthorization, no token" }, { status: 400 });
      }

      const decode = getUserData ? jwt.verify(getUserData, process.env.PRIVATE_KEY as string) : "";
      const { userId } = decode as JwtPayload;

      const recentSnapshot = await getDocs(collection(db, "users", `user_${userId}`, "recentTransaction"));
      if (recentSnapshot.empty) {
        return NextResponse.json({ message: "최근 거래내역이 존재하지 않습니다." }, { status: 200 });
      }
      const recentTransaction = recentSnapshot.docs.map(doc => doc.data());
      console.log(recentTransaction);
      return NextResponse.json({ recentTransaction }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: "Error on Method" }, { status: 405 });
  }
}
