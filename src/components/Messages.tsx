import {
  addDoc,
  collection,
  doc,
  Firestore,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import { BsFillEmojiSmileFill, BsFillSendFill } from "react-icons/bs";
import React, { useState, useEffect, SetStateAction, ReactNode } from "react";
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
import { Message } from "./Models";
import "../styles/Messages.scss";
import { setCurrentConv } from "../redux/slices/currentConversationSlice";

function Messages() {
  // State for the messages
  const [messages, setMessages] = useState<Message[]>([]);
  //     {
  //         message: "Kez",
  //         receiverId: "456",
  //         senderId: "123",
  //         id: "123"
  //     },
  //     {
  //         message: "Salut",
  //         receiverId: "123",
  //         senderId: "456",
  //         id: "123"
  //     }
  // ]);

  const currentConvId = useSelector((state: RootState) => state.currentConvId.id);
  const currentConvHostId = useSelector((state: RootState) => state.currentConvId.hostId);
  const id = useSelector((state: RootState) => state.user.id);
  const user = useSelector((state: RootState) => state.user);
  const guestId = useSelector(
    (state: RootState) => state.chosenUser.chosenUser.id
  );

  const [inputValue, setInputValue] = useState("");

  // ************  Firebase Hooks   ************
  const messRefs = collection(db, "conversations", currentConvId, "mess");
  const q = query(messRefs, orderBy("sentTime"));
  const [messageList, loading, error] = useCollection(q);

  // ************  Effects   ************

  useEffect(() => {
    let tmp: any[] = [];
    messageList?.docs.forEach((doc) => {
      tmp.push({ ...doc.data(), id: doc.data().id });
    });
    setMessages(tmp);
  }, [currentConvId]);

//   useEffect(() => {
//     if (messageList?.docs.length === 0) {
//       let tmp: any[] = [];
//       messageList?.docs.forEach((doc) => {
//         tmp.push({ ...doc.data(), id: doc.data().id });
//       });
//       setMessages(tmp);
//     } else {
//       let tmp: any[] = messages;
//       tmp.push(messageList?.docs[messageList?.docs.length - 1]);
//       setMessages(tmp);
//     }
//     console.log(messages);
//   }, [messageList]);

  useEffect(() => {
    let tmp: any[] = [];
    messageList?.docs.forEach((doc) => {
      tmp.push({ ...doc.data(), id: doc.data().id });
    });
    setMessages(tmp);
    
    const list = document.querySelector("#messages-list ul") as HTMLDivElement;
    list.scrollTop = list.scrollHeight;

    console.log(user);
  }, [messageList]);

  // ************ Functions **************

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

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
    const list = document.querySelector("#text-input") as HTMLDivElement;
    list.value = "";
  };

  /*// ************  States   ************
 
    // State for the messages
    const [messages, setMessages] = useState<Message[]>([]);
 
    // State for user id
    const [userId, setUserId] = useState("");
 
    // ************  Firebase Hooks   ************
    const messRefs = collection(db, "conversations", convId, "mess");
    const q = query(messRefs, );
    const [messageList, loading, error] = useCollection(q);
 
    // ************  Effects   ************  
 
    // For getting messages when the conversation change
    useEffect(() => {
        
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                getMessages();
            } else {
                const navigate = useNavigate();
                navigate("/login");
            }
        });
    }, [userId]);
 
    useEffect(() => {
        getMessages();
    }, [messageList]);
 
    // ************  Functions   ************
 
    // Getting messages from firebase
    const getMessages = () => {
 
        let list: any[] = [];
        messageList?.forEach((doc) => {
            list.push({...doc.data(), id: doc.data().id});
        });
        setMessages(list);
    };
 
    // For adding new message to firebase
    const sendToFirebase = (e: any) => {
        e.preventDefault();
 
        const auth = getAuth();
        const db = getFirestore();
        const messRef = collection(db, "conversations", convId, "mess");
        addDoc(messRef,
            {
                message: e.target.elements.texts.value,
                senderId: hostId,
                receiverId: guestId,
                sentTime: Timestamp.now()
            })
    };
*/

  // ************  Rendering   ************

  return (
    <div id="root-message">
      <div id="messages-list">
        <ul>
          {error && <p>{JSON.stringify(error)}</p>}
          {loading && <p>Loading messages...</p>}
          {messages &&
            messages.map((message: Message) => {
                console.log("hostId: ",currentConvHostId)
                console.log("senderId: ",message.senderId)
                console.log("receiverId: ",message.receiverId)

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
        {messages.length === 0 ? null : (
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
        )}
      </div>
    </div>
  );
}

export default Messages;
