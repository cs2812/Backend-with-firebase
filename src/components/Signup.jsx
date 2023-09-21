import { useState } from "react";
import { db, ref, set, child, get } from "../Firebase";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const doRegister = () => {
    let id = Math.floor(10 + Math.random() * 1000);
    set(ref(db, "users/" + id), { ...data, id })
      .then(() => {
        // Data saved successfully!
        alert("Register Successfully");
        navigate("/login");
      })
      .catch((error) => {
        // The write failed...
        alert("Registeration failed.Try Again ");
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
          let res = snapshot.val();
          let resData = Object.values(res);
          let findRes = resData.find(({ email }) => email === data.email);

          //if Email is not present in database
          if (!findRes) {
            //if Email is present in database
            doRegister();
          } else {
            alert("user allready exist");
          }
        } else {
          //if database is empty
          doRegister();
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Registeration failed.Try Again ");
      });
  };

  return (
    <div>
      <div>
        <h3>Sign Up</h3>
      </div>
      <form style={{ marginTop: "-10px" }} action="" onSubmit={handleSubmit}>
        <input
          onChange={(e) => setData({ ...data, username: e.target.value })}
          value={data.username}
          required
          type="text"
          placeholder="Enter Username"
        />
        <br />
        <input
          onChange={(e) => setData({ ...data, email: e.target.value })}
          value={data.email}
          required
          type="email"
          placeholder="Enter Email"
        />
        <br />
        <input
          onChange={(e) => setData({ ...data, password: e.target.value })}
          value={data.password}
          required
          type="password"
          placeholder="Enter Password"
        />
        <br />
        <button>Signup</button>
      </form>
    </div>
  );
}
