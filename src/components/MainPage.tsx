import { signOut } from "@firebase/auth";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../Contexts/UserContext";
import { UserConversationsContext } from "../Contexts/UserConversationsContext";
import { auth } from "../Firebase";
import "../Styles/MainPage.scss";
import Conversations from "./Conversations";
import Menu from "./Menu";
import Messages from "./Messages";
import "./Model/Modules";
import Popup from "./Popup";
import Profile from "./Profile";
import { ShowProfileContext } from "../Contexts/ShowProfileContext";

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

  // ************  Contexts   ************

  const { userPseudo, setUserPseudo } = useContext(UserContext);
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
  }, [user]);

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
        conversationsAreLoading={userConversationsLoading}
        logOut={logOut}
      />
      <div id="separator"></div>
      <Conversations loading={userConversationsLoading} />
      <div id="separator"></div>
      <Messages conversation={currentConversation} />
      <Profile condition={showProfile} />
    </div>
  );
};
