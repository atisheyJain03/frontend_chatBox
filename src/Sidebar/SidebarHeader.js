import React from "react";
import { Avatar } from "@material-ui/core";

function SidebarHeader({ name, image }) {
  // name is name of user we got this info from google login from login page
  return (
    <div className="sidebar__header">
      <div className="sidebar__header--left">
        <Avatar src={image} />
      </div>
      <div className="Sidebar__header--right">
        <p>{name}</p>
      </div>
    </div>
  );
}

export default SidebarHeader;
