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

export default function Login() {
  const auth = getAuth();
  const db = getDatabase();

  // auth.languageCode = "it";
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(true);
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
      <div>
        <h3>Log In </h3>
      </div>
      <div className="loginPage">
        <div
          style={{
            marginTop: "-15px",
            display: "flex",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <label style={{ marginTop: "9px" }} htmlFor="">
              Email
            </label>
            <input
              checked={toggle === true}
              onChange={() => setToggle(true)}
              style={{ boxShadow: "none" }}
              type="radio"
            />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <label style={{ marginTop: "9px" }} htmlFor="">
              Mobile
            </label>
            <input
              checked={toggle === false}
              onChange={() => setToggle(false)}
              style={{ boxShadow: "none" }}
              type="radio"
            />
          </div>
        </div>

        {/* Email and Mobile conditional rendering*/}
        {toggle ? (
          // Email and password login
          <form action="" onSubmit={handleSubmit}>
            <input
              onChange={(e) => setData({ ...data, email: e.target.value })}
              value={data.email}
              required
              type="email"
              placeholder="Enter email"
            />
            <br />
            <input
              onChange={(e) => setData({ ...data, password: e.target.value })}
              value={data.password}
              required
              type="password"
              placeholder="Enter password"
            />
            <br />
            <button>Login</button>
          </form>
        ) : (
          <div>
            {/* Mobile OTP login */}
            <input
              // onKeyPress={(e) => e.key === "Enter" && handleMobileLogin()}
              type="text"
              placeholder="Enter mobile number"
              onChange={(e) => setPhone(e.target.value)}
            />
            <div id="recaptcha-container"></div>
            {/* <PhoneInput country="US" /> */}
            <button
              style={{
                display: showOTP ? "none" : "block",
                margin: "auto",
                marginTop: "10px",
              }}
              onClick={onSignInSubmit}
            >
              Submit
            </button>
            {showOTP && (
              <div>
                <input
                  onChange={(e) => setOTP(e.target.value)}
                  type="number"
                  placeholder="Enter OTP"
                />
                <button onClick={handleVerifyOTP}>Verify</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
