import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import AddIcon from "@material-ui/icons/Add";

import { Avatar, IconButton } from "@material-ui/core";

import SidebarChat from "../SidebarChat";
import axios from "../axios";
import Chat from "../Chat";
import Pusher from "pusher-js";

function Sidebar({ user }) {
  const [currRoom, setCurrRoom] = useState(null);
  const [roomid, setRoomid] = useState([]);
  const [roomInput, setRoomInput] = useState("");

  const submitCallback = async (event) => {
    event.preventDefault();
    // console.log(roomInput);
    const room = await axios.post("/room", {
      data: {
        name: roomInput,
        user: user.email,
      },
    });
    setRoomid([...roomid, room]);
    // console.log(roomid, "callback");
    // console.log(room, "callback");
    setRoomInput("");
  };

  useEffect(() => {
    // console.log(roomid, "pusher");
    let pusher = new Pusher("4bada21a2e4ed2a6f96a", {
      cluster: "ap2",
    });
    let channel = pusher.subscribe(user.email);

    channel.bind("room", function (data) {
      JSON.stringify(data);
      // console.log(data);
      alert(data);
      setRoomid((roomid) => [...roomid, data]);
    });
  }, []);

  useEffect(() => {
    (async () => {
      let msg = await axios.post("/user", {
        data: user,
      });
      let rooms = msg.data.data.roomId || [];
      let r = [];
      for (let room of rooms) {
        const temp = await axios.get("/room/" + room);
        r = [...r, temp];
      }

      setRoomid([...r]);
    })();
  }, [user]);

  return (
    <div className="sidebar">
      <div className="sidebar__left">
        <div className="sidebar__header">
          <div className="sidebar__header--left">
            <Avatar src={user.image} />
          </div>
          <div className="Sidebar__header--right">
            <p>{user.name}</p>
          </div>
        </div>
        <div className="sidebar__search">
          <div className="sidebar__search--container">
            <form onSubmit={submitCallback}>
              <input
                type="text"
                placeholder="Want to Create new room ? Enter room name"
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value)}
              />
              <IconButton type="submit">
                <AddIcon />
              </IconButton>
            </form>
          </div>
        </div>
        <div className="sidebar__chats">
          {roomid.map((el) => {
            // console.log(el);
            if (!el) return null;
            return (
              <div
                onClick={() => setCurrRoom(el.data.data._id)}
                key={el.data.data._id}
              >
                <SidebarChat
                  title={el.data.data.name}
                  image={el.data.data.image}
                />
              </div>
            );
          })}
        </div>
      </div>

      {currRoom && <Chat currRoomId={currRoom} currUser={user} />}
    </div>
  );
}

export default Sidebar;
