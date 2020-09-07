import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ChatMessage from "./ChatMessage";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import axios from "./axios";
import Pusher from "pusher-js";
import SendIcon from "@material-ui/icons/Send";

function Chat({ currRoomId, currUser }) {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState("");

  const searchUserRef = useRef("");
  const inputRef = useRef("");

  useEffect(() => {
    // console.log("roomid");
    (async () => {
      const temp = await axios.get("/room/" + currRoomId);
      setMessages([...temp.data.data.messages]);
      setName(temp.data.data.name);
    })();
  }, [currRoomId]);

  useEffect(() => {
    // console.log("messages,currRoomId");
    let pusher = new Pusher("4bada21a2e4ed2a6f96a", {
      cluster: "ap2",
    });
    let channel = pusher.subscribe(currRoomId);

    channel.bind("message", function (data) {
      JSON.stringify(data);
      if (data.message.from != currUser._id)
        setMessages((messages) => [...messages, data.message]);
    });

    return () => {
      channel.unbind("message");
      channel.unsubscribe();
    };
  }, [currRoomId]);

  const submitCallback = (event) => {
    // console.log("submitCallBack");
    event.preventDefault();
    console.log(inputRef.current.value);

    let msg = inputRef.current.value;
    inputRef.current.value = "";
    const body = {
      body: msg,
      from: currUser,
    };
    (async () => {
      msg = await axios.post("/message/" + currRoomId, {
        data: body,
      });
      // console.log(msg.data.data);
      setMessages((messages) => [...messages, msg.data.data]);
    })();
  };

  const submitUser = async (event) => {
    // console.log("submitUser");
    event.preventDefault();
    // console.log(searchUserRef.current.value);
    const findUser = searchUserRef.current.value;
    searchUserRef.current.value = "";
    const user = await axios.post("/user/" + currRoomId, {
      data: {
        email: findUser,
      },
    });
    // console.log(user);
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar />
        <div className="chat__header--info">
          <h3>{name}</h3>
        </div>
        <div className="chat__header--right">
          <form onSubmit={submitUser}>
            <input
              type="text"
              placeholder="Want to Add new user?"
              ref={searchUserRef}
            />
            <IconButton type="submit">
              <AddIcon />
            </IconButton>
          </form>
        </div>
      </div>
      <div className="chat__body">
        {messages.map((message) => {
          // console.log(message);
          return (
            <ChatMessage
              body={message.body}
              key={message._id}
              timestamp={message.createdAt}
              from={message.from}
              userid={currUser}
            />
          );
        })}
      </div>
      <div className="chat__footer">
        <form onSubmit={(event) => submitCallback(event)}>
          <input type="text" placeholder="Type a message" ref={inputRef} />

          <IconButton type="submit">
            <SendIcon />
          </IconButton>
        </form>
      </div>
    </div>
  );
}

export default Chat;
