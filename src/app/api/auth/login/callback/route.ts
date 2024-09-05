import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/database";
import { collection, query, getDocs, where } from "firebase/firestore";
import jwt, { JwtPayload } from "jsonwebtoken";
import { generateAccess, generateRefresh, refreshVerify } from "@/utils/jwtToken";
import axios from "axios";
import FormData from "form-data";

export async function POST(req: NextRequest) {
  try {
    const { authCode } = await req.json();
    if (!authCode) {
      return NextResponse.json({ message: "인증 코드가 없습니다." }, { status: 400 });
    }
    // URL 인코딩 : URL에 포함된 데이터는 특별한 문자를 포함하고 있고 공백은 +로 변환됨, 예기못한 방향으로 URL이 변경될 수 있음
    // URLSearchParams로 인코딩 후 toString처리
    const requestBody = {
      code: authCode,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: "postmessage",
      grant_type: "authorization_code",
    };

    const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", requestBody, {
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
    // ! code 분석하는동안 보여줄 페이지 생성 -> google 라이브러리 써서 창 뜨는게 나을듯

    const userQuery = query(collection(db, "users"), where("authProvider", "==", "google"));

    const getUserInfo = await getDocs(userQuery);
    if (getUserInfo.empty) {
      console.log(getUserInfo.docs.map(doc => console.log(doc.data())));
      return NextResponse.json(
        { message: "가입되지 않은 회원입니다. 회원가입 완료 후 로그인바랍니다." },
        { status: 400 },
      );
    } else {
      const idData = getUserInfo.docs.some(user => user.data().email == userInfo.email);
      if (idData) {
        // 존재하는 사용자인 경우 JWT토큰 발행
        const accessGoogleToken = generateAccess(userInfo.userId);
        const refreshGoogleToken = generateRefresh(userInfo.userId);
        return NextResponse.json(
          { accessGoogleToken },
          {
            headers: {
              "Set-cookie": `refreshToken=${refreshGoogleToken}; HttpOnly; Secure; Path=/; Max-Age=1209600; SameSite=Strict`,
            },
          },
        );
      } else {
        return NextResponse.json({ message: "Invalid" }, { status: 400 });
      }
    }
  } catch (err: any) {
    if (err.response) {
      console.error("Response Error Data:", err.response.data);
      console.error("Response Status:", err.response.status);
      console.error("Response Headers:", err.response.headers);
    }
    return NextResponse.json({ message: " Server Error" }, { status: 500 });
  }
}
