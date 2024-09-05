import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/database";
import { getDocs, doc, query, setDoc, collection, where } from "firebase/firestore";
import axios from "axios";

export async function GET(req: NextRequest) {
  if (req.method == "POST") {
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
      // authProvider가 google인 경우에 비교
      const userQuery = query(collection(db, "users"), where("authProvider", "==", "google"));
      const getUserInfo = await getDocs(userQuery);
      if (!getUserInfo.empty) {
        const findId = getUserInfo.docs.some(user => user.data().id == userInfo.id);
        const findEmail = getUserInfo.docs.some(user => user.data().email == userInfo.email);
        if (findId || findEmail) {
          return NextResponse.json(
            { message: "기존에 가입된 회원입니다. 로그인 페이지로 이동해주세요" },
            { status: 400 },
          );
        }
      }

      // DB에 구글 소셜 로그인 정보 저장 || pw는 authProvider가 google인 경우 저장하지 않음 - 당연히 조회시에도 구분
      await setDoc(doc(db, "users", `user_${userInfo.id}`), {
        name: userInfo.name,
        email: userInfo.email,
        id: userInfo.id,
        authProvider: "google",
      });

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
}
