import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateAccess, generateRefresh, refreshVerify } from "@/utils/jwtToken";
import jwt, { JwtPayload } from "jsonwebtoken";

export function GET(req: NextRequest) {
  if (req.method == "GET") {
    try {
      const cookieStore = cookies();
      let refreshToken = cookieStore.get("refreshToken")?.value;

      const decoded = refreshToken ? jwt.verify(refreshToken, process.env.PRIVATE_KEY as string) : "";
      const { userId } = decoded as JwtPayload;
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
