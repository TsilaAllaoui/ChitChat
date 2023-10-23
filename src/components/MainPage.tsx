import {
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { setCurrentConv } from "../redux/slices/currentConversationSlice";
import { onAuthStateChanged, signOut } from "@firebase/auth";
import { AiFillSetting, AiFillHome } from "react-icons/ai";
import { IoMdCall, IoMdAttach } from "react-icons/io";
import { BsChevronLeft, BsFillChatDotsFill } from "react-icons/bs";
import { update } from "../redux/slices/userSlice";
import messagesSvg from "../assets/messages.svg";
import { RiShutDownLine } from "react-icons/ri";
// import Conversations from "./Conversations";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { RootState } from "../redux/store";
import { MdDelete } from "react-icons/md";
import { getInitiials } from "./Model/Modules";
import { auth, db } from "../Firebase";
import Messages from "./Messages";
import "../styles/MainPage.scss";
import "./Model/Modules";
import { UserContext } from "../Contexts/UserContext";
import Popup from "./Popup";
import { BiMessageRoundedX, BiUser } from "react-icons/bi";
import { useCollection } from "react-firebase-hooks/firestore";
import Conversation from "./Conversation";
import { RotateLoader } from "react-spinners";

export type IConversation = {
  guestId: string;
  guestName: string;
  hostId: string;
  hostName: string;
  id: string;
  participants: string[];
};

export const MainPage = () => {
  // ************  States   ************

  const { user, setUser } = useContext(UserContext);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [userConversations, setUserConversations] = useState<IConversation[]>(
    []
  );
  const [currentConversation, setCurrentConversation] =
    useState<IConversation | null>(null);

  const [userPseudo, setUserPseudo] = useState("");

  // ************  Firestore hooks   ************

  const [value, loading, error] = useCollection(
    query(collection(db, "conversations"))
  );

  // ************  Effects   ************

  useEffect(() => {
    const root = document.getElementById("root") as HTMLElement;
    root.style.background = "#343646";
  }, []);

  auth.onAuthStateChanged((user) => {
    if (user) {
      setUser(user);
    } else {
      navigate("/login");
    }
  });

  useEffect(() => {
    if (user) {
      setUserPseudo(
        user!.displayName
          ? user?.displayName![0].toUpperCase() + user?.displayName!.slice(1)!
          : user?.email![0].toUpperCase() +
              user?.email!.slice(1, user?.email?.indexOf("@"))!
      );
    }
    const tmp: IConversation[] = [];
    value?.docs.map((doc) => {
      const data = doc.data();
      if (data.guestId == user!.uid || data.hostId == user!.uid) {
        tmp.push({
          guestId: data.guestId,
          guestName: data.guestName,
          hostId: data.hostId,
          hostName: data.hostName,
          id: data.id,
          participants: data.participants,
        });
      }
    });
    setUserConversations(tmp);
  }, [user, loading]);

  // ************* Functions **************

  // To log out
  const navigate = useNavigate();
  const logOut = () => {
    signOut(auth).then(() => {
      setRedirectToLogin(true);
      navigate("/login");
    });
  };

  return (
    <div id="main">
      {redirectToLogin ? (
        <Popup
          content="Logging out... Redirection in progess..."
          hidePopup={() => setRedirectToLogin(false)}
        />
      ) : null}
      <div id="menu-section">
        <div id="menus">
          <AiFillHome className="actions" />
          <BsFillChatDotsFill className="actions" />
          <AiFillSetting className="actions" />
        </div>
        <div id="others">
          <p>{userPseudo}</p>
          <BiUser id="image-profile" />
          <RiShutDownLine id="shutdown" onClick={logOut} />
        </div>
      </div>
      <div id="separator"></div>
      <div id="convsersations-section">
        <h1>Conversations</h1>
        {loading ? (
          <RotateLoader
            size={15}
            color="#ffffff"
            speedMultiplier={0.5}
            id="conversations-loading"
          ></RotateLoader>
        ) : (
          userConversations.map((conversation) => (
            <>
              <div
                className="conversation"
                key={conversation.id}
                onClick={(e) => setCurrentConversation(conversation)}
              >
                {user!.uid == conversation.hostId
                  ? conversation.guestName
                  : conversation.hostName}
              </div>
            </>
          ))
        )}
      </div>
      <div id="separator"></div>
      <div id="messages-section">
        {currentConversation ? (
          <Messages conversation={currentConversation} />
        ) : (
          <>
            <BsChevronLeft id="arrow-icon" />
            <div id="no-message-container">
              <h1>No message selected</h1>
              <BiMessageRoundedX id="no-message-icon" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
