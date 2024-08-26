import { NextRequest, NextResponse } from "next/server";
import { generateAccess, generateRefresh, accessVerify, refreshVerify } from "@/utils/jwtToken";
import { db } from "@/utils/database";
import { doc, getDoc } from "firebase/firestore";
import bcrypt from "bcrypt";

interface RequestBody {
  userId: string;
  pw: string;
}
export async function POST(req: NextRequest) {
  if (req.method == "POST") {
    const { userId, pw }: RequestBody = await req.json();
    // 1) 아이디 정보가 없는 경우
    const docRef = doc(db, "users", `user_${userId}`);
    const checkUser = await getDoc(docRef);
    if (!checkUser.exists()) {
      return NextResponse.json({ message: "존재하지 않는 계정 입니다." }, { status: 400 });
    }
    // 2) 입력한 비밀번호가 올바르지 않는 경우 - checkUser.data()는 값을 가져오기 때문에 boolean 처리 방식으로 exists()
    const hashedPw = checkUser.exists() ? checkUser.data().pw : undefined;
    const checkHash = await bcrypt.compare(pw, hashedPw);
    if (!checkHash) {
      return NextResponse.json({ message: "비밀번호가 일치하지 않습니다." }, { status: 400 });
    }
    // 3) 아이디 또는 비밀번호 미입력
    if (!userId || !pw) {
      return NextResponse.json({ message: "아이디 또는 비밀번호를 입력하세요" }, { status: 400 });
    }

    // 4) 회원인 경우 : token 생성하여 access는 쿠키에 refresh는 headers에 저장
    if (checkUser.exists() && checkHash) {
      const token = generateAccess(userId);
      const refreshToken = generateRefresh(userId);

      // 첫번째 인자로 json data, 두번째 인자로 옵션객체
      // 리프레시 토큰을 headers에 담고 access를 return
      return NextResponse.json(
        { token },
        {
          headers: {
            "Set-Cookie": `refreshToken=${refreshToken}; HttpOnly; Secure; Path=/; Max-Age=1209600; SameSite=Strict`,
          },
        },
      );
    } else {
      return NextResponse.json({ message: "Invalid credential" }, { status: 400 });
    }
  }
}
