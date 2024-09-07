import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/database";
import { where, query, collection, getDocs } from "firebase/firestore";
import { generateAccess, generateRefresh } from "@/utils/jwtToken";

export async function POST(req: NextRequest) {
  if (req.method == "POST") {
    const { pinPw, userId } = await req.json();

    try {
      const userQuery = query(collection(db, "users"), where("pinNum", "==", pinPw));
      const getUsers = await getDocs(userQuery);

      if (!getUsers.empty) {
        const matchedUser = getUsers.docs[0].data().id == userId;
        const token = generateAccess(userId);
        const refreshToken = generateRefresh(userId);
        if (matchedUser) {
          return NextResponse.json(
            { token },
            {
              headers: {
                "Set-Cookie": `refreshToken=${refreshToken}; HttpOnly; Secure; Path=/; Max-Age=1209600; SameSite=Strict`,
              },
            },
          );
        } else {
          return NextResponse.json({ messgae: "비밀번호가 일치하지 않습니다." }, { status: 400 });
        }
      } else {
        return NextResponse.json({ message: "PIN번호를 설정하지 않았습니다. 설정후 이용바랍니다." }, { status: 200 });
      }
    } catch (err) {
      return NextResponse.json({ message: "server error" }, { status: 500 });
    }
  }
}
