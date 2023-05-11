import "../styles/MessageEntry.scss";
import { useEffect, useRef, useState } from "react";
import { serverTimestamp } from "firebase/firestore";
import { BsReplyFill, BsThreeDotsVertical } from "react-icons/bs";
import { IconType } from "react-icons/lib";
import { AiFillDelete } from "react-icons/ai";

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

  // ************  States   ************

  // Characters limit by line
  const [limit, setLimit] = useState(42);

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
  }, []);

  useEffect(() => {
    if (toggleMenu) {
      const element = menu.current as HTMLElement;
      const [x, y] = [
        element!.getBoundingClientRect().x,
        element!.getBoundingClientRect().y,
      ];
      menu.current!.style.opacity = "75%";
      menu.current!.style.left = parseInt((x + 25).toString()) + "px";
      menu.current!.style.top = parseInt(y.toString()) + "px";
    } else menu.current!.style.opacity = "0";
  }, [toggleMenu])


  const toggle = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log("TOGGLE: ", toggleMenu);
    setToggleMenu(!toggleMenu);
  };

  // ************  Rendering   ************

  return (
    <li className="message">
      <div
        style={{
          width: width === 12 ? width + 10 : width,
          height: height,
          alignSelf: condition ? "flex-end" : "flex-start",
          backgroundColor: condition ? "rgb(81, 95, 111)" : "rgb(20,147,251)",
          borderRadius: condition ? "10px 10px 0 10px" : "10px 10px 10px 0",
          alignItems: parts.length === 1 ? "center" : "",
        }}
        onMouseEnter={() => setOpacity("75%")}
        onMouseLeave={() => setOpacity("0")}
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
        onMouseEnter={() => setOpacity("75%")}
        onMouseLeave={() => setOpacity("0")}
        onClick={toggle}
        id={content}
      >
        <BsThreeDotsVertical />
      </div>
      <div className="actions" ref={menu}
        onMouseLeave={() => setToggleMenu(false)}
      >
        <button>
          <AiFillDelete />
          Delete
        </button>
        <button>
          <BsReplyFill/>
          Reply
        </button>
      </div>
    </li>
  );
}

export default MessageEntry;
