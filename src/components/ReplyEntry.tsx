import { useContext, useEffect, useState } from "react";
import "../styles/ReplyEntry.scss";
import { UserContext } from "../Contexts/UserContext";
import { ReplyEntryContext } from "../Contexts/ReplyEntryContext";
import { collection, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import { UserConversationsContext } from "../Contexts/UserConversationsContext";
import { MdReply } from "react-icons/md";

const ReplyEntry = () => {
  // ************ Contexts ************

  const { originContent, setScrollToOrigin } = useContext(ReplyEntryContext);
  const { currentConversation } = useContext(UserConversationsContext);

  // ************  States   ************

  // ************ Effects **************
  if (originContent == "") return;

  return (
    <div className="reply-entry-container" onClick={(e) => e.stopPropagation()}>
      <div className="origin" onClick={() => setScrollToOrigin(true)}>
        <MdReply />
        <p>
          {originContent.length > 50
            ? originContent.slice(0, 50) + "..."
            : originContent}
        </p>
        <input type="text" />
      </div>
    </div>
  );
};

export default ReplyEntry;
