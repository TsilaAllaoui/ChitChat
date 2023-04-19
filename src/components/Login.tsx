import { AiOutlineGoogle, AiOutlineMail, AiOutlineFacebook } from "react-icons/ai";
import { browserSessionPersistence, getAuth, setPersistence, signInWithEmailAndPassword } from "@firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import logo from "../assets/logo.svg";
import "../styles/Login.scss";
import app from "../Firebase";

function Login() {

  // States for the inputs
  const [emailValue, setEmailValue] = useState("ratsilakwel@gmail.com");
  const [passwordValue, setPasswordValue] = useState("123456789");

  // For navigation
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (redirect) {
      alert("Login success... Redirecting to conversations...");
      navigate("/main");
    }
  }, [redirect]);

  // For login redirection
  const redirectToLogin = () => {
    const auth = getAuth(app);

    setPersistence(auth, browserSessionPersistence).then(() => 
    signInWithEmailAndPassword(auth, emailValue, passwordValue)
    .then((userCred) => {
      setRedirect(true);
    })
    .catch((err) => {
      console.log("Error login...");
      console.log(err.code, " : ", err.message);
    }))
  };

  return (
    <div className="loginApp">
      <div id="logo">
        <img src={logo} alt="" />
      </div>
      <p id="sign-up-suggestion">
        First time here? then{" "}
        <Link to="/signup">Sign up!</Link>
      </p>
      <div id="email">
        <span>Email</span>
        <input
          type="email"
          id="email-input"
          onChange={(e) => setEmailValue(e.target.value)}
          defaultValue="Enter user email..."
        />
      </div>
      <div id="password">
        <span>Password</span>
        <input
          id="password-input"
          type="password"
          onChange={(e) => setPasswordValue(e.target.value)}
          defaultValue="********"
        />
      </div>
      <div id="agreements">
        <input type="checkbox" />
        <p>Accept all agreements</p>
      </div>
      <div id="buttons">
        <button id="forgot-password-button">Forgot password</button>
        <button id="login-button" onClick={redirectToLogin}>
          Login
        </button>
      </div>
      <p>Or login with: </p>
      <div id="social-login">
        <FcGoogle id="google" />
        <AiOutlineMail id="mail" />
        <AiOutlineFacebook id="fb" />
      </div>
    </div>
  );
}

export default Login;