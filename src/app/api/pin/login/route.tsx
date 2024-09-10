import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/database";
import { where, doc, getDoc, query, collection, getDocs } from "firebase/firestore";
import { generateAccess, generateRefresh } from "@/utils/jwtToken";

export async function POST(req: NextRequest) {
  if (req.method == "POST") {
    const { pinPw, userId } = await req.json();

    try {
      // 1. userId와 일치하는 데이터가 존재하는지 확인
      const userDocRef = doc(db, "users", `user_${userId}`);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();
      console.log(userDoc.data());

      if (!userData) {
        return NextResponse.json({ message: "존재하지 않는 계정입니다." }, { status: 400 });
      }

      // 2. userId는 존재 && pinNum이 존재하지 않는 경우
      if (!userData.pinNum) {
        return NextResponse.json(
          { message: "간편 비밀번호를 설정하지 않았습니다. 설정 후 이용바랍니다." },
          { status: 400 },
        );
      }

      // 3. userId 존재 && pinNum이 틀린 경우
      if (userData.pinNum != pinPw) {
        return NextResponse.json({ message: "간편 비밀번호가 틀렸습니다. 확인후 다시 입력바랍니다." }, { status: 400 });
      }
      // 4. 일치하는 경우
      if (userData.id == userId && userData.pinNum == pinPw) {
        const token = generateAccess(userId);
        const refreshToken = generateRefresh(userId);
        const name = userData.name;

        return NextResponse.json(
          { token, name, userId },
          {
            headers: {
              "Set-Cookie": `refreshToken=${refreshToken}; HttpOnly; Secure; Path=/; Max-Age=1209600; SameSite=Strict`,
            },
          },
        );
      }
    } catch (err) {
      return NextResponse.json({ message: "server error" }, { status: 500 });
    }
  }
}
