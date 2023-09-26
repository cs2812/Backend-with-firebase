import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetUser } from "../Helper/helperFunctions";
import { db, ref, get, set, child, onValue } from "../Firebase";
import { Box, Flex, Input, Text } from "@chakra-ui/react";

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
      <Flex
        position={"fixed"}
        top={"95px"}
        justifyContent={"left"}
        w={"100%"}
        p="0.5rem 0.5rem"
        bg={"white"}
        boxShadow="base"
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
      </Flex>
      <Box h="79vh" overflowY={"auto"}>
        {/* 2nd User Profile bar */}
        <Box pt="3.5rem"></Box>
        {data.map((ele, i) => (
          <div key={ele.cid} className="messageContainerDiv">
            <Box
              textAlign={ele.from === user.uid ? "left" : "right"}
              className={ele.from === user.uid ? "fromChat" : "myChat"}
            >
              <Text w="100%" fontSize={"17px"}>
                {ele.message}
              </Text>
            </Box>
          </div>
        ))}
      </Box>

      <div className="inputDiv">
        <Input
          variant="unstyled"
          boxSizing="border-box"
          pl={"10px"}
          value={message}
          size="lg"
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && submitChat()}
          placeholder="Enter Message"
        />
      </div>
    </div>
  );
};

export default MessageBox;
