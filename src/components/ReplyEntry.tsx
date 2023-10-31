import { useContext, useEffect, useState } from "react";
import "../styles/ReplyEntry.scss";
import { UserContext } from "../Contexts/UserContext";
import { ReplyEntryContext } from "../Contexts/ReplyEntryContext";
import { collection, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import { UserConversationsContext } from "../Contexts/UserConversationsContext";
import { MdReply } from "react-icons/md";

const ReplyEntry = () => {
  // ************ States ************

  const [inputValue, setInputValue] = useState("");

  // ************ Contexts ************

  const {
    originContent,
    setScrollToOrigin,
    content,
    setContent,
    setSendReply,
  } = useContext(ReplyEntryContext);
  if (originContent == "") return;

  // ************ Functions **************
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSendReply(true);
  };

  // ************ Effects **************
  // useEffect(() => {
  //   // setINp;
  // }, [content]);

  return (
    <form onSubmit={submit}>
      <div
        className="reply-entry-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="origin" onClick={() => setScrollToOrigin(true)}>
          <MdReply />
          <p>
            {originContent.length > 50
              ? originContent.slice(0, 50) + "..."
              : originContent}
          </p>
          <input
            onChange={(e) => setContent(e.currentTarget.value)}
            type="text"
            onClick={(e) => e.stopPropagation()}
            value={content}
          />
        </div>
      </div>
    </form>
  );
};

export default ReplyEntry;
