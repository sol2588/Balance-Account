import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/database";
import { collection, query, getDocs, where } from "firebase/firestore";
import { generateAccess, generateRefresh, refreshVerify } from "@/utils/jwtToken";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { authCode } = await req.json();
    if (!authCode) {
      return NextResponse.json({ message: "인증 코드가 없습니다." }, { status: 400 });
    }

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
    const userInfoResponse = await axios.get("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userInfo = userInfoResponse.data;
    const userQuery = query(collection(db, "users"), where("authProvider", "==", "google"));
    const getUserInfo = await getDocs(userQuery);
    // 1) 데이터가 없는 경우 : 회원이 존재하지 않음 -> 회원가입 안내
    if (getUserInfo.empty) {
      // console.log(getUserInfo.docs.map(doc => console.log(doc.data())));
      return NextResponse.json(
        { message: "가입되지 않은 회원입니다. 회원가입 완료 후 로그인바랍니다." },
        { status: 400 },
      );
    } else {
      const matchedUser = getUserInfo.docs.find(user => user.data().email === userInfo.email);
      // 2) 존재하는 사용자인 경우 : JWT토큰 발행
      if (matchedUser) {
        const accessToken = generateAccess(userInfo.userId);
        const refreshToken = generateRefresh(userInfo.userId);

        // console.log(matchedUser.data());
        const pinExist = matchedUser.data().pinNum ? true : false;
        const name = matchedUser.data().name;
        const userId = userInfo.id;

        return NextResponse.json(
          { accessToken, pinExist, name, userId },
          {
            headers: {
              "Set-cookie": `refreshToken=${refreshToken}; HttpOnly; Secure; Path=/; Max-Age=1209600; SameSite=Strict`,
            },
          },
        );
        // 3) 존재하지 않는 사용자의 경우 : 회원가입 안내
      } else {
        return NextResponse.json(
          { message: "가입되지 않은 사용자 입니다. 회원가입 후 로그인바랍니다." },
          { status: 400 },
        );
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
