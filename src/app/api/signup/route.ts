import { NextRequest, NextResponse } from "next/server";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { cookies } from "next/headers";
import { db } from "@/utils/database";
import bcrypt from "bcrypt";

interface RequestBody {
  userName: string;
  userEmail: string;
  userId: string;
  pw: string;
  pwChk: string;
}

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    // .json() 응답 객체 자체를 받아와 body만 처리
    const { userName, userEmail, userId, pw, pwChk }: RequestBody = await req.json();

    // 유효성1) input을 모두 입력하지 않았을때
    if (!userName || !userEmail || !userId || !pw || !pwChk) {
      return NextResponse.json({ message: "필요한 정보를 모두 입력해주세요" }, { status: 400 });
    }

    // 유효성2) id가 이미 존재할때
    const getUserInfo = await getDocs(collection(db, "users"));
    const userIdExist = (id: string) => {
      return getUserInfo.docs.some(user => user.data().id == id);
    };
    if (userIdExist(userId)) {
      return NextResponse.json({ message: "이미 존재하는 아이디 입니다." }, { status: 405 });
    }
    const userEmailExist = (email: string) => {
      return getUserInfo.docs.some(user => user.data().email == email);
    };
    if (userEmailExist(userEmail)) {
      return NextResponse.json({ message: "이미 존재하는 이메일 입니다." }, { status: 405 });
    }

    // 유효성3) 비밀번호 암호화
    const salt = await bcrypt.genSalt(10);
    const encryptedPW = await bcrypt.hash(pw, salt);

    // 4) db에 user정보 저장
    // const userNum = new Date().getTime().toString();
    await setDoc(doc(db, "users", `user_${userId}`), {
      name: userName,
      email: userEmail,
      id: userId,
      pw: encryptedPW,
      authoProvider: "system",
    });

    return NextResponse.json({ message: "success" });
  }
}
