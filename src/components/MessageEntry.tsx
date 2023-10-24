import { useContext, useEffect, useRef, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BsFillReplyFill, BsThreeDotsVertical } from "react-icons/bs";
import "../styles/MessageEntry.scss";
import Action from "./Action";
import { ActionLabel } from "./Model/ActionModel";
import { UserContext } from "../Contexts/UserContext";

function MessageEntry({
  content,
  senderId,
  hostId,
  currentConversationId,
}: {
  content: string;
  senderId: string;
  hostId: string;
  currentConversationId: string;
}) {
  // ************ Refs ***************

  const menu = useRef<HTMLDivElement>(null);

  // ************ Contexts ************

  const user = useContext(UserContext).user;

  // ************  States   ************

  // Characters limit by line
  const [limit, setLimit] = useState(45);

  // State for the width of the message body
  const [width, setWidth] = useState(0);

  // State for the heigth of the message body
  const [height, setHeight] = useState(0);

  // State for message parts
  const [parts, setParts] = useState<string[]>([]);

  // State for condition to align message
  const [condition, setCondition] = useState(false);

  // State to show/hide dots button
  const [opacity, setOpacity] = useState("0");

  // State to toggle dots menu actions
  const [toggleMenu, setToggleMenu] = useState(false);

  // ************ Effects **************

  // Getting and splitting messages on first render
  useEffect(() => {
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

    // Condition to know if message entry was sent by who
    setCondition(user!.uid != senderId);
  }, []);

  // **************** Functions ********************

  const actions: ActionLabel[] = [
    {
      icon: AiFillDelete,
      label: "Delete",
      color: "rgb(255,0,0)",
    },
    {
      icon: BsFillReplyFill,
      label: "Reply",
      color: "rgb(81, 81, 172)",
    },
  ];

  // ************  Rendering   ************

  return (
    <>
      {content.includes("data:image") ? null : (
        <li
          className="message"
          style={{ alignSelf: condition ? "flex-start" : "flex-end" }}
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
                className="dots"
                style={{ opacity: opacity }}
                onMouseEnter={() => setOpacity("1")}
                onMouseLeave={() => {
                  setOpacity("0");
                  console.log(document.activeElement);
                }}
                onClick={() => setToggleMenu(true)}
              >
                <BsThreeDotsVertical id="icon" />
              </div>
            </>
          ) : null}
          <div
            style={{
              width: width === 12 ? width + 10 : width,
              height: height,
              backgroundColor: condition
                ? "rgb(188, 199, 212)"
                : "rgb(20,147,251)",
              borderRadius: condition ? "10px 10px 0 10px" : "10px 10px 10px 0",
              alignItems: parts.length === 1 ? "center" : "",
            }}
            className="message-container"
          >
            {parts.map((part, index) => (
              <p
                key={content + index}
                style={{
                  marginTop: parts.length === 1 ? "5px" : "0",
                }}
              >
                {part}
              </p>
            ))}
          </div>
          {!condition ? null : (
            <>
              <div
                className="dots"
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
      )}
    </>
  );
}

export default MessageEntry;
