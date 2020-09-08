import React from "react";
import "./ChatMessage.css";

function chatMessage({ body, from, timestamp, userid }) {
  // console.log(from, userid._id);
  return (
    <div
      className={`chatMessage ${
        from === userid.email ? "chatMessage__self" : ""
      }`}
    >
      <h3 className="chatMessage__name">{from}</h3>
      <p className="chatMessage__content">{body}</p>
      <h6 className="chatMessage__timestamp">{timestamp}</h6>
    </div>
  );
}

export default chatMessage;
