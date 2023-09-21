import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../Context/ContextApi";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  getAuth
} from "firebase/auth";
import { db, ref, get, child } from "../Firebase";

export default function Login() {
  const auth = getAuth();  
  // auth.languageCode = "it";
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(true);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState(0);
  const [phone, setPhone] = useState(0);
  const { setAuth } = useContext(AppContext);
  const [data, setData] = useState({
    email: "",
    password: ""
  });
  // Loing with Email and Password
  const handleSubmit = (e) => {
    e.preventDefault();
    const dbRef = ref(db);
    get(child(dbRef, `users`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          let res = snapshot.val();
          let resData = Object.values(res);
          let findRes = resData.find(
            ({ email, password }) =>
              email === data.email && password === data.password
          );
          if (findRes) {
            setAuth(true);
            localStorage.setItem("user", findRes.id);
            // console.log("snap", findRes);
            navigate("/");
          } else {
            alert("No data available");
          }
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
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
          defaultCountry: "IN"
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
      <div
        style={{
          marginTop: "-15px",
          display: "flex",
          justifyContent: "center",
          gap: "20px"
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
              marginTop: "10px"
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
  );
}
