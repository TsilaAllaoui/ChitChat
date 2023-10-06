import { useContext, useEffect, useState } from "react";

import "../styles/Login.scss";
import LoginForm from "./LoginForm";
import SignUp from "./SignUpForm";
import { createPortal } from "react-dom";
import Popup from "./Popup";
import { RedirectPopupContext } from "../Contexts/RedirectPopupContext";
import { IsLoginContext } from "../Contexts/IsLoginContext";

function Login() {
  // ************** States ***************

  const { isLogin, setIsLogin } = useContext(IsLoginContext);
  const { redirect, setRedirect } = useContext(RedirectPopupContext);

  // ************** Hooks ***************

  const [currentSplash, setCurrentSplash] = useState(1);

  // ************** Effects ***************

  useEffect(() => {
    let handle = setInterval(() => {
      const splash = document.querySelector("#splash") as HTMLElement;
      splash.style.animation = "fade-out-in 1500ms";
      setTimeout(() => {
        splash.style.animation = "";
      }, 1500);
      setCurrentSplash((currentSplash) => {
        if (currentSplash == 1) return 2;
        else if (currentSplash == 2) return 3;
        else if (currentSplash == 3) return 1;
        else return currentSplash;
      });
    }, 5000);
  }, [isLogin]);

  // ****************** Rendering *****************

  return (
    <div
      id="main-login"
      style={{
        justifyContent: isLogin ? "center" : "space-between",
      }}
    >
      <div
        id="splash"
        style={{
          backgroundImage: `url(\"./splash${currentSplash}.svg\")`,
        }}
      >
        {currentSplash == 1 ? (
          <>
            <div id="chitchat">
              ChitChat.
              <div id="r-hseparator"></div>
            </div>
            <div id="info">
              The way to chat.
              <div id="r-hseparator"></div>
            </div>
          </>
        ) : currentSplash == 2 ? (
          <>
            <div id="chat-friend">
              Chat with <span>Friend.</span>
              <div id="r-hseparator"></div>
            </div>
            <div id="chat-family">
              Chat with <span>Family.</span>
              <div id="r-hseparator"></div>
            </div>
            <div id="way">
              Chat your <span>Way.</span>
              <div id="r-hseparator"></div>
            </div>
          </>
        ) : (
          <>
            <div id="express">
              Express <span>Yoursel!</span>
              <div id="r-hseparator"></div>
            </div>
            <div id="share">
              Share your <span>Thoughts</span>
              <div id="r-hseparator"></div>
            </div>
          </>
        )}
      </div>
      {isLogin ? <LoginForm /> : <SignUp />}
    </div>
  );
}

export default Login;
