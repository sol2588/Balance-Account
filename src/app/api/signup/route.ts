import { NextRequest, NextResponse } from "next/server";
import { collection, doc, getDoc, getDocs, setDoc, query, where } from "firebase/firestore";
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

    // 유효성2) id, email이 이미 존재할때
    const userDocRef = doc(db, "users", `user_${userId}`);
    const userDoc = await getDoc(userDocRef);
    // userId가 존재하는 경우
    if (userDoc.exists()) {
      return NextResponse.json({ message: "이미 존재하는 아이디 입니다." }, { status: 405 });
    }
    const userEmailQuery = query(collection(db, "users"), where("email", "==", userEmail));
    const userEmailSnapshot = await getDocs(userEmailQuery);
    // userEmail이 존재하는 경우
    if (!userEmailSnapshot.empty) {
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
