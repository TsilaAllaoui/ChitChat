import {
  browserSessionPersistence,
  getAuth,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useContext, useEffect, useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { MdErrorOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import { IsLoginContext } from "../Contexts/IsLoginContext";
import { RedirectPopupContext } from "../Contexts/RedirectPopupContext";
import { UserContext } from "../Contexts/UserContext";
import app, { auth, gauthProvider } from "../Firebase";
import logo from "../assets/logo.svg";
import "../styles/LoginForm.scss";
import Terms from "./Model/Terms";
import Popup from "./Popup";

function LoginForm() {
  // ************** States **************

  // For navigation
  const { setRedirect } = useContext(RedirectPopupContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetPwdContent, setResetPwdContent] = useState("");

  const { user, setUser } = useContext(UserContext);
  const setIsLogin = useContext(IsLoginContext).setIsLogin;

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

  useEffect(() => {
    console.log(user);
  }, [user]);

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
  const loginWithEmailAndPassword = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (!agreementsChecked) {
      setAgreementsError();
      return;
    }

    if (!/\S+@\S+\.\S+/.test(emailValue)) {
      setError("Invalid Email provided.");
      return;
    }

    const auth = getAuth(app);
    setLoading(true);
    setPersistence(auth, browserSessionPersistence).then(() => {
      signInWithEmailAndPassword(auth, emailValue, passwordValue)
        .then((userCred) => {
          setUser(userCred.user);
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
          setLoading(false);
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
        .then((userCred) => {
          setUser(userCred.user);
          setRedirect(true);
          setTimeout(() => navigate("/main"), 2000);
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

  const clickAgreements = () => {
    const checkBox = document.querySelector(
      "#agreements > input"
    ) as HTMLInputElement;
    checkBox.checked = agreementsChecked ? false : true;
    setAgreementsChecked(checkBox.checked);
  };

  const goToSignUp = () => {
    setIsLogin(false);
  };

  const sendVerificationEmail = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (emailValue == "") {
      setError("No Email adress provided.");
      return;
    } else if (!/\S+@\S+\.\S+/.test(emailValue)) {
      setError("Invalid Email provided.");
      return;
    }

    sendPasswordResetEmail(auth, emailValue)
      .then(() => {
        setResetPwdContent("Reset Password Email sent!");
      })
      .catch(() => {
        setResetPwdContent("Error sending Reset Password Email!");
      });
  };

  // ************** Rendering ****************

  return (
    <form className="login-app" onSubmit={loginWithEmailAndPassword}>
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
        <button id="forgot-password-button" onClick={sendVerificationEmail}>
          Forgot password
        </button>
        <button id="login-button" onClick={loginWithEmailAndPassword}>
          {loading ? (
            <ScaleLoader
              color="#FFFFFF"
              loading={loading}
              height={10}
              width={2}
              radius={15}
              margin={1}
            ></ScaleLoader>
          ) : (
            <span>Login</span>
          )}
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
      {resetPwdContent != "" ? (
        <Popup
          content={resetPwdContent}
          hidePopup={() => setResetPwdContent("")}
        />
      ) : null}
    </form>
  );
}

export default LoginForm;
