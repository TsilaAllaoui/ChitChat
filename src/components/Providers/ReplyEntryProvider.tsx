import React, { useState } from "react";
import { ReplyEntryContext } from "../../Contexts/ReplyEntryContext";

const ReplyEntryProvider = ({ children }: { children: JSX.Element }) => {
  const [originContent, setOriginContent] = useState("");
  const [content, setContent] = useState("");
  const [scrollToOrigin, setScrollToOrigin] = useState(false);
  const [sendReply, setSendReply] = useState(false);
  const [repliedMessage, setRepliedMessage] = useState("");
  return (
    <ReplyEntryContext.Provider
      value={{
        originContent,
        setOriginContent,
        content,
        setContent,
        scrollToOrigin,
        setScrollToOrigin,
        sendReply,
        setSendReply,
        repliedMessage,
        setRepliedMessage,
      }}
    >
      {children}
    </ReplyEntryContext.Provider>
  );
};

export default ReplyEntryProvider;
