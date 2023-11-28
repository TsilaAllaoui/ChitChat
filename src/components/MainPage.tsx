import { signOut } from "@firebase/auth";
import {
  Firestore,
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { useNavigate } from "react-router";
import { ShowProfileContext } from "../Contexts/ShowProfileContext";
import { UserContext } from "../Contexts/UserContext";
import { UserConversationsContext } from "../Contexts/UserConversationsContext";
import { auth, db } from "../Firebase";
import "../styles/MainPage.scss";
import Conversations from "./Conversations";
import Menu from "./Menu";
import Messages from "./Messages";
import "./Model/Modules";
import Popup from "./Popup";
import Profile from "./Profile";
import ToastNotification from "./ToastNotification";
import CallNotification from "./CallNotification";

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

  const { user, setUser, setUserPicture } = useContext(UserContext);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [caller, setCaller] = useState<{
    id: string;
    name: string;
  }>({
    id: "",
    name: "",
  });
  const [videoCall, setVideoCall] = useState(false);

  // ************  Contexts   ************

  const { setUserPseudo } = useContext(UserContext);
  const { currentConversation, userConversationsLoading } = useContext(
    UserConversationsContext
  );
  const { showProfile } = useContext(ShowProfileContext);

  // ************  Effects   ************

  useEffect(() => {
    const root = document.getElementById("root") as HTMLElement;
    root.style.background = "#343646";
  }, []);

  auth.onAuthStateChanged((user) => {
    if (user) {
      setUser(user);
      getDocs(query(collection(db, "users"))).then((docs) => {
        docs.forEach((doc) => {
          if (doc.data().uid == user.uid) {
            setUserPicture(doc.data().picture);
          }
        });
      });
    } else {
      navigate("/login");
    }
  });

  useEffect(() => {
    if (user) {
      setUserPseudo(user?.email!.slice(0, user?.email?.indexOf("@"))!);
    }
  }, [user]);

  // ************  Firebase Hooks   ************

  const [calls, loading, error] = useCollection(query(collection(db, "calls")));

  // ************* Functions **************

  // To log out
  const navigate = useNavigate();
  const logOut = () => {
    signOut(auth).then(() => {
      setRedirectToLogin(true);
      navigate("/login");
    });
  };

  useEffect(() => {
    if (!loading && calls) {
      const associatedCalls = calls.docs.filter(
        (doc) => doc.data().calledId == user?.uid
      );
      if (associatedCalls.length == 1) {
        console.log(associatedCalls[0].data());
        setCaller({
          id: associatedCalls[0].data().callerId,
          name: associatedCalls[0].data().callerName,
        });
      }
    } else if (!calls) {
      setVideoCall(false);
    }
  }, [loading, calls]);

  const endCall = async () => {
    const userIsCaller = user?.uid == caller.id;
    const conversationCall = userIsCaller
      ? await getDocs(
          query(collection(db, "calls"), where("callerId", "==", user?.uid))
        )
      : await getDocs(
          query(collection(db, "calls"), where("calledId", "==", user?.uid))
        );

    conversationCall.forEach((doc) => deleteDoc(doc.ref));
    setVideoCall(false);
    setCaller({ id: "", name: "" });
  };

  const respondCall = () => {
    setVideoCall(true);
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
        conversationsAreLoading={userConversationsLoading}
        logOut={logOut}
      />
      <div id="separator"></div>
      <Conversations loading={userConversationsLoading} />
      <div id="separator"></div>
      <Messages
        conversation={currentConversation}
        setVideoCall={setVideoCall}
        videoCall={videoCall}
      />
      <Profile condition={showProfile} />
      <CallNotification
        caller={caller.name}
        showCondition={caller.id != "" && caller.name != ""}
        action={respondCall}
        onClose={endCall}
      />
    </div>
  );
};
function colleciton(
  db: Firestore,
  arg1: string
): import("@firebase/firestore").DocumentReference<unknown> {
  throw new Error("Function not implemented.");
}
