import AgoraUIKit, { PropsInterface } from "agora-react-uikit";
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useCollection } from "react-firebase-hooks/firestore";
import { AiOutlineCamera } from "react-icons/ai";
import { BiMessageRoundedX, BiSolidVideo } from "react-icons/bi";
import { GoSmiley } from "react-icons/go";
import { ImAttachment } from "react-icons/im";
import { IoSend } from "react-icons/io5";
import { MoonLoader } from "react-spinners";
import { ReplyEntryContext } from "../Contexts/ReplyEntryContext";
import { UserContext } from "../Contexts/UserContext";
import { db, storage } from "../Firebase";
import "../styles/Messages.scss";
import EmojisPicker from "./EmojisPicker";
import { IConversation } from "./MainPage";
import MessageEntry from "./MessageEntry";
import { Message } from "./Model/Models";
import ReplyEntry from "./ReplyEntry";
import ToastNotification from "./ToastNotification";
import { RiLoader5Line } from "react-icons/ri";

const Messages = ({
  conversation,
  videoCall,
  setVideoCall,
  answered,
  setAnswered,
}: {
  conversation: IConversation | null;
  videoCall: boolean;
  setVideoCall: (v: boolean) => void;
  answered: boolean;
  setAnswered: (v: boolean) => void;
}) => {
  if (!conversation)
    return (
      <>
        <div id="no-message-container">
          <h1>No message selected</h1>
          <BiMessageRoundedX id="no-message-icon" />
        </div>
      </>
    );

  // ************* States **************

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showNotification, setShowNotification] = useState<{
    state: boolean;
    content: string;
    color: string;
  }>({
    state: false,
    content: "",
    color: "",
  });
  const [pending, setPending] = useState(false);

  const props: PropsInterface = {
    rtcProps: {
      appId: import.meta.env.VITE_AGORA_APP_ID!,
      channel: conversation.id,
      token: null,
    },
    callbacks: {
      EndCall: async () => {
        const conversationCall = await getDocs(
          query(
            collection(db, "calls"),
            where("conversationId", "==", conversation.id)
          )
        );

        conversationCall.forEach((doc) => deleteDoc(doc.ref));
        setVideoCall(false);
      },
    },
    styleProps: {
      localBtnContainer: { backgroundColor: "red" },
      UIKitContainer: {
        height: "100%",
        width: "50%",
        zIndex: "5",
      },
    },
  };

  // ************* References **************

  const messagesListRef = useRef<null | HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  // ************* Contexts ***************

  const { user } = useContext(UserContext);
  const {
    originContent,
    setOriginContent,
    content,
    setContent,
    sendReply,
    setSendReply,
  } = useContext(ReplyEntryContext);

  // ************  Firebase Hooks   ************

  const messRefs = collection(db, "conversations", conversation!.id, "mess");
  const [messageList, loading, error] = useCollection(
    query(messRefs, orderBy("sentTime", "asc"))
  );

  const [calls, callsLoading, callsError] = useCollection(
    query(collection(db, "calls"))
  );

  // ************  Effects   ************

  // When changing curren conversation
  useEffect(() => {
    let tmp: any[] = [];
    messageList?.docs.forEach((doc: any) => {
      tmp.push({ ...doc.data(), id: doc.data().id });
    });
    setMessages(tmp);
    setRefresh(true);
  }, [messageList]);

  // When messages is first displayed
  useEffect(() => {
    setTimeout(() => {
      const ul = document.querySelector("#messages-list") as HTMLElement;
      ul.scrollTo({ top: ul.scrollHeight, behavior: "smooth" });
    }, 20);
  }, [loading]);

  useEffect(() => {
    if (refresh) {
      const element = messagesListRef.current;
      if (element) {
        const ul = document.querySelector("#messages-list") as HTMLElement;
        ul.scrollTo({ top: ul.scrollHeight, behavior: "smooth" });
      }
      setRefresh(false);
    }
  }, [refresh]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = inputValue;
    }
  }, [inputValue]);

  useEffect(() => {
    if (callsError) console.error(callsError.message);
    if (calls) {
      if (calls.docs.length == 0) {
        console.log(calls.docs);
        setVideoCall(false);
        setAnswered(false);
      } else if (calls.docs.length == 1 && answered) {
        console.log(calls.docs.length + " : " + answered);
        // && videoCall) {
        setVideoCall(true);
      }
    }
  }, [callsLoading, calls, callsError]);

  // ************ Functions **************

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Send new message
  const sendMessageToFirebase = (message: string) => {
    const messRef = collection(db, "conversations", conversation!.id, "mess");
    addDoc(messRef, {
      message,
      senderId: user!.uid,
      hostId: conversation!.hostId,
      sentTime: serverTimestamp(),
    });

    setInputValue("");
  };

  const sendToFirebase = (
    e:
      | React.MouseEvent<SVGElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    sendMessageToFirebase(inputValue);
  };

  const uploadPicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files) return;
    const file = e.currentTarget.files[0];
    file.arrayBuffer().then((arr) => {
      const bytes = new Uint8Array(arr);
      let str = "";
      for (let byte of bytes) {
        str += String.fromCharCode(byte);
      }
      str = `data:image/png;base64,${btoa(str)}`;
      sendMessageToFirebase(str);
    });
  };

  const uploadAttachmentFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files) return;
    const file = e.currentTarget.files[0];

    if (file.size > 30000000) {
      setShowNotification({
        state: true,
        content: "File too large (must be less or equal to 30MB)",
        color: "red",
      });
      setTimeout(() => {
        const toast = document.querySelector(".toast-content") as HTMLElement;
        toast.style.animation = "fade-out 250ms forwards";
        setTimeout(
          () =>
            setShowNotification({
              state: false,
              content: "",
              color: "",
            }),
          1000
        );
      }, 3000);
      return;
    }

    setShowNotification({
      state: true,
      content: "Uploading file...",
      color: "green",
    });

    const imageRef = ref(storage, conversation.id + "/" + file.name);
    uploadBytes(imageRef, file)
      .then((snapshot) => {
        console.log("file" + snapshot.ref.fullPath + "uploaded");
        getDownloadURL(imageRef).then((url) => {
          console.log(url);
          sendMessageToFirebase("attachment@" + url + "@" + file.name);
        });
        setTimeout(() => {
          const toast = document.querySelector(".toast-content") as HTMLElement;
          toast.style.animation = "fade-out 250ms forwards";
          setTimeout(
            () =>
              setShowNotification({
                state: false,
                content: "",
                color: "",
              }),
            1000
          );
        }, 3000);
      })
      .catch((err) => console.error(err));
  };

  const videoRef = useRef<HTMLVideoElement>(null);

  const call = async () => {
    const conversationCall = await getDocs(
      query(
        collection(db, "calls"),
        where("conversationId", "==", conversation.id)
      )
    );

    if (conversationCall.size > 0) {
      console.log("Call already in...");
      return;
    }

    const callRef = collection(db, "calls");
    addDoc(callRef, {
      callerId: user?.uid,
      callerName: user?.displayName,
      calledId:
        conversation.hostId == user?.uid
          ? conversation.guestId
          : conversation.hostId,
      calledName:
        conversation.hostId == user?.uid
          ? conversation.guestName
          : conversation.hostName,
      conversationId: conversation.id,
    }).then(() => {
      setPending(false);
      setVideoCall(true);
    });
  };

  // ************  Effects   ************

  useEffect(() => {
    if (sendReply) {
      const messRef = collection(db, "conversations", conversation!.id, "mess");
      addDoc(messRef, {
        message: content,
        senderId: user!.uid,
        hostId: conversation!.hostId,
        sentTime: serverTimestamp(),
        repliedContent: originContent,
      });
      setContent("");
      setOriginContent("");
      setSendReply(false);
    }
  }, [sendReply]);

  return (
    <>
      <div className="container">
        <div className="header">
          <h1>{conversation.hostName}</h1>
          {videoCall ? null : pending ? (
            <RiLoader5Line className="spinner" />
          ) : (
            <BiSolidVideo
              className="webcam"
              title="Video call"
              onClick={() => {
                setPending(true);
                call();
              }}
            />
          )}
        </div>
        {videoCall || answered ? (
          <div className="video-call">
            <AgoraUIKit
              styleProps={props.styleProps}
              rtcProps={props.rtcProps}
              callbacks={props.callbacks}
            />
          </div>
        ) : (
          <div id="messages-section" onClick={() => setOriginContent("")}>
            <div id="messages-container">
              <div id="root-message">
                <div id="messages-list">
                  <ul
                    ref={messagesListRef}
                    style={{
                      justifyContent: loading ? "center" : "flex-start",
                    }}
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
                            repliedContent={message.repliedContent}
                          />
                        );
                      })}
                  </ul>
                </div>
                <ReplyEntry />
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <div id="input">
                  <form onSubmit={(e) => sendToFirebase(e)}>
                    <input
                      ref={inputRef}
                      type="text"
                      name="texts"
                      id="text-input"
                      placeholder="Type message here..."
                      onChange={(e) => handleChange(e)}
                    />
                    <div id="actions">
                      <ImAttachment
                        className="icon"
                        onClick={() => attachmentInputRef.current?.click()}
                      />
                      <AiOutlineCamera
                        className="icon"
                        onClick={() => fileInputRef.current?.click()}
                      />
                      <input
                        ref={fileInputRef}
                        type="file"
                        name="picture"
                        className="file"
                        onChange={uploadPicture}
                        accept="image/*"
                      />
                      <input
                        ref={attachmentInputRef}
                        type="file"
                        name="picture"
                        className="file"
                        onChange={uploadAttachmentFile}
                        accept=".docx, .pdf, .xlsx, .csv, .txt, .rar, .zip"
                      />
                      <GoSmiley
                        className="icon"
                        onClick={() => setShowEmojiPicker(true)}
                      />
                    </div>
                    {showEmojiPicker
                      ? createPortal(
                          <EmojisPicker
                            updateMessage={(val: string) => {
                              if (originContent != "") {
                                let tmp = content + val;
                                setContent(tmp);
                              } else setInputValue(inputValue + val);
                            }}
                            hide={() => setShowEmojiPicker(false)}
                          />,
                          document.getElementById("portal") as HTMLElement
                        )
                      : null}
                    <div id="send-container">
                      <IoSend onClick={(e) => sendToFirebase(e)} />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastNotification
        content={showNotification.content}
        showCondition={showNotification.state}
        color={showNotification.color}
      />
    </>
  );
};

export default Messages;
