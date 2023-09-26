import { useEffect, useState } from "react";
import { db, ref, get, set, child, onValue } from "../Firebase";
import MessageBox from "./MessageBox";
import Profile from "./Profile";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { HiOutlineStatusOffline, HiOutlineStatusOnline } from "react-icons/hi";
import { Box, Flex, Text } from "@chakra-ui/react";

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
    if (!id && pathname === "/chat/profile") {
      setProfile(true);
      setShowChat(false);
    }
    if (id && pathname !== "/chat/profile") {
      setShowChat(true);
      setProfile(false);
    }
    if (!id && pathname !== "/chat/profile") {
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
      <Profile showProfile={setProfile} />
      <Box display={"flex"} h="85.5vh" fontWeight={"600"}>
        <div className="useList light-gray-bg">
          {userList &&
            userList.map((ele, i) => {
              return (
                <div
                  key={i}
                  onClick={() => StartChatting(ele.uid)}
                  className="ChatUser "
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
        <Box className="chatBox ">
          {!showChat && !showProfile && (
            <Box h="100%">
              <Flex
                h="100%"
                justifyContent={"center"}
                direction={"column"}
                textAlign={"center"}
                fontSize={"5xl"}
              >
                <Text>Welcome To</Text>
                <Text>C-Chat</Text>
              </Flex>
            </Box>
          )}
          {showChat && (
            <Box>
              <MessageBox data={data} />
            </Box>
          )}
          {showProfile && (
            <Box>
              <h3>Welcome to</h3>
              <h1>Profile Page</h1>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
}
