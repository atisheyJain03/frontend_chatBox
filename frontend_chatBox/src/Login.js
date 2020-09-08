import React from "react";
import { auth, provider } from "./firebase.js";
import axios from "./axios.js";
import Cookies from "js-cookie";
import { Button } from "@material-ui/core";
import "./Login.css";

function Login({ setUser }) {
  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then((res) => {
        // console.log(res);
        const data = {
          name: res.user.displayName,
          email: res.user.email,
          image: res.user.photoURL,
        };

        return axios
          .post("/user", {
            data: data,
          })
          .then((res) => {
            setUser(res.data.data);

            Cookies.set("user", res.data.data, {
              expires: 7,
            });
            // console.log(Cookies.get("user"));
          })
          .catch((err) => alert(err.message));
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="login">
      <div className="login__container ">
        <img
          className="login__image"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/800px-WhatsApp.svg.png"
        />
        <h1 className="login__text">Sign in to WhatsApp</h1>
        <Button className="login__button" onClick={signIn}>
          login with google
        </Button>
      </div>
    </div>
  );
}

export default Login;
