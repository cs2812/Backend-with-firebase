import { useContext, useEffect } from "react";
import { AppContext } from "../Context/ContextApi";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const { isAuth, setAuth } = useContext(AppContext);
  return <div>{isAuth ? children : <Navigate to={"/login"} />}</div>;
}
