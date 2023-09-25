import { useEffect, useState } from "react";
import { db, ref, get, set, child, onValue } from "../Firebase";
import MessageBox from "./MessageBox";
import Profile from "./Profile";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { HiOutlineStatusOffline, HiOutlineStatusOnline } from "react-icons/hi";

export default function Chat() {
  const uid = localStorage.getItem("user");
  const tempImg =
    "https://media.istockphoto.com/id/1298261537/vector/blank-man-profile-head-icon-placeholder.jpg?s=612x612&w=0&k=20&c=CeT1RVWZzQDay4t54ookMaFsdi7ZHVFg2Y5v7hxigCA=";

  const [data, setData] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [showProfile, setProfile] = useState(false);
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const { pathname } = useLocation();
  // console.log("location", location.pathname);
  // console.log("chat", showChat);
  // console.log("profile", showProfile);
  // console.log("id", id);

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
    if (!id && pathname === "/profile") {
      setProfile(true);
      setShowChat(false);
    }
    if (id && pathname !== "/profile") {
      setShowChat(true);
      setProfile(false);
    }
    if (!id && pathname !== "/profile") {
      setShowChat(false);
      setProfile(false);
    }
    if (id) {
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
    }
  }, [id]);
  return (
    <div style={{ marginTop: "1px" }}>
      {/* <h3>Firebase Realtime Chat App</h3> */}
      <Profile showProfile={setProfile} />
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
                    <span>{ele.uid == uid ? "You" : ele.username}</span>
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
          {!showChat && !showProfile && (
            <div>
              <h3>Welcome to</h3>
              <h1>C-Chat</h1>
            </div>
          )}
          {showChat && (
            <div style={{ marginTop: "5px" }}>
              <MessageBox data={data} />
            </div>
          )}
          {showProfile && (
            <div>
              <h3>Welcome to</h3>
              <h1>Profile Page</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
