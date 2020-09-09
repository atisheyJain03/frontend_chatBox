import React, { useRef } from "react";
import SidebarChat from "./SidebarChat";

function SidebarRoomList({ roomid, setCurrRoom, deleteRoom, currRoom }) {
  // this will  render each component of room in left part of page
  return (
    <>
      {roomid.map((el) => {
        return (
          <div key={el.data.data._id}>
            <SidebarChat
              title={el.data.data.name}
              image={el.data.data.image}
              deleteRoom={deleteRoom} // this is delete handler from .Sidebar.js file used to delete room
              roomId={el.data.data._id}
              currRoom={currRoom} // current room seleced of which message is rendering on right side of page
              setCurrRoom={setCurrRoom} // this will change current room and will re-render info about this new selected page
            />
          </div>
        );
      })}
    </>
  );
}

export default SidebarRoomList;
