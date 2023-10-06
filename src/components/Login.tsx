import { useEffect, useState } from "react";

import "../styles/Login.scss";
import LoginForm from "./LoginForm";
import SignUp from "./SignUpForm";

function Login() {
  // ************** States ***************

  const [isLogin, setIsLogin] = useState(true);

  // ************** Hooks ***************

  const [currentSplash, setCurrentSplash] = useState(1);

  // useEffect(() => {
  //   let handle = setInterval(() => {
  //     const splash = document.querySelector("#splash") as HTMLElement;
  //     splash.style.animation = "fade-out-in 1500ms";
  //     setTimeout(() => {
  //       splash.style.animation = "";
  //     }, 1500);
  //     setCurrentSplash((currentSplash) => {
  //       if (currentSplash == 1) return 2;
  //       else if (currentSplash == 2) return 3;
  //       else if (currentSplash == 3) return 1;
  //       else return currentSplash;
  //     });
  //   }, 5000);
  // }, [isLogin]);

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
              <div id="hseparator"></div>
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
              <div id="hseparator"></div>
            </div>
            <div id="chat-family">
              Chat with <span>Family.</span>
              <div id="r-hseparator"></div>
            </div>
            <div id="way">
              Chat your <span>Way.</span>
              <div id="hseparator"></div>
            </div>
          </>
        ) : (
          <>
            <div id="express">
              Express <span>Yoursel!</span>
              <div id="hseparator"></div>
            </div>
            <div id="share">
              Share your <span>Thoughts</span>
              <div id="r-hseparator"></div>
            </div>
          </>
        )}
      </div>
      {isLogin ? (
        <LoginForm unsetIsLogin={() => setIsLogin(false)} />
      ) : (
        <SignUp setIsLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
}

export default Login;
