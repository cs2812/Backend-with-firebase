import { useEffect, useState } from "react";
import { db, ref, get, set, child, onValue } from "../Firebase";
import MessageBox from "./MessageBox";
import Profile from "./Profile";
import { useNavigate, useParams } from "react-router-dom";
import { HiOutlineStatusOffline, HiOutlineStatusOnline } from "react-icons/hi";
import { GetList } from "../Helper/helperFunctions";

export default function Chat() {
  const uid = localStorage.getItem("user");
  const tempImg =
    "https://media.istockphoto.com/id/1298261537/vector/blank-man-profile-head-icon-placeholder.jpg?s=612x612&w=0&k=20&c=CeT1RVWZzQDay4t54ookMaFsdi7ZHVFg2Y5v7hxigCA=";

  const [data, setData] = useState([
    // "myChat",
    // "fromChat",
  ]);
  const [showChat, setShowChat] = useState(false);
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const StartChatting = (id) => {
    navigate(`/chat/${id}`);
  };
  useEffect(() => {
    onValue(ref(db, "users/"), (snapshot) => {
      let data = snapshot.val();
      data = Object.values(data);
      setUserList(data);
    });
  }, []);

  useEffect(() => {
    if (id) {
      setShowChat(true);
    } else {
      setShowChat(false);
    }
    onValue(ref(db, "chat"), (snapshot) => {
      let data = snapshot.val();
      data = Object.values(data);
      let havingChat = data.filter(
        (ele) =>
          (ele.from === +uid && ele.to === +id) ||
          (ele.from === +id && ele.to === +uid)
      );
      havingChat.sort((a, b) => a.cat - b.cat);
      setData(havingChat);
    });
  }, [id]);
  return (
    <div style={{ marginTop: "1px" }}>
      {/* <h3>Firebase Realtime Chat App</h3> */}
      <Profile />
      <div className="chatContainer">
        <div className="useList">
          {userList &&
            userList.map((ele, i) => {
              return (
                <div
                  key={i}
                  onClick={() => StartChatting(ele.uid)}
                  className="ChatUser"
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span className="userImage">
                      <img src={ele.avatar || tempImg} alt="" />
                    </span>
                    <span>{ele.username}</span>
                  </span>
                  <span style={{ marginTop: "6px" }}>
                    {ele.onLine ? (
                      <HiOutlineStatusOnline color="#17c22e" size={"20px"} />
                    ) : (
                      <HiOutlineStatusOffline size={"20px"} color="#FF0000" />
                    )}
                  </span>
                </div>
              );
            })}
        </div>
        <div className="chatBox">
          {!showChat && !data.length ? (
            <div>
              <h3>Welcome to</h3>
              <h1>C-Chat</h1>
            </div>
          ) : (
            <div style={{ marginTop: "5px" }}>
              <MessageBox data={data} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
