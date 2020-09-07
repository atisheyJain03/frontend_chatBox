import React from "react";
import "./SidebarChat.css";
import { Avatar } from "@material-ui/core";

function SidebarChat({ message, title, image }) {
  return (
    <div className="sidebarChat">
      <Avatar src={image} />
      <div className="SidebarChat__info">
        <h3>{title}</h3>
      </div>
    </div>
  );
}

export default SidebarChat;
