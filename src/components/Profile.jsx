import React, { useEffect, useState } from "react";
import { GetUser } from "../Helper/helperFunctions";

const Profile = () => {
  const [currentUser, setCurrentUser] = useState({});
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
    <div
      style={{
        padding: "0.3rem 0.5rem",
        display: "flex",
        justifyContent: "right",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "5px",
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
        <span>{currentUser.username}</span>
      </div>
    </div>
  );
};

export default Profile;
