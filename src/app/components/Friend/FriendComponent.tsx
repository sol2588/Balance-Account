"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Timestamp } from "firebase/firestore";
import styles from "./FriendComponent.module.css";
import axios from "axios";

interface RecentProps {
  idx: number;
  account: string;
  bank: string;
  name: string;
  date: Timestamp;
  sendMoney: string;
}
interface FriendsProps {
  owner: string;
  account: string;
  bank: string;
}

// ! msg : 기존에 있던 친구 / 최근 거래 내역이 없는 경우 / 친구 목록이 없는 경우
export default function FriendComponent() {
  const [recentData, setRecentData] = useState<RecentProps[]>([]);
  const [checkList, setCheckList] = useState<string[]>([]);
  const [friends, setFriends] = useState<FriendsProps[]>([]);

  // friends 정보도 받아와야함
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/friends");
        if (response.status == 200) {
          setRecentData(response.data.recentData);
          setFriends(response.data.friendsAccountInfo);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const handleCheck = (e: ChangeEvent<HTMLInputElement>, value: string) => {
    if (e.target.checked) {
      setCheckList(prev => [...prev, value]);
    } else {
      setCheckList(prev => prev.filter(item => item != value));
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/friends", { checkList });
      if (response.status == 200) {
        setFriends(prev => [...prev, response.data.friendsAccountInfo]);
        alert("친구가 추가되었습니다.");
      } else {
        alert("친구 추가 실패, 다시 시도하시기 바랍니다.");
      }
    } catch (err) {
      console.log(err);
    }
  };
  console.log(friends);
  return (
    <section className={styles.friendsContainer}>
      <div className={styles.addFriends}>
        <header>
          <h3 className={styles.friendsTitle}>Friends</h3>
        </header>
        <div className={styles.recentHistory}>
          <h4 className={styles.recentTitle}>최근 거래내역</h4>

          <table className={styles.recentTable}>
            <thead>
              <tr className={styles.recentTableRow}>
                <th>선택</th>
                <th>이름</th>
                <th>은행</th>
                <th>계좌</th>
                <th>금액</th>
              </tr>
            </thead>
            <tbody>
              {recentData.map(item => (
                <tr key={item.idx} className={styles.recentTableRow}>
                  <td>
                    <input
                      type="checkbox"
                      id={`${item.idx}`}
                      checked={checkList.includes(item.account)}
                      onChange={e => handleCheck(e, item.account)}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.bank}</td>
                  <td>{item.account}</td>
                  <td>{item.sendMoney}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className={styles.submitBtn} disabled={checkList.length == 0} onClick={handleSubmit}>
            친구 추가하기
          </button>
        </div>
      </div>
      <div className={styles.freindsList}>
        <header>
          <h3 className={styles.friendsListTitile}>친구 목록</h3>
        </header>
        <div className={styles.showFriends}>
          {friends.length > 0 && (
            <table className={styles.recentTable}>
              <thead>
                <tr className={styles.recentTableRow}>
                  <th>이름</th>
                  <th>은행</th>
                  <th>계좌</th>
                </tr>
              </thead>
              <tbody>
                {friends.map((item, idx) => (
                  <tr key={idx} className={styles.recentTableRow}>
                    <td>{item?.owner}</td>
                    <td>{item?.bank}</td>
                    <td>{item?.account}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}
