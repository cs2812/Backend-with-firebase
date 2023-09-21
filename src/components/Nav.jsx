import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../Context/ContextApi";
export default function Nav() {
  const navigate = useNavigate();
  const { isAuth, setAuth } = useContext(AppContext);
  // console.log(isAuth);

  const navigatePage = (route) => {
    navigate(route);
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    setAuth(false);
  };
  return (
    <div className="nav">
      <Link className="linktag" style={{ textDecoration: "none" }} to="/">
        Dashboard
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
