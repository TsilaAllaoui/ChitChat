import { signOut } from "@firebase/auth";
import { collection, query } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { useNavigate } from "react-router";
import { UserContext } from "../Contexts/UserContext";
import { UserConversationsContext } from "../Contexts/UserConversationsContext";
import { auth, db } from "../Firebase";
import "../Styles/MainPage.scss";
import Conversations from "./Conversations";
import Menu from "./Menu";
import Messages from "./Messages";
import "./Model/Modules";
import Popup from "./Popup";

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

  const {
    userConversations,
    setUserConversations,
    currentConversation,
    setCurrentConversation,
  } = useContext(UserConversationsContext);

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
      <Menu
        conversationsAreLoading={loading}
        userPseudo={userPseudo}
        logOut={logOut}
      />
      <div id="separator"></div>
      <Conversations loading={loading} />
      <div id="separator"></div>
      <Messages conversation={currentConversation} />
    </div>
  );
};
