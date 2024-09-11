"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { modalOpen } from "@/lib/actions/modalActions";
import { RootState } from "@/lib/reducer";
import { Timestamp } from "firebase/firestore";
import Modal from "../common/modal/Modal";
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

// ! friends  redux  도입 + 친구 삭제 기능 필요
export default function FriendComponent() {
  const dispatch = useDispatch();
  const modalSelector = useSelector((state: RootState) => state.modal.isOpen);
  const [recentData, setRecentData] = useState<RecentProps[]>([]);
  const [friends, setFriends] = useState<FriendsProps[]>([]);
  const [checkList, setCheckList] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/friends");
        if (response.status == 200) {
          setRecentData(response.data.recentData || []);
          setFriends(response.data.friendsAccountInfo || []);
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
        dispatch(modalOpen({ isOpen: true, title: "친구가 추가되었습니다." }));
      } else {
        dispatch(modalOpen({ isOpen: true, title: "친구 추가 실패, 다시 시도하시기 바랍니다." }));
      }
    } catch (err: any) {
      console.log(err);
      dispatch(modalOpen({ isOpen: true, title: err.response.data.message }));
    }
  };

  return (
    <section className={styles.friendsContainer}>
      <div className={styles.addFriends}>
        <header>
          <h3 className={styles.friendsTitle}>Friends</h3>
        </header>
        <div className={styles.recentHistory}>
          <h4 className={styles.recentTitle}>최근 거래내역</h4>
          {recentData.length > 0 ? (
            <>
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
              <button
                type="button"
                className={styles.submitBtn}
                disabled={checkList.length == 0}
                onClick={handleSubmit}
              >
                친구 추가하기
              </button>
              {modalSelector && <Modal />}
            </>
          ) : (
            <div className={styles.informMessage}>최근 거래 내역이 없습니다.</div>
          )}
        </div>
      </div>
      <div className={styles.freindsList}>
        <header>
          <h3 className={styles.friendsListTitile}>친구 목록</h3>
        </header>
        <div className={styles.showFriends}>
          {friends.length > 0 ? (
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
          ) : (
            <div className={styles.informMessage}>친구 목록이 없습니다.</div>
          )}
        </div>
      </div>
    </section>
  );
}
