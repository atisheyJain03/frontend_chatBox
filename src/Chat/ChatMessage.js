import React from "react";
import "./ChatMessage.css";

function chatMessage({ body, from, timestamp, userid }) {
  return (
    <div
      className={`chatMessage ${
        // this will check if this message is from us or from other user

        // if message is from us means (we have send the message ) it will add styling like add green backgroung and more...

        // else it will not  add extra class and there will be no change in styling

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
