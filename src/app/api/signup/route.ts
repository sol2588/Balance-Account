import { NextRequest, NextResponse } from "next/server";
import { addDoc, collection, query, where, getDocs, setDoc, doc, getDoc, getCountFromServer } from "firebase/firestore";
import { db } from "@/utils/database";

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method === "POST") {
    // .json() 응답 객체 자체를 받아와 body만 처리
    const { userName, userId, pw, pwChk } = await req.json();

    // if (!userName || !userId || !pw || !pwChk) {
    //   return res.status(400).send("필요한 정보를 모두 입력해주세요");
    // }

    const addUser = await setDoc(doc(db, "users", "user"), {
      name: userName,
      id: userId,
      pw: pw,
    });

    const getUserInfo = await getDocs(collection(db, "users"));
    const usersNum = getCountFromServer(collection(db, "users"));
    console.log(usersNum.data());
    getUserInfo.forEach(user => {
      // if (user.data().id == userId) {
      //   return res.send("이미 존재하는 아이디 입니다.");
      // }
    });

    // const docRef = doc(db, "users");
    // const usersRef = await getDoc(docRef);

    return NextResponse.json({ message: "success" });
  }
}
