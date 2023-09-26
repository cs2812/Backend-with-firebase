import { useState } from "react";
import { db, ref, set, child, get } from "../Firebase";
import { useNavigate } from "react-router-dom";
import { Box, Button, Input, Text } from "@chakra-ui/react";

export default function Signup() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    avatar: "",
    email: "",
    password: "",
    phoneNumber: "",
    onLine: false,
  });

  //Register user after checking for duplicate email
  const doRegister = () => {
    let uid = Math.floor(10 + Math.random() * 1000000);
    set(ref(db, "users/" + uid), { ...data, uid })
      .then(() => {
        alert("Register Successfully");
        navigate("/login");
      })
      .catch((error) => {
        // The write failed...
        alert("Registration failed.Try Again ");
      });
  };

  // Registration Function
  const handleSubmit = (e) => {
    e.preventDefault();
    const dbRef = ref(db);
    get(child(dbRef, `users`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          // Checking email existence for new user
          let response = snapshot.val();
          let resData = Object.values(response);
          let findRes = resData.find(({ email }) => email === data.email);

          //if Email is not present in database
          if (!findRes) {
            //if Email is present in database
            doRegister();
          } else {
            alert("user already exist");
          }
        } else {
          //if database is empty
          doRegister();
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Registration failed.Try Again ");
      });
  };

  return (
    <div>
      <Box pt="1rem"></Box>
      <Box>
        <Text fontSize={"4xl"}>Sign Up</Text>
      </Box>
      <Box mt="20px">
        <form
          className="signupPage"
          style={{ marginTop: "-10px" }}
          action=""
          onSubmit={handleSubmit}
        >
          <Input
            onChange={(e) => setData({ ...data, username: e.target.value })}
            value={data.username}
            required
            type="text"
            placeholder="Enter Username"
          />
          <br />
          <Input
            onChange={(e) => setData({ ...data, phoneNumber: e.target.value })}
            value={data.phoneNumber}
            required
            type="number"
            placeholder="Enter Mobile Number"
          />
          <br />
          <Input
            onChange={(e) => setData({ ...data, email: e.target.value })}
            value={data.email}
            required
            type="email"
            placeholder="Enter Email"
          />

          <br />
          <Input
            onChange={(e) => setData({ ...data, password: e.target.value })}
            value={data.password}
            required
            type="password"
            placeholder="Enter Password"
          />
          <br />
          <Button type="submit" colorScheme="linkedin">
            Sign Up
          </Button>
        </form>
      </Box>
    </div>
  );
}
