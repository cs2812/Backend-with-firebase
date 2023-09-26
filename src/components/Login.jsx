import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../Context/ContextApi";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  getAuth,
} from "firebase/auth";
import { getDatabase, ref, get, child, push, update } from "firebase/database";
import { GetList, handleUserActive } from "../Helper/helperFunctions";
import {
  Box,
  Button,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";

export default function Login() {
  const auth = getAuth();
  const db = getDatabase();

  // auth.languageCode = "it";
  const navigate = useNavigate();
  const [toggle, setToggle] = useState("1");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState(0);
  const [phone, setPhone] = useState(0);
  const { setAuth } = useContext(AppContext);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  // Login with Email and Password
  const handleSubmit = (e) => {
    e.preventDefault();
    GetList("users")
      .then((res) => {
        let findRes = res.find(
          ({ email, password }) =>
            email === data.email && password === data.password
        );
        if (findRes) {
          handleUserActive(findRes)
            .then((res) => {
              alert(findRes.username + " You are online");
              // console.log("update res",res)
            })
            .catch(() => {
              alert("Something went wrong");
            });
          setAuth(true);
          localStorage.setItem("user", findRes.uid);
          // console.log("snap", findRes);
          navigate("/");
        } else {
          alert("No data available");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Function for handle Login with Mobile OTP
  function onSignInSubmit() {
    let phoneNumber = `+91${phone}`;
    console.log(phoneNumber);

    // Function for Google caption
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignInSubmit();
          },
          defaultCountry: "IN",
        },
        auth
      );
    }
    // Function for send OTP
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        console.log("confirm", confirmationResult);
        window.confirmationResult = confirmationResult;
        setShowOTP(true);
      })
      .catch((error) => {
        // appVerifier.clear();
        console.log("Sms Not sent", error);
      });
  }
  //Confirm OTP
  const handleVerifyOTP = () => {
    window.confirmationResult
      .confirm(otp)
      .then((res) => {
        localStorage.setItem("user", otp);
        console.log("user", res);
        setAuth(true);
        alert("OTP verified");
        navigate("/");
      })
      .catch((err) => {
        console.log("err", err);
        setShowOTP(false);
        alert("OTP verification failed Code expire");
      });
  };

  return (
    <div>
      {/* Toggle button */}
      <Box pt="20px"></Box>
      <div>
        <Text fontSize={"4xl"}>Log In </Text>
      </div>
      <Box className="loginPage">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <Box p="1rem">
            <RadioGroup w="250px" m="auto" onChange={setToggle} value={toggle}>
              <Stack direction="row">
                <Radio size={"lg"} value="1">
                  Email
                </Radio>
                <Radio size={"lg"} value="2">
                  Mobile
                </Radio>
              </Stack>
            </RadioGroup>
          </Box>
        </div>

        {/* Email and Mobile conditional rendering*/}
        {toggle==="1" ? (
          // Email and password login
          <Box mt="20px">
            <form action="" onSubmit={handleSubmit}>
              <Input
                onChange={(e) => setData({ ...data, email: e.target.value })}
                value={data.email}
                required
                type="email"
                placeholder="Enter email"
              />
              <br />
              <Input
                mt={"10px"}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                value={data.password}
                required
                type="password"
                placeholder="Enter password"
              />
              <br />
              <Button mt="10px" w="100%" type="submit" colorScheme="linkedin">
                Login
              </Button>
            </form>
          </Box>
        ) : (
          <div>
            {/* Mobile OTP login */}
            <Input
              // onKeyPress={(e) => e.key === "Enter" && handleMobileLogin()}
              type="text"
              placeholder="Enter mobile number"
              onChange={(e) => setPhone(e.target.value)}
            />
            <div id="recaptcha-container"></div>
            {/* <PhoneInput country="US" /> */}
            <Button
              display={showOTP ? "none" : "block"}
              m="auto"
              mt="10px"
              w={"100%"}
              colorScheme="linkedin"
              onClick={onSignInSubmit}
            >
              Submit
            </Button>
            {showOTP && (
              <div>
                <Input
                  onChange={(e) => setOTP(e.target.value)}
                  type="number"
                  placeholder="Enter OTP"
                />
                <Button w={"100%"} colorScheme="linkedin" onClick={handleVerifyOTP}>
                  Verify
                </Button>
              </div>
            )}
          </div>
        )}
      </Box>
    </div>
  );
}
