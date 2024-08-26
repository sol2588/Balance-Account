import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export function POST(req: NextRequest) {
  if (req.method == "POST") {
    // HttpOnly이기 때문에 브라우저에서는 파기 불가
    return NextResponse.json(
      { message: "로그아웃 되었습니다." },
      { headers: { "Set-Cookie": "refreshToken=; HttpOnly; Path=/; Max-Age=0; SameSite=strict" } },
    );
  } else {
    return NextResponse.json({ message: "Invalid request method" }, { status: 405 });
  }
}
