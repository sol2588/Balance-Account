import { db } from "@/utils/database";
import { collection, doc, getDocs, query, setDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method == "POST") {
    try {
      const { inputAccount, selected } = await req.json();
      // db에서 계좌 정보 가져오기
      const querySanpshot = await getDocs(collection(db, "accountsInfo"));
      const accountsInfoData = querySanpshot.docs.map(data => data.data());
      // db의 계좌정보가 사용자가 입력한 계좌&은행과 일치하는 지 확인
      const findAccount = accountsInfoData.some(data => data.account.replaceAll("-", "") == inputAccount);
      const findBank = accountsInfoData.some(data => data.bank == selected);

      // 1) 계좌 & 은행명이 일치하는 경우 : 보낼 금액은 0원
      if (findAccount && findBank) {
        const targetData = accountsInfoData.find(data => data.account.replaceAll("-", "") == inputAccount);
        const targetInfo = targetData && {
          targetUser: targetData.owner,
          targetAccount: targetData.account,
          targetBank: targetData.bank,
          targetAmount: "0",
        };
        return NextResponse.json({ ...targetInfo }, { status: 200 });
      } else {
        return NextResponse.json({ message: "계좌정보가 올바르지 않습니다. 확인하여 입력바랍니다." }, { status: 400 });
      }

      // 4-1. 클라이언트에서는 보내준 사람이름 사용해서 누구에게 보내는건지 확인
      // 4-2. 클라이언트에서 지인 추가 하기전에 송금한 이력이 없다면
      // 5. 단, targetAmount는 일단 빈값 즉 "0"으로 내보내ㅣㄱ
      // 6. 다시 송금을 하겠다고 호출을 하는 경우에 targetAmount의 값을 바꿔주기(지금 아님!)

      // db에 있는 데이터와 일치하는 겨우
    } catch (err) {
      return NextResponse.json({ message: "서버에서 오류가 발생했습니다." }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: "허용되지 않는 메서드 입니다." }, { status: 400 });
  }
}
