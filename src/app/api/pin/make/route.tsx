import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/database";
import { doc, updateDoc } from "firebase/firestore";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  if (req.method == "POST") {
    const cookieStore = cookies();
    let getUserData = cookieStore.get("refreshToken")?.value;

    if (!getUserData) {
      return NextResponse.json({ message: "Unauthozired, no token" }, { status: 400 });
    }
    const decoded = jwt.verify(getUserData, process.env.PRIVATE_KEY as string);
    const { userId } = decoded as JwtPayload;

    const { pin } = await req.json();
    const userRef = doc(db, "users", `user_${userId}`);

    try {
      await updateDoc(userRef, {
        pinNum: pin,
      });
      return NextResponse.json({ message: "PIN이 저장되었습니다." }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: "server error" }, { status: 500 });
    }
  }
}
