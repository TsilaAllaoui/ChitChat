import { spawn } from "child_process";
import "../styles/MessageEntry.scss";

function MessageEntry({ content, senderId, receiverId, hostId }: { content: string; senderId: string, receiverId: string, hostId: string }) {

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

  // Condition to know if message entry was sent by who
  const senderCondition = hostId === senderId;

  return (
    <li className="message" style={{ width: width === 12 ? width + 10 : width, 
                                     height: height, 
                                     alignSelf: senderCondition ? "flex-end" : "flex-start",
                                     backgroundColor: senderCondition ? "#A5D7E8" : "#576CBC",
                                     borderRadius: senderCondition ? "10px 10px 0 10px" : "10px 10px 10px 0"}} key={senderId + Date.now()}>
        {
          parts.map((part, index) => part)
        } 
    </li>
  );
}

export default MessageEntry;
