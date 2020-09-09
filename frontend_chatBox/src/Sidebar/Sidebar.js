import React, { useState, useEffect, useRef } from "react";
import "./Sidebar.css";

import axios from "../axios";
import Chat from "../Chat/Chat";
import Pusher from "pusher-js"; // this will help us making our db realtime
import SidebarHeader from "./SidebarHeader";
import SidebarSearch from "./SidebarSearch";
import SidebarRoomList from "./SidebarRoomList";
import Loader from "../Loader/Loader";

function Sidebar({ user }) {
  // room state it will store room id which will decide which room message to show
  const [currRoom, setCurrRoom] = useState("");

  // it will store All rooms of which user is a part this has all the info about rooms except whole messages
  const [roomid, setRoomid] = useState([]);

  // this is refrence on input of room when user want to create new room
  const roomRef = useRef("");

  // this is for loading it is used to show loader when data is sending or receving to api
  const [isLoading, setIsLoading] = useState(true);

  // this is submit callback when user want to create new room  it will use in <SidebarSearch /> component as event handler when user submit that form (one level down)
  const submitCallback = async (event) => {
    event.preventDefault(); // it will prevent reloading
    let newRoom = roomRef.current.value; // input value
    roomRef.current.value = ""; // reset form value to ""
    newRoom = newRoom.trim(); // trim if there is white spaces at starting or end of string
    if (!newRoom) return; // won't send request if no input value
    setIsLoading(true); // loader started

    const room = await axios.post("/room", {
      data: {
        name: newRoom,
        user: user.email,
      },
    });
    setIsLoading(false); // remove loader
    setRoomid([...roomid, room]); // add new room to all current rooms this will alse auto re-render as we change the state
  };

  // this is delete room handler it will be called when user want to delete the room this will be used in
  // <SidebarChat /> component in ./SidebarChat.js file
  const deleteRoomHandler = (room) => {
    //here argument = room is that room id which we want to delete
    let rooms = roomid.filter((r) => r.data.data._id !== room); //this will filter that room id from array of all roomid's which we want to delete

    // Async call but no need of loader because we are not showing anything to user   and user will not wait for response
    (async () => {
      await axios.patch("/user/" + user._id + "/" + room);
    })();
    setRoomid([...rooms]); // this will update roomid state and will re-render this sidebar component
  };

  // this is for pusher module for subscribe to room if the user is added into new room
  useEffect(() => {
    let pusher = new Pusher("4bada21a2e4ed2a6f96a", {
      cluster: "ap2",
    });
    let channel = pusher.subscribe(user.email);

    channel.bind("room", function (data) {
      JSON.stringify(data);
      alert("new room");
      setRoomid((roomid) => [...roomid, data]);
    });
    // when component will unmount we need to unsubscribe pusher for unnecessary load and data leak because we are setting state in it which can re-render and we cant re-render unmounted component
    return () => {
      pusher.unbind_all();
      pusher.unsubscribe(user.email);
    };
  }, []);

  // for setter function of set roomid
  const changeState = (r) => {
    setRoomid(r);
  };

  // this will get all the info like, name of all the room of which user has joined
  // in user variable we only has user with rooId array not all details of room
  useEffect(() => {
    (async () => {
      let msg = await axios.post("/user", {
        data: user,
      });

      // this will get all rooms info from user and
      // as in user object of cookie that may has old ifo about rooms
      let rooms = msg.data.data.roomId || [];
      let r = [];
      for (let room of rooms) {
        const temp = await axios.get("/room/" + room, {
          headers: {
            populate: 0, // this will prevent populating all messages as we dont need them here
          },
        });
        r = [...r, temp];
      }
      changeState(r);
      setIsLoading(false); // this will remove loader by default which is true
    })();
  }, [user]);
  return (
    <div className="sidebar">
      <div className="sidebar__left">
        <SidebarHeader name={user.name} image={user.image} />
        <SidebarSearch roomRef={roomRef} submitCallback={submitCallback} />
        <div className="sidebar__chats">
          <SidebarRoomList
            roomid={roomid}
            setCurrRoom={setCurrRoom}
            deleteRoom={deleteRoomHandler}
            currRoom={currRoom}
          />
          {isLoading && <Loader />}
        </div>
      </div>
      {/* if no currRoom seleted print null  */}
      {!currRoom ? null : <Chat currRoomId={currRoom} currUser={user} />}
    </div>
  );
}

export default Sidebar;
