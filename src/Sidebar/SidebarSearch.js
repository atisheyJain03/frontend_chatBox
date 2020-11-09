import React from "react";
import { IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

function SidebarSearch({ roomRef, submitCallback }) {
  return (
    <div className="sidebar__search">
      <div className="sidebar__search--container">
        {/* this is for user if they want to create new room */}
        <form onSubmit={submitCallback}>
          <input
            type="text"
            placeholder="Want to Create new room ? Enter room name"
            ref={roomRef}
          />
          <IconButton type="submit">
            <AddIcon />
          </IconButton>
        </form>
      </div>
    </div>
  );
}

export default SidebarSearch;
