import react, { useEffect, useState } from "react";
import { db, ref, set, onValue } from "../Firebase";

export default function Chat() {
  const [data, setData] = useState([]);
  const [userList, setUserList] = useState([1, 2, 3, 4]);
  const [message, setMessage] = useState("");
  const addChat = () => {
    let id = Math.floor(10 + Math.random() * 1000);
    set(ref(db, "chat/" + id), {
      message
    });
  };
  useEffect(() => {}, []);
  return (
    <div>
      <h3>Firebase Realtime Chat App</h3>
      <div className="chatContainer">
        <div className="useList">
          {userList &&
            userList.map((ele, i) => {
              return (
                <div className="ChatUser">
                  <span className="userImage">
                    <img
                      src="https://media.istockphoto.com/id/1298261537/vector/blank-man-profile-head-icon-placeholder.jpg?s=612x612&w=0&k=20&c=CeT1RVWZzQDay4t54ookMaFsdi7ZHVFg2Y5v7hxigCA="
                      alt=""
                    />
                  </span>
                  <span>chetan</span>
                </div>
              );
            })}
        </div>
        <div className="chatBox">
          <div className="chatMessageBox">
            {data.map((ele) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0rem 1rem",
                  border: "1px solid gray"
                }}
              >
                <p>{ele.message}</p>
                <div style={{ display: "flex", gap: "20px" }}>
                  <button>update</button>
                  <button>Delete</button>
                </div>
              </div>
            ))}
          </div>

          <div className="inputDiv">
            <input
              className="chatInput"
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addChat()}
              placeholder="Enter Message"
              style={{ width: "100%", height: "30px", paddingLeft: "15px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
