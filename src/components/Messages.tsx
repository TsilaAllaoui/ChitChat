import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { IoSend } from "react-icons/io5";
import { MoonLoader } from "react-spinners";
import { UserContext } from "../Contexts/UserContext";
import { db } from "../Firebase";
import "../Styles/Messages.scss";
import { IConversation } from "./MainPage";
import MessageEntry from "./MessageEntry";
import { Message } from "./Model/Models";
import { GoSmiley } from "react-icons/go";
import { AiFillCamera, AiOutlineCamera } from "react-icons/ai";
import { ImAttachment } from "react-icons/im";

const Messages = ({ conversation }: { conversation: IConversation }) => {
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

  const messRefs = collection(db, "conversations", conversation.id, "mess");
  const [messageList, loading, error] = useCollection(
    query(messRefs, orderBy("sentTime", "asc"))
  );

  // ************  Effects   ************

  useEffect(() => {
    console.log(conversation);
  }, [conversation]);

  // When changing curren conversation
  useEffect(() => {
    let tmp: any[] = [];
    messageList?.docs.forEach((doc: any) => {
      tmp.push({ ...doc.data(), id: doc.data().id });
    });
    console.log(tmp);
    setMessages(tmp);
  }, [messageList]);

  // When messages list is updated
  useEffect(() => {
    setRefresh(true);
  }, [messageList]);

  useEffect(() => {
    if (refresh) {
      const element = messagesListRef.current;
      if (element) {
        const last = element!.children[element!.children.length - 1];
        last.scrollIntoView();
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

    const messRef = collection(db, "conversations", conversation.id, "mess");
    addDoc(messRef, {
      message: inputValue,
      senderId: user!.uid,
      hostId: conversation.hostId,
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
  );
};

export default Messages;
