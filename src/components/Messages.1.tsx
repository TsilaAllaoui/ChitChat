import { addDoc, collection, query, serverTimestamp } from "firebase/firestore";
import React, { useState, useEffect, useRef, useContext } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { IoSend } from "react-icons/io5";
import MessageEntry from "./MessageEntry";
import { db } from "../Firebase";
import { Message } from "./Model/Models";
import { IConversation } from "./MainPage";
import { UserContext } from "../Contexts/UserContext";

export function Messages({ conversation }: { conversation: IConversation }) {
  // ************* States ***************
  // State for the messages
  const [messages, setMessages] = useState<Message[]>([]);

  // Debug
  const [count, setCount] = useState(0);

  // For the input value
  const [inputValue, setInputValue] = useState("");

  const [lastMessage, setLastMessage] = useState<Message>();

  // ************* References **************
  const messagesListRef = useRef<null | HTMLUListElement>(null);

  // ************* Contexts ***************
  const { user, setUser } = useContext(UserContext);

  // ************  Firebase Hooks   ************
  const messRefs = collection(db, "conversations", conversation.id, "mess");
  const [messageList, loading, error] = useCollection(
    query(messRefs) //, orderBy("sentTime"))
  );

  // ************  Effects   ************
  // When changing curren conversation
  useEffect(() => {
    let tmp: any[] = [];
    messageList?.docs.forEach((doc: any) => {
      tmp.push({ ...doc.data(), id: doc.data().id });
    });
    setMessages(tmp);
  }, [loading]);

  // When messages list is updated
  useEffect(() => {
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
  }, [messageList]);

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
      hostId: user!.uid,
      sentTime: serverTimestamp(),
    });

    setInputValue("");
  };

  const deleteMessageEntry = () => {};

  // ************  Rendering   ************
  return (
    <div id="root-message">
      <div id="messages-list">
        <ul ref={messagesListRef}>
          {loading && <Spinner name="circle" />}
          {messages &&
            messages.map((message: Message) => {
              return (
                <MessageEntry
                  key={message.id + message.message}
                  content={message.message}
                  senderId={message.senderId}
                  receiverId={message.receiverId}
                  hostId={conversation.hostId}
                  currentConversationId={conversation.id}
                />
              );
            })}
        </ul>
      </div>
      <div>
        <div id="input">
          <form onSubmit={(e) => sendToFirebase(e)}>
            <input
              type="text"
              name="texts"
              id="text-input"
              onChange={(e) => handleChange(e)}
            />
            <IoSend id="send-button" onClick={(e) => sendToFirebase(e)} />
          </form>
        </div>
      </div>
    </div>
  );
}
