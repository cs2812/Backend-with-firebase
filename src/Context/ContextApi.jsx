import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

export default function ContextApi({ children }) {
  const [isAuth, setAuth] = useState(localStorage.getItem("user") || false);
  
  // useEffect(() => {
  //   let isPre = localStorage.getItem("user");
  //   if (!isPre) {
  //     setAuth(false);
  //   } else {
  //     setAuth(true);
  //   }
  // }, [isAuth]);
  return (
    <AppContext.Provider value={{ isAuth, setAuth }}>
      {children}
    </AppContext.Provider>
  );
}
