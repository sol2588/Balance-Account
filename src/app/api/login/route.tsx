import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/database";
import { collection, doc, getDoc } from "firebase/firestore";
import bcrypt from "bcrypt";

interface RequestBody {
  userId: string;
  pw: string;
}

export async function POST(req: NextRequest) {
  // 로그인 한 id, pw 값 받아오기
  if (req.method == "POST") {
    const { userId, pw }: RequestBody = await req.json();

    // 1) 아이디 정보가 없는 경우
    const docRef = doc(db, "users", `user_${userId}`);
    const checkUser = await getDoc(docRef);
    if (checkUser.data() == undefined) {
      return NextResponse.json({ message: "존재하지 않는 아이디 입니다." }, { status: 400 });
    }

    // 2) 입력한 비밀번호가 올바르지 않는 경우 - checkUser.data()는 값을 가져오기 때문에 다른방식으로 처리
    const hashedPw = checkUser.exists() ? checkUser.data().pw : undefined;
    const checkHash = await bcrypt.compare(pw, hashedPw);
    console.log(checkHash);
    if (!checkHash) {
      return NextResponse.json({ message: "비밀번호가 일치하지 않습니다." }, { status: 400 });
    }

    // 3) 비밀번호가 일치하는 경우
    if (checkHash) {
      return NextResponse.json({ message: "success" });
    }
  }
}
