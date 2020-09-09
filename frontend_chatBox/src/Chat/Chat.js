import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ChatMessage from "./ChatMessage";
import axios from "../axios";
import Pusher from "pusher-js";
import SendIcon from "@material-ui/icons/Send";
import Loader from "../Loader/Loader";

// THIS IS RESPONSIBLE FOR RIGHT PART OF PAGE THIS HANDLES ALL MESSAGES PART OF WEBSITE
// THIS CONTROLLS ALL ROOM DETAILS OF PAGE SUCH AS MESSAGES IN ROOM ,ROOM NAME ,ETC

function Chat({ currRoomId, currUser }) {
  // this is array of all the messages in the room
  const [messages, setMessages] = useState([]);

  // this is name of the room
  const [name, setName] = useState("");

  // this is for loading component
  const [isLoading, setIsLoading] = useState(true);

  // this is for form if user want to add new user
  const searchUserRef = useRef("");

  // this is for message input form
  const inputRef = useRef("");

  // this use effect depend on currRooId means selected room if that change all inside it will run again
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      // this is to get all the messages in room
      const temp = await axios.get("/room/" + currRoomId, {
        headers: {
          populate: 1, // this will populate the messages in room
        },
      });
      setIsLoading(false);
      setMessages([...temp.data.data.messages]); // setter function of messages
      setName(temp.data.data.name); // setter function for room name
    })();
  }, [currRoomId]);

  // this use effect is for pusher module this will run only once
  useEffect(() => {
    let pusher = new Pusher("4bada21a2e4ed2a6f96a", {
      cluster: "ap2",
    });
    let channel = pusher.subscribe(currRoomId);

    channel.bind("message", function (data) {
      JSON.stringify(data);
      if (data.message.from !== currUser.email)
        // this will check if the message is from us or from other user (if we send the message)
        // if this is ours message it will prevet to change state and will prevent re-rendering
        setMessages((messages) => [...messages, data.message]);
    });

    // unsubscribe the channel when component will unmount again to prevent from data leak
    return () => {
      console.log("unsubscribed");
      channel.unbind("message");
      channel.unsubscribe();
    };
  }, [currRoomId, currUser.email]);

  // this is callback when user sends new message
  const submitCallback = (event) => {
    event.preventDefault();
    let msg = inputRef.current.value;
    inputRef.current.value = "";
    msg = msg.trim();
    if (!msg) return;
    const body = {
      body: msg,
      from: currUser.email,
    };

    // sending message to database which will add this message to room so that other users can see this message
    setIsLoading(true);
    (async () => {
      msg = await axios.post("/message/" + currRoomId, {
        data: body,
      });
      setIsLoading(false);
      setMessages((messages) => [...messages, msg.data.data]); // reset messages state and add current message
    })();
  };

  // this is callback for if user wand to add new user in the room
  const submitUser = async (event) => {
    event.preventDefault();

    // this will check if input is not empty or contains only white spaces
    let findUser = searchUserRef.current.value;
    findUser = findUser.trim();
    searchUserRef.current.value = "";
    if (!findUser) return;

    const user = await axios.post("/user/" + currRoomId, {
      data: {
        email: findUser,
      },
    });

    if (!user.data.data) {
      // if no user
      alert("No user found with email - " + findUser);
    }
    // this alert will be send when new user will add in the room
    else alert("User with email - " + findUser + " has been added in the room");
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar />
        <div className="chat__header--info">
          <h3>{name}</h3>
        </div>
        <div className="Loader">{isLoading && <Loader />}</div>

        <div className="chat__header--right">
          {/* adding new user form */}
          <form onSubmit={submitUser}>
            <input
              type="email"
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
          return (
            <ChatMessage // this is single message component
              body={message.body}
              key={message._id}
              timestamp={message.createdAt}
              from={message.from}
              userid={currUser}
            />
          );
        })}
      </div>
      {/* below message input form */}
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
