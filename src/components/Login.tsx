import {
  GoogleAuthProvider,
  browserSessionPersistence,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "@firebase/auth";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import app, { auth, gauthProvider } from "../Firebase";
import logo from "../assets/logo.svg";
import "../styles/Login.scss";

function Login() {
  // ************** States **************

  // States for the inputs
  const [emailValue, setEmailValue] = useState("ratsilakwel@gmail.com");
  const [passwordValue, setPasswordValue] = useState("123456789");
  const [agreementsChecked, setAgreementsChecked] = useState(false);

  // ************** Hooks ***************

  // For navigation
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (redirect) {
      alert("Login success... Redirecting to conversations...");
      navigate("/main");
    }
  }, [redirect]);

  const [currentSplash, setCurrentSplash] = useState(1);

  useEffect(() => {
    setInterval(() => {
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
      console.log("update");
    }, 5000);
  }, []);

  // ************** Functions ****************

  const setAgreementsError = () => {
    const agreements = document.querySelector(
      "#agreements > p"
    ) as HTMLPreElement;
    agreements.style.color = "red";
    agreements.style.animation = "shake 500ms ease-in-out";
    setTimeout(() => {
      agreements.style.color = "black";
      agreements.style.animation = "";
    }, 500);
  };

  // For login redirection
  const redirectToLogin = () => {
    if (!agreementsChecked) {
      setAgreementsError();
      return;
    }
    const auth = getAuth(app);
    setPersistence(auth, browserSessionPersistence).then(() =>
      signInWithEmailAndPassword(auth, emailValue, passwordValue)
        .then((userCred) => {
          setRedirect(true);
        })
        .catch((err) => {})
    );
  };

  const loginWithGoolge = () => {
    if (!agreementsChecked) {
      setAgreementsError();
      return;
    }
    setPersistence(auth, browserSessionPersistence).then(() => {
      signInWithPopup(auth, gauthProvider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential!.accessToken;
          const user = result.user;
          setRedirect(true);
          console.log(user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(
            "Erreur d'authentification",
            errorCode,
            " ",
            errorMessage
          );
        });
    });
  };

  const clickAgreements = (e: React.MouseEvent<HTMLElement>) => {
    const checkBox = document.querySelector(
      "#agreements > input"
    ) as HTMLInputElement;
    checkBox.checked = agreementsChecked ? false : true;
    setAgreementsChecked(checkBox.checked);
  };

  // ****************** Rendering *****************

  return (
    <div id="main-login">
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
      <div className="login-app">
        <div id="logo">
          <img src={logo} alt="" />
        </div>
        <p id="sign-up-suggestion">
          First time here? then <Link to="/signup">Sign up!</Link>
        </p>
        <div id="email">
          <span>Email</span>
          <input
            type="email"
            id="email-input"
            onChange={(e) => setEmailValue(e.target.value)}
            placeholder="Enter user email..."
          />
        </div>
        <div id="password">
          <span>Password</span>
          <input
            id="password-input"
            type="password"
            onChange={(e) => setPasswordValue(e.target.value)}
            placeholder="********"
          />
        </div>
        <div id="agreements">
          <input
            type="checkbox"
            checked={agreementsChecked}
            onChange={(e) => setAgreementsChecked(e.currentTarget.checked)}
          />
          <p onClick={clickAgreements}>Accept all agreements</p>
        </div>
        <div id="buttons">
          <button id="forgot-password-button">Forgot password</button>
          <button id="login-button" onClick={redirectToLogin}>
            Login
          </button>
        </div>
        <p>Or login with: </p>
        <div id="social-login">
          <FcGoogle id="google" onClick={loginWithGoolge} />
        </div>
      </div>
    </div>
  );
}

export default Login;
