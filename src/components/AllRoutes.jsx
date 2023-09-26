import { Route, Routes } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import PrivateRoute from "../HOF/PrivateRoute";
import Home from "../pages/Home";

export default function AllRoutes({ setCurrentUser }) {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      ></Route>
      <Route
        path="/chat/:id"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      ></Route>
      <Route
        path="/chat/profile"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      ></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/signup" element={<Signup />}></Route>
    </Routes>
  );
}
