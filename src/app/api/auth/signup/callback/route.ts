import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ message: "인증되지 않은 User입니다." }, { status: 400 });
    }

    const requestBody = {
      code: code,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_SIGNUP_REDIRECT_URI!,
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

    const userInfoResponse = await axios.get("https://www.googleapis.com/userinfo/v2/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });
    const userInfo = userInfoResponse.data;

    return NextResponse.json({ tokenData, userInfo }, { status: 200 });
  } catch (err: any) {
    if (err.response) {
      console.error("Response Error Data:", err.response.data);
      console.error("Response Status:", err.response.status);
      console.error("Response Headers:", err.response.headers);
    }
    return NextResponse.json({ mesaage: "server error" }, { status: 500 });
  }
}
