import { spawn } from "child_process";
import "../styles/MessageEntry.scss";

function MessageEntry({ content, senderId, getterId, masterId }: { content: string; senderId: string, getterId: string, masterId: string }) {
  // Characters limit by line
  const limit: number = 42;

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

  // Content width
  const width: number = longest * 12;

  // Content height
  const height: number = parts.length * 35;

  return (
    <li className="message" style={{ width: width === 12 ? width + 10 : width, height: height, alignSelf: masterId === getterId ? "flex-end" : "flex-start" }} key={senderId}>
      {
        <p>
          {parts.map((part, index) => {
            return <p>{part}</p>;
          })}
        </p>
      }
    </li>
  );
}

export default MessageEntry;
