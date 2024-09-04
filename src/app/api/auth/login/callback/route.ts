import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { request } from "http";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ message: "인증되지 않은 User 입니다." }, { status: 400 });
    }
    // URL 인코딩 : URL에 포함된 데이터는 특별한 문자를 포함하고 있고 공백은 +로 변환됨, 예기못한 방향으로 URL이 변경될 수 있음
    // URLSearchParams로 인코딩 후 toString처리
    const requestBody = {
      code: code,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_LOGIN_REDIRECT_URI!,
      grant_type: "authorization_code",
      access_type: "offline",
    };
    const sendData = new URLSearchParams(requestBody).toString();

    const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", sendData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const tokenData = tokenResponse.data;
    console.log("**tokenData:       ", tokenData);

    const userInfoResponse = await axios.get("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userInfo = userInfoResponse.data;
    console.log("&&userInfo:        ", userInfo);
    // ! code 분석하는동안 보여줄 페이지
    return NextResponse.json({ tokenData, userInfo }, { status: 200 });
  } catch (err: any) {
    if (err.response) {
      console.error("Response Error Data:", err.response.data);
      console.error("Response Status:", err.response.status);
      console.error("Response Headers:", err.response.headers);
    }
    return NextResponse.json({ message: " Server Error" }, { status: 500 });
  }
}
