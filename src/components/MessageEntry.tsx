import "../styles/MessageEntry.scss";
import { useEffect, useRef, useState } from "react";
import { collection, deleteDoc, getDocs, doc } from "firebase/firestore";
import { BsReplyFill, BsThreeDotsVertical } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { db } from "../Firebase";
import Action from "./Action";
import { ActionLabel } from "./Model/ActionModel";

function MessageEntry({
  content,
  senderId,
  receiverId,
  hostId,
}: {
  content: string;
  senderId: string;
  receiverId: string;
  hostId: string;
}) {
  // ************ Refs ***************

  const menu = useRef<HTMLDivElement>(null);

  // ************ Redux ***************

  const currentConvId = useSelector(
    (state: RootState) => state.currentConvId.id
  );

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
    setCondition(hostId === senderId);

    const dropdowns = document.querySelectorAll(".dropdown");
    if (dropdowns) {
      dropdowns.forEach((dropdown) => {
        const e = dropdown as HTMLDivElement;
        e.style.opacity = "0";
      });
    }
  }, []);

  // **************** Functions ********************

  // Toggle actions menu
  const toggle = (e: React.MouseEvent<HTMLDivElement>) => {
    const dots = e.currentTarget as HTMLDivElement;
    const popUp = dots.nextSibling as HTMLDivElement;
    console.log("Before: ", popUp.style.opacity);
    popUp.style.opacity = popUp.style.opacity === "1" ? "0" : "1";
    const [x, y] = [e.clientX, e.clientY];
    popUp.style.top = parseInt((height / 2 - 10).toString()).toString() + "px";
    popUp.style.left = parseInt((width + 50).toString()).toString() + "px";
    setToggleMenu(!toggleMenu);
  };

  const actions: ActionLabel[] = [
    {
      icon: AiFillDelete,
      label: "Delete",
    },
  ];

  // ************  Rendering   ************

  return (
    <>
    {
      content.includes("data:image") ? null :
      <li
      className="message"
      style={{ alignSelf: condition ? "flex-end" : "flex-start" }}
    >
      <div
        style={{
          width: width === 12 ? width + 10 : width,
          height: height,
          backgroundColor: condition ? "rgb(81, 95, 111)" : "rgb(20,147,251)",
          borderRadius: condition ? "10px 10px 0 10px" : "10px 10px 10px 0",
          alignItems: parts.length === 1 ? "center" : "",
        }}
        onMouseEnter={() => setOpacity("75%")}
        onMouseLeave={() => setOpacity("0")}
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
      <div
        className="dots"
        style={{ opacity: opacity }}
        onMouseEnter={() => setOpacity("100%")}
        onMouseLeave={() => setOpacity("0")}
        onClick={toggle}
      >
        <BsThreeDotsVertical />
      </div>
      <Action
        actions={actions}
        infos={{
          content: content,
          senderId: senderId,
          receiverId: receiverId,
        }}
      />
    </li>
    }
    </>
  );
}

export default MessageEntry;
