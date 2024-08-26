import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { accessVerify, generateAccess, generateRefresh, refreshVerify } from "@/utills/jwtToken";
import { db } from "@/utills/database";
import { Jwt } from "jsonwebtoken";

export function GET(req: NextRequest) {
  if (req.method == "GET") {
    try {
      // ! refresh 토큰이 반환하는 값 확인
      const cookieStore = cookies();
      let refreshToken = cookieStore.get("refreshToken")?.value;

      // ! db에서 userId 가져와야해
      const userId = "1";
      const accessToken = generateAccess(userId);
      if (refreshToken && refreshVerify(refreshToken)) {
        return NextResponse.json({ userId, accessToken });
      } else {
        refreshToken = generateRefresh(userId);
        return NextResponse.json(
          { userId, accessToken },
          {
            status: 200,
            headers: {
              "Set-Cookie": `refreshToken=${refreshToken}; HttpOnly; Secure; Path=/; Max-Age=1209600; SameSite=Strict`,
            },
          },
        );
      }
    } catch (err) {
      return NextResponse.json({ error: "Method Not allowed" }, { status: 405 });
    }
  }
}
