import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/database";
import { collection, doc, getDocs, query, setDoc, getDoc, where, limit, orderBy } from "firebase/firestore";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  if (req.method == "GET") {
    try {
      const cookieStore = cookies();
      const getUserData = cookieStore.get("refreshToken")?.value;
      if (!getUserData) {
        return NextResponse.json({ message: "Unauthorized, no token" }, { status: 400 });
      }
      const decoded = getUserData ? jwt.verify(getUserData, process.env.PRIVATE_KEY as string) : "";
      const { userId } = decoded as JwtPayload;

      const recentQuery = query(
        collection(db, "users", `user_${userId}`, "recentTransaction"),
        orderBy("idx", "desc"),
        limit(5),
      );
      const recentSnapshot = await getDocs(recentQuery);
      const recentDatas = recentSnapshot.docs.map(doc => doc.data());

      const friendQuery = query(collection(db, "users", `user_${userId}`, "friends"));
      const friendSnapshot = await getDocs(friendQuery);
      const friendsData = friendSnapshot.docs.map(friend => friend.data());

      if (recentDatas.length == 0 && friendsData.length == 0) {
        return NextResponse.json(
          {
            message: {
              recentMsg: "최근 거래내역이 없습니다. ",
              friendMsg: "추가된 친구가 아직 없습니다.",
            },
          },
          { status: 200 },
        );
      } else if (recentDatas.length == 0) {
        return NextResponse.json(
          { friendsAccountInfo: friendsData, message: { recentMsg: "최근 거래내역이 없습니다. " } },
          { status: 200 },
        );
      } else if (friendsData.length == 0) {
        return NextResponse.json(
          { recentData: recentDatas, message: { friendMsg: "추가된 친구가 아직 없습니다." } },
          { status: 200 },
        );
      } else {
        return NextResponse.json({ recentData: recentDatas, friendsAccountInfo: friendsData }, { status: 200 });
      }
    } catch (err) {
      return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
  }
}

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    try {
      const cookieStore = cookies();
      const getUserData = cookieStore.get("refreshToken")?.value;
      if (!getUserData) {
        return NextResponse.json({ message: "Unauthorized, no token" }, { status: 400 });
      }
      const decoded = getUserData ? jwt.verify(getUserData, process.env.PRIVATE_KEY as string) : "";
      const { userId } = decoded as JwtPayload;

      const { checkList } = await req.json();
      // checkList에 담긴 계좌가 accountsInfo 존재하는지 check하고 data 담기
      if (checkList && checkList.length > 0) {
        const recentQuery = query(collection(db, "accountsInfo"), where("account", "in", checkList));
        const recentSnapshot = await getDocs(recentQuery);
        const accountForFriends = recentSnapshot.docs.map(doc => doc.data());

        for (const account of accountForFriends) {
          const friendRef = doc(collection(db, "users", `user_${userId}`, "friends"), `friends_${account.account}`);
          await setDoc(friendRef, account);
        }

        // 기존 친구 목록 가져오기
        const friendQuery = query(collection(db, "users", `user_${userId}`, "friends"));
        const friendSnapshot = await getDocs(friendQuery);
        const friendsData = friendSnapshot.docs.map(doc => doc.data().account);
        console.log(friendsData);
        for (const friend of friendsData) {
          if (checkList.includes(friend)) {
            return NextResponse.json({ message: "이미 존재하는 친구입니다." }, { status: 400 });
          } else {
            return NextResponse.json({ accountForFriends }, { status: 200 });
          }
        }
      } else {
        return NextResponse.json({ message: "No accounts provided" }, { status: 400 });
      }
    } catch (err) {
      return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
  }
}
