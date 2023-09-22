import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../Context/ContextApi";
import { GetUser, handleUserDeactivate } from "../Helper/helperFunctions";
export default function Nav() {
  const navigate = useNavigate();
  const { isAuth, setAuth } = useContext(AppContext);
  // console.log(isAuth);

  const navigatePage = (route) => {
    navigate(route);
  };

  const handleLogout = async () => {
    let id = localStorage.getItem("user");
    let result = await GetUser(+id);
    // console.log(result);
    handleUserDeactivate(result)
      .then((res) => {
        alert(result.username+" you are offline");
      })
      .catch((err) => {
        alert("something went wrong");
        console.log(err);
      });
    navigatePage("/login");
    localStorage.removeItem("user");
    setAuth(false);
  };

  return (
    <div className="nav">
      <Link className="linktag" style={{ textDecoration: "none" }} to="/">
        ChatApp
      </Link>
      {isAuth ? (
        <Link className="linktag" onClick={handleLogout}>
          Log Out
        </Link>
      ) : (
        <Link className="linktag" to="/login">
          Log In{" "}
        </Link>
      )}
      <Link className="linktag" to="/signup">
        Signup
      </Link>
    </div>
  );
}
