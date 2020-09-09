import React, { useRef } from "react";
import "./SidebarChat.css";
import { Avatar, IconButton } from "@material-ui/core";
import DeleteOutlineSharpIcon from "@material-ui/icons/DeleteOutlineSharp";

// this is each component of room like rendered single element of roomid array

function SidebarChat({
  title,
  image,
  roomId,
  currRoom,
  deleteRoom,
  setCurrRoom,
}) {
  const deleteRoomref = useRef(""); // this will be added to button (icon) of  delete and will used to delete room

  // this is delete room handler
  const onClickHandler = (event) => {
    // if the clicked element is that dustbin logo it will delete the room

    if (deleteRoomref.current.contains(event.target)) {
      // if the deleted room is current selected room it will set current room id to null
      // else no change on selected room
      if (currRoom === roomId || !currRoom) setCurrRoom(null);

      // deleteRoom this is that handler function which we have made in ./Sidebar.js file to delete room
      deleteRoom(roomId);
    }
    // if the clicked component is not dustbin icon then select this room
    else setCurrRoom(roomId); // this is setter for currRoom
  };

  return (
    <div className="sidebarChat" onClick={(event) => onClickHandler(event)}>
      <Avatar src={image} />
      <div className="SidebarChat__info">
        <h3>{title}</h3>
      </div>
      <IconButton ref={deleteRoomref}>
        <DeleteOutlineSharpIcon />
      </IconButton>
    </div>
  );
}

export default SidebarChat;
