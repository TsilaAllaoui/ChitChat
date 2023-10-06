import {
  GoogleAuthProvider,
  browserSessionPersistence,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useContext, useEffect, useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { MdErrorOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { RedirectPopupContext } from "../Contexts/RedirectPopupContext";
import app, { auth, gauthProvider } from "../Firebase";
import logo from "../assets/logo.svg";
import "../styles/LoginForm.scss";
import Terms from "./Model/Terms";

function LoginForm({ unsetIsLogin }: { unsetIsLogin: () => void }) {
  // ************** States **************

  // For navigation
  const { redirect, setRedirect } = useContext(RedirectPopupContext);
  const navigate = useNavigate();

  const [error, setError] = useState("");

  // States for the inputs
  const [emailValue, setEmailValue] = useState("ratsilakwel@gmail.com");
  const [passwordValue, setPasswordValue] = useState("123456789");
  const [agreementsChecked, setAgreementsChecked] = useState(false);
  const [showAgreements, setShowAgreements] = useState(false);

  const errorRef = useRef<HTMLDivElement>(null);

  // ************** Effects ****************

  useEffect(() => {
    const loginApp = document.querySelector(".login-app") as HTMLElement;
    loginApp.style.animation = "fade-in 500ms ease-in-out forwards";
  }, []);

  useEffect(() => {
    if (error != "") {
      errorRef.current!.style.opacity = "1";
    }

    setTimeout(() => {
      errorRef.current!.style.opacity = "0";
      setTimeout(() => {
        setError("");
      }, 500);
    }, 2000);
  }, [error]);

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
    setPersistence(auth, browserSessionPersistence).then(() => {
      signInWithEmailAndPassword(auth, emailValue, passwordValue)
        .then((userCred) => {
          setRedirect(true);
          setTimeout(() => navigate("/main"), 2000);
        })
        .catch((err) => {
          setRedirect(false);
          let e: string = err.message
            .replace("Firebase: Error (", "")
            .replace(")", "")
            .replace("-", " ");
          setError(e[0].toUpperCase() + e.slice(1));
        });
    });
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

  const goToSignUp = (e: React.MouseEvent<HTMLSpanElement>) => {
    unsetIsLogin();
  };

  // ************** Rendering ****************

  return (
    <div className="login-app">
      <div id="logo">
        <img src={logo} alt="" />
      </div>
      <p id="sign-up-suggestion">
        First time here? then <span onClick={goToSignUp}>Sign up!</span>
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
      <div className="error" ref={errorRef}>
        <MdErrorOutline id="icon" />
        <p>{error}</p>
      </div>
      <p>Or login with: </p>
      <div id="social-login">
        <FcGoogle id="google" onClick={loginWithGoolge} />
        <p onClick={() => setShowAgreements(true)}>Show terms and agreements</p>
      </div>
      <Terms
        showAgreements={showAgreements}
        hideAgreements={() => setShowAgreements(false)}
      />
    </div>
  );
}

export default LoginForm;
