import React, { useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import { GetUser } from "../Helper/helperFunctions";
import { db, ref, get, set, child, onValue } from "../Firebase";

const MessageBox = ({ data }) => {
  const [user, setUser] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [message, setMessage] = useState("");
  const { id } = useParams();


  const submitChat = () => {
    let cid = Math.floor(10 + Math.random() * 1000);

    set(ref(db, `chat/${cid}`), {
      cid,
      from: parseInt(currentUser.uid),
      to: parseInt(id),
      message,
      isSeen: false,
      cat: Date.now(),
    })
      .then((res) => {
        setMessage("");
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  useEffect(() => {
    GetUser(id)
      .then((res) => {
        setUser(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);
  useEffect(() => {
    let id = localStorage.getItem("user");
    GetUser(id)
      .then((res) => {
        setCurrentUser(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div>
      <div className="chatMessageBox">
        <div
          style={{
            padding: "0.3rem 0.5rem",
            display: "flex",
            justifyContent: "left",
            boxShadow:
              "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
              position:"fixed",
              width:"81.2%"
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              width: "max-content",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            <span className="userImage">
              <img
                src="https://media.istockphoto.com/id/1298261537/vector/blank-man-profile-head-icon-placeholder.jpg?s=612x612&w=0&k=20&c=CeT1RVWZzQDay4t54ookMaFsdi7ZHVFg2Y5v7hxigCA="
                alt=""
              />
            </span>
            <span>{user.username}</span>
          </div>
        </div>
<div style={{paddingTop:"4rem"}}></div>
        {data.map((ele,i) => (
          <div key={ele.cid} className="messageContainerDiv">
            <div className={ele.from===user.uid?"fromChat":"myChat"}>
              <p
                style={{
                  backgroundColor: "transparent",
                  fontSize: "16px",
                }}
              >
                {ele.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="inputDiv">
        <input
          value={message}
          className="chatInput"
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && submitChat()}
          placeholder="Enter Message"
          style={{ width: "100%", height: "30px", paddingLeft: "15px" }}
        />
      </div>
    </div>
  );
};

export default MessageBox;
