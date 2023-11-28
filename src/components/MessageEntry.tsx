import { collection, deleteDoc, getDocs } from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BsFillReplyFill, BsThreeDotsVertical } from "react-icons/bs";
import { FaFileDownload } from "react-icons/fa";
import { MdReply } from "react-icons/md";
import { ReplyEntryContext } from "../Contexts/ReplyEntryContext";
import { UserContext } from "../Contexts/UserContext";
import { db } from "../Firebase";
import "../styles/MessageEntry.scss";
import Action from "./Action";
import { ActionLabel } from "./Model/ActionModel";

function MessageEntry({
  content,
  senderId,
  hostId,
  currentConversationId,
  repliedContent,
}: {
  content: string;
  senderId: string;
  hostId: string;
  currentConversationId: string;
  repliedContent: string;
}) {
  // ************ Refs ***************

  const menu = useRef<HTMLDivElement>(null);
  const replyRef = useRef<HTMLDivElement>(null);

  // ************ Contexts ************

  const user = useContext(UserContext).user;

  const {
    originContent,
    setOriginContent,
    scrollToOrigin,
    setScrollToOrigin,
    repliedMessage,
    setRepliedMessage,
  } = useContext(ReplyEntryContext);

  // ************  States   ************
  const [limit, setLimit] = useState(45);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [parts, setParts] = useState<string[]>([]);
  const [condition, setCondition] = useState(false);
  const [opacity, setOpacity] = useState("0");
  const [toggleMenu, setToggleMenu] = useState(false);
  const [repliedEntry, setRepliedEntry] = useState("");

  // ************ Effects **************

  // Getting and splitting messages on first render
  useEffect(() => {
    // Condition to know if message entry was sent by who
    setCondition(user!.uid != senderId);

    if (content.includes("data:image")) {
      return;
    }

    // Splitting the content if there is new lines
    let parts: string[] = content.split("\\n");

    // Splitting long texts
    let tmp: string[] = [];
    parts.forEach((part: string) => {
      if (part.length <= limit) tmp.push(part);
      else {
        let val: string = "";
        for (let i = 0; i < part.length; i++) {
          if (i % limit == 0) {
            tmp.push(val);
            val = "";
          }
          val += part[i];
        }
        tmp.push(val);
      }
    });
    parts = tmp;

    //Getting longest part
    let longest = parts[0].length;
    for (let part of parts) {
      if (part.length > longest) longest = part.length;
    }

    // // Content width
    setWidth(longest * 12);

    // // Content height
    setHeight(parts.length * 35);

    // Set parts
    setParts(parts);
  }, []);

  // **************** Functions ********************

  // To delete message entry
  const deleteMessageEntry = (content: string, senderId: string) => {
    getDocs(
      collection(db, "conversations", currentConversationId, "mess")
    ).then((snap) => {
      snap.forEach((doc) => {
        const data = { ...doc.data() };
        if (data.message === content && data.senderId === senderId)
          deleteDoc(doc.ref);
      });
    });
  };

  const replyMessageEntry = () => {
    setOriginContent(content);
  };

  const actions: ActionLabel[] = [
    {
      icon: AiFillDelete,
      label: "Delete",
      color: "rgb(255,0,0)",
      method: deleteMessageEntry,
    },
    {
      icon: BsFillReplyFill,
      label: "Reply",
      color: "rgb(156, 156, 157)",
      method: replyMessageEntry,
    },
  ];

  // ************  Effects   ************

  useEffect(() => {
    if (content == originContent && scrollToOrigin) {
      const entry = document.querySelector(
        ".message-entry-container"
      ) as HTMLElement;
      entry.scrollIntoView({ behavior: "smooth" });
      setScrollToOrigin(false);
    }
  }, [scrollToOrigin]);

  useEffect(() => {
    if (repliedMessage != "" && content == repliedMessage) {
      console.log(repliedMessage);
      const entry = document.querySelector(
        ".message-entry-container"
      ) as HTMLElement;
      replyRef.current!.scrollIntoView({ behavior: "smooth" });
      setScrollToOrigin(false);
      setRepliedMessage("");
    }
  }, [repliedMessage]);

  const MessageContent = content.includes("data:image") ? (
    <img src={content} />
  ) : content.includes("attachment@") ? (
    <a className="attachment-file" href={content.split("@")[1]}>
      <FaFileDownload />
      <span>{content.split("@")[2]}</span>
    </a>
  ) : (
    <>
      {parts.map((part, index) => (
        <p key={content + index}>{part}</p>
      ))}
    </>
  );

  return (
    <div
      className="message-entry-container"
      style={{ alignSelf: condition ? "flex-start" : "flex-end" }}
      onClick={(e) => {
        e.stopPropagation();
      }}
      ref={replyRef}
    >
      <li
        className="message"
        onMouseEnter={() => setOpacity("75%")}
        onMouseLeave={() => setOpacity("0")}
      >
        {!condition ? (
          <>
            {toggleMenu ? (
              <div id="action-container">
                <Action
                  actions={actions}
                  currentConversationId={currentConversationId}
                  hideAction={() => setToggleMenu(false)}
                  infos={{
                    content: content,
                    senderId: senderId,
                  }}
                />
              </div>
            ) : null}
            <div
              className="message-dots"
              style={{ opacity: opacity }}
              onMouseEnter={() => setOpacity("1")}
              onMouseLeave={() => {
                setOpacity("0");
              }}
              onClick={() => setToggleMenu(true)}
            >
              <BsThreeDotsVertical id="icon" />
            </div>
          </>
        ) : null}
        {!repliedContent || repliedContent == "" ? (
          <div
            style={{
              backgroundColor: condition
                ? "rgb(118, 125, 135)"
                : "rgba(20, 147, 251, 0.641)",
              borderRadius: !condition
                ? "10px 10px 0 10px"
                : "10px 10px 10px 0",
              alignItems: parts.length === 1 ? "center" : "",
            }}
            className="message-container"
          >
            {MessageContent}
          </div>
        ) : (
          <div id="content">
            <div
              className="reply-to"
              onClick={(e) => {
                if (repliedContent != "") {
                  setRepliedMessage(repliedContent);
                }
                e.stopPropagation();
              }}
            >
              <MdReply />
              <p id="replied-content">
                {repliedContent.includes("data:image") ? (
                  <img src={repliedContent} />
                ) : (
                  <span>
                    {repliedContent.length > 50
                      ? repliedContent.slice(0, 50) + "..."
                      : repliedContent}
                  </span>
                )}
              </p>
              <div
                style={{
                  backgroundColor: condition
                    ? "rgb(188, 199, 212)"
                    : "rgb(20,147,251)",
                  borderRadius: !condition
                    ? "10px 10px 0 10px"
                    : "10px 10px 10px 0",
                  alignItems: parts.length === 1 ? "center" : "",
                }}
                className="message-container"
              >
                {MessageContent}
              </div>
            </div>
          </div>
        )}
        {!condition ? null : (
          <>
            <div
              className="message-dots"
              style={{ opacity: opacity }}
              onMouseEnter={() => setOpacity("100%")}
              onMouseLeave={() => setOpacity("0")}
              onClick={() => setToggleMenu(true)}
            >
              <BsThreeDotsVertical id="icon" />
            </div>
            {toggleMenu ? (
              <div id="action-container">
                <Action
                  actions={actions}
                  currentConversationId={currentConversationId}
                  hideAction={() => setToggleMenu(false)}
                  infos={{
                    content: content,
                    senderId: senderId,
                  }}
                />
              </div>
            ) : null}
          </>
        )}
      </li>
    </div>
  );
}

export default MessageEntry;
