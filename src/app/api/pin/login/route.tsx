import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/database";
import { where, query, collection, getDocs } from "firebase/firestore";

export async function POST(req: NextRequest) {
  if (req.method == "POST") {
    const { pinPw } = await req.json();

    try {
      const userQuery = query(collection(db, "users"), where("pinNum", "==", pinPw));
      const getUsers = await getDocs(userQuery);

      if (!getUsers.empty) {
        return NextResponse.json({ message: " 로그인 성공" }, { status: 200 });
      } else {
        return NextResponse.json({ messgae: "비밀번호가 일치하지 않습니다." }, { status: 400 });
      }
    } catch (err) {
      return NextResponse.json({ message: "server error" }, { status: 500 });
    }
  }
}
