import "../styles/MessageEntry.scss";
import { useEffect, useState } from "react";
import { serverTimestamp } from "firebase/firestore";

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
  // ************  States   ************

  // Characters limit by line
  const [limit, setLimit] = useState(42);

  // State for the width of the message body
  const [width, setWidth] = useState(0);

  // State for the heigth of the message body
  const [height, setHeight] = useState(0);

  // State for message parts
  const [parts, setParts] = useState<string[]>([]);

  const [condition, setCondition] = useState(false);

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

  // ************  Functions   ************

  // ************  Rendering   ************

  return (
    <li
      className="message"
      style={{
        width: width === 12 ? width + 10 : width,
        height: height,
        alignSelf: condition ? "flex-end" : "flex-start",
        backgroundColor: condition ? "rgb(81, 95, 111)" : "rgb(20,147,251)",
        borderRadius: condition ? "10px 10px 0 10px" : "10px 10px 10px 0",
      }}
    >
      {parts.map((part, index) => (
        <p key={content + index}>{part}</p>
      ))}
    </li>
  );
}

export default MessageEntry;
