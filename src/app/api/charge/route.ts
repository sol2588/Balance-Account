import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/database";
import { query, doc, setDoc, getDocs, collection } from "firebase/firestore";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  if (req.method == "POST") {
    const cookieStore = cookies();
    const getUserData = cookieStore.get("refreshToken")?.value;

    if (!getUserData) {
      return NextResponse.json({ message: "Unauthozired, no token" }, { status: 400 });
    }
    const decoded = jwt.verify(getUserData, process.env.PRIVATE_KEY as string);
    const { userId } = decoded as JwtPayload;

    const { chargeAmount } = await req.json();

    try {
      const q = query(collection(db, "users", `user_${userId}`, "account"));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return NextResponse.json({ message: "Account info doesn't exist" }, { status: 404 });
      }

      const target = querySnapshot.docs.map(doc => doc.data());
      const targetData = target[0];

      let balanceValue = Number(targetData.balance.replaceAll(",", ""));
      let chargeVale = Number(chargeAmount.replaceAll(",", ""));

      let updateBalance = (balanceValue + chargeVale).toLocaleString("ko-KR");
      const docRef = doc(collection(db, "users", `user_${userId}`, "account"), `account_${userId}`);
      await setDoc(docRef, { ...targetData, balance: updateBalance });

      return NextResponse.json({ updateBalance }, { status: 200 });
    } catch (err) {
      console.error("Error updating balance", err);
      return NextResponse.json({ message: "Error on change balance" }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: "Method not allowed" }, { status: 400 });
  }
}
