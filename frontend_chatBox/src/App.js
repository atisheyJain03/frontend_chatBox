import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar/Sidebar";
import Cookies from "js-cookie";

import "./App.css";
import Login from "./Login";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let tempUser = Cookies.get("user");
    // console.log(tempUser);

    if (tempUser !== undefined) {
      // console.log("1");
      tempUser = JSON.parse(tempUser);
      // console.log(tempUser);
      setUser(tempUser);
    }
  }, []);

  // console.log(user);
  return (
    <>
      {!user ? (
        <Login setUser={setUser} />
      ) : (
        <div className="app">
          <div className="app__body">
            <Sidebar user={user} />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
