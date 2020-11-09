import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar/Sidebar";
import Cookies from "js-cookie";

import "./App.css";
import Login from "./Login/Login";


function App() {
  // this is login user by default it is null
  const [user, setUser] = useState(null);

  useEffect(() => {
    // in this if ther is any cookie named user
    let tempUser = Cookies.get("user");
    if (tempUser !== undefined) {
      // if there is any cookie named user we will asve that value is user state and the page will re-render
      tempUser = JSON.parse(tempUser);
      setUser(tempUser);
    }
  }, []);

  return (
    // if no user Show login page
    // else show page for chating
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