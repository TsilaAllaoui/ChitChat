import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import React, {
  useState,
  useEffect,
  SetStateAction,
  ReactNode,
  useRef,
} from "react";
import { setCurrentConv } from "../redux/slices/currentConversationSlice";
import {
  BsFillEmojiSmileFill,
  BsFillSendFill,
  BsThreeDotsVertical,
} from "react-icons/bs";
import { useCollection } from "react-firebase-hooks/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineFileGif } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { IoIosAttach } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { RootState } from "../redux/store";
import MessageEntry from "./MessageEntry";
import { auth, db } from "../Firebase";
import { Message } from "./Model/Models";
import "../styles/Messages.scss";

function Messages() {
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

  // ************* Reducers ***************

  const user = useSelector((state: RootState) => state.user);
  const guestId = useSelector(
    (state: RootState) => state.chosenUser.chosenUser.id
  );
  const id = useSelector((state: RootState) => state.user.id);
  const currentConvId = useSelector(
    (state: RootState) => state.currentConvId.id
  );
  const currentConvHostId = useSelector(
    (state: RootState) => state.currentConvId.hostId
  );
  const currentReply = useSelector(
    (state: RootState) => state.reply.replyMessage
  );

  // ************  Firebase Hooks   ************

  const messRefs = collection(db, "conversations", currentConvId, "mess");
  const q = query(messRefs, orderBy("sentTime"));
  const [messageList, loading, error] = useCollection(q);

  // ************  Effects   ************

  // When changing curren conversation
  useEffect(() => {
    let tmp: any[] = [];
    messageList?.docs.forEach((doc) => {
      tmp.push({ ...doc.data(), id: doc.data().id });
    });
    setMessages(tmp);
  }, [currentConvId]);

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

    const messRef = collection(db, "conversations", currentConvId, "mess");
    addDoc(messRef, {
      message: inputValue,
      senderId: id,
      receiverId: guestId,
      hostId: currentConvHostId,
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
          {error && <p>{JSON.stringify(error)}</p>}
          {loading && <p>Loading messages...</p>}
          {messages &&
            messages.map((message: Message) => {
              return (
                <MessageEntry
                  key={message.id + message.message}
                  content={message.message}
                  senderId={message.senderId}
                  receiverId={message.receiverId}
                  hostId={currentConvHostId}
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

export default Messages;
