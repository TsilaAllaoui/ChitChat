import {
  addDoc,
  collection,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { AiOutlineCamera } from "react-icons/ai";
import { BiMessageRoundedX } from "react-icons/bi";
import { BsChevronLeft } from "react-icons/bs";
import { GoSmiley } from "react-icons/go";
import { ImAttachment } from "react-icons/im";
import { IoSend } from "react-icons/io5";
import { MoonLoader } from "react-spinners";
import { UserContext } from "../Contexts/UserContext";
import { db } from "../Firebase";
import "../Styles/Messages.scss";
import { IConversation } from "./MainPage";
import MessageEntry from "./MessageEntry";
import { Message } from "./Model/Models";

const Messages = ({ conversation }: { conversation: IConversation | null }) => {
  if (!conversation)
    return (
      <>
        <BsChevronLeft id="arrow-icon" />
        <div id="no-message-container">
          <h1>No message selected</h1>
          <BiMessageRoundedX id="no-message-icon" />
        </div>
      </>
    );

  // ************* States ***************

  // State for the messages
  const [messages, setMessages] = useState<Message[]>([]);

  // For the input value
  const [inputValue, setInputValue] = useState("");

  const [lastMessage, setLastMessage] = useState<Message>();

  const [refresh, setRefresh] = useState(false);

  // ************* References **************

  const messagesListRef = useRef<null | HTMLUListElement>(null);

  // ************* Contexts ***************

  const { user, setUser } = useContext(UserContext);

  // ************  Firebase Hooks   ************

  const messRefs = collection(db, "conversations", conversation!.id, "mess");
  const [messageList, loading, error] = useCollection(
    query(messRefs, orderBy("sentTime", "asc"))
  );

  // ************  Effects   ************

  // When changing curren conversation
  useEffect(() => {
    let tmp: any[] = [];
    messageList?.docs.forEach((doc: any) => {
      tmp.push({ ...doc.data(), id: doc.data().id });
    });
    console.log(tmp);
    setMessages(tmp);
    setRefresh(true);
  }, [messageList]);

  // When messages is first displayed
  useEffect(() => {
    setTimeout(() => {
      const ul = document.querySelector("#messages-list") as HTMLElement;
      console.log(ul.scrollHeight);
      ul.scrollTo({ top: ul.scrollHeight, behavior: "smooth" });
    }, 10);
  }, [loading]);

  useEffect(() => {
    if (refresh) {
      const element = messagesListRef.current;
      if (element) {
        const ul = document.querySelector("#messages-list") as HTMLElement;
        console.log(ul.scrollHeight);
        ul.scrollTo({ top: ul.scrollHeight, behavior: "smooth" });
      }
      setRefresh(false);
    }
  }, [refresh]);

  // ************ Functions **************

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Send new message
  const sendToFirebase = (
    e:
      | React.MouseEvent<SVGElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const messRef = collection(db, "conversations", conversation!.id, "mess");
    addDoc(messRef, {
      message: inputValue,
      senderId: user!.uid,
      hostId: conversation!.hostId,
      sentTime: serverTimestamp(),
    });

    setInputValue("");
  };

  const scrollToLastMessage = () => {
    let tmp: any[] = [];
    messageList?.docs.forEach((doc) => {
      tmp.push({ ...doc.data(), id: doc.data().id });
    });
    console.log("last message: ", messages[messages.length - 1]);

    const element = messagesListRef.current;
    if (
      element?.scrollHeight! > element?.clientHeight! ||
      element?.scrollWidth! > element?.clientWidth!
    ) {
      console.log("overflow");
      const last = messagesListRef.current?.lastChild as HTMLLIElement;
      last?.scrollIntoView();
    }
    setMessages(tmp);
  };

  // ************  Rendering   ************

  return (
    <div id="messages-section">
      <div id="messages-container">
        <div id="root-message">
          <div id="messages-list">
            <ul
              ref={messagesListRef}
              style={{ justifyContent: loading ? "center" : "flex-start" }}
            >
              {loading && <MoonLoader size={20} color="#ffffff" />}
              {messages &&
                messages.map((message: Message, i) => {
                  return (
                    <MessageEntry
                      key={i}
                      content={message.message}
                      senderId={message.senderId}
                      hostId={conversation.hostId}
                      currentConversationId={conversation.id}
                    />
                  );
                })}
            </ul>
          </div>
        </div>
        <div>
          <div id="input">
            <form onSubmit={(e) => sendToFirebase(e)}>
              <input
                type="text"
                name="texts"
                id="text-input"
                placeholder="Type message here..."
                onChange={(e) => handleChange(e)}
              />
              <ImAttachment className="icon" />
              <AiOutlineCamera className="icon" />
              <GoSmiley className="icon" />
              <div id="send-container">
                <IoSend onClick={(e) => sendToFirebase(e)} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
